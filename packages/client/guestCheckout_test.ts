// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: MIT

// TODO: this should be folded into the correct sub-test(..) in relayClient.test.ts
import { expect } from "jsr:@std/expect";
import { describe, it } from "jsr:@std/testing/bdd";
import {
  hexToBytes,
  toHex,
  createWalletClient,
  createPublicClient,
  http,
  pad,
  type Address,
  type Account,
} from "viem";
import { hardhat } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { random32BytesHex } from "@massmarket/utils";
import * as abi from "@massmarket/contracts";
import {
  randomAddress,
  anvilPrivateKey2,
  priceToUint256,
  objectId,
  zeroAddress,
} from "@massmarket/utils";
import {
  BlockchainClient,
  type ConcreteWalletClient,
} from "@massmarket/blockchain";
import { RelayClient, discoverRelay } from "./mod.ts";
import type schema from "../schema/mod.ts";

describe({
  name: "guestCheckout",
  sanitizeResources: false,
  sanitizeOps: false,
  fn() {
    // this key is from one of anvil's default keypairs
    const account = privateKeyToAccount(anvilPrivateKey2);

    const wallet = createWalletClient({
      account,
      chain: hardhat,
      transport: http(),
    });

    const publicClient = createPublicClient({
      chain: hardhat,
      transport: http(),
    });

    let blockchain: BlockchainClient;
    const relayURL = Deno.env.get("RELAY_ENDPOINT") || "ws://localhost:4444/v3";

    async function createRelayClient(pk = random32BytesHex()) {
      const relayEndpoint = await discoverRelay(relayURL);
      return new RelayClient({
        relayEndpoint,
        keyCardWallet: privateKeyToAccount(pk),
      });
    }

    const shopId = random32BytesHex();
    blockchain = new BlockchainClient(shopId);

    it("create shop", async () => {
      // create a shop
      const transactionHash = await blockchain.createShop(wallet);
      // wait for the transaction to be included in the blockchain
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: transactionHash,
      });
      expect(receipt.status).toBe("success");
    });

    let relayClient: RelayClient;
    it("enroll keycard", async () => {
      relayClient = await createRelayClient();
      const windowLocation =
        typeof window == "undefined"
          ? undefined
          : new URL(window.location.href);
      const enrolledResponse = await relayClient.enrollKeycard(
        wallet,
        false,
        shopId,
        windowLocation,
      );
      expect(enrolledResponse.status).toBe(201);
    });

    // create a random address to pay to
    let payee: Uint8Array = hexToBytes(randomAddress());
    let currency: Uint8Array = hexToBytes(abi.addresses.Eddies as Address);

    it("write shop manifest", async () => {
      await relayClient.connect();
      await relayClient.authenticate();
      await relayClient.shopManifest(
        {
          payees: [
            {
              address: { raw: payee },
              callAsContract: false,
              chainId: 31337,
              name: "test",
            },
          ],
          acceptedCurrencies: [
            {
              address: { raw: currency },
              chainId: 31337,
            },
          ],
          pricingCurrency: {
            chainId: 10,
            address: { raw: currency },
          },
          shippingRegions: [
            {
              name: "Paul Atreides",
              city: "Arakkis",
              postalCode: "SE10 9EZ",
              country: "Dune",
              orderPriceModifiers: [],
            },
          ],
        },
        shopId,
      );
    });

    let itemId = { raw: objectId() };
    it("should create a item", async () => {
      const metadata = {
        title: "guestCheckout test item",
        description: "test",
        images: ["https://http.cat/images/200.jpg"],
      };

      // create an item
      await relayClient.listing({
        id: itemId,
        price: { raw: priceToUint256("10.99") },
        metadata,
      });
    });

    let guestAccount: Account;
    let guestRelayClient: RelayClient;
    let guestWallet: ConcreteWalletClient;

    it("create and enroll guest", async () => {
      // generate a random guest
      const sk = random32BytesHex();
      guestAccount = privateKeyToAccount(sk);
      await wallet.sendTransaction({
        account,
        to: guestAccount.address,
        value: BigInt("250000000000000000"),
      });
      const w = createWalletClient({
        account: guestAccount,
        chain: hardhat,
        transport: http(),
      });

      guestRelayClient = await createRelayClient(sk);
      // enroll the guest client
      const windowLocation =
        typeof window == "undefined"
          ? undefined
          : new URL(window.location.href);
      const response = await guestRelayClient.enrollKeycard(
        w,
        true,
        shopId,
        windowLocation,
      );
      await guestRelayClient.connect();
      await guestRelayClient.authenticate();
      await guestRelayClient.sendGuestCheckoutSubscriptionRequest(shopId);

      expect(response.status).toBe(201);
      guestWallet = w;
    });

    let orderId: schema.IObjectId;
    it("create an order", async () => {
      // create an order
      orderId = { raw: objectId() };
      await guestRelayClient.createOrder({ id: orderId });
    });

    it("guest checkout", async () => {
      await relayClient.changeInventory({
        id: itemId,
        diff: 10,
      });
      console.log("inventory changed", itemId);
      await guestRelayClient.updateOrder({
        id: orderId,
        changeItems: {
          adds: [{ listingId: itemId, quantity: 1 }],
        },
      });
      console.log("items changed", orderId);
      await guestRelayClient.updateOrder({ id: orderId, commitItems: {} });
      console.log("items committed", orderId);
      await guestRelayClient.updateOrder({
        id: orderId,
        setInvoiceAddress: {
          name: "test",
          address1: "100 Colomb Street",
          city: "Arakkis",
          postalCode: "SE10 9EZ",
          country: "Dune",
          phoneNumber: "0103330524",
          emailAddress: "arakkis@dune.planet",
        },
        setShippingAddress: {
          name: "test",
          address1: "100 Colomb Street",
          city: "Arakkis",
          postalCode: "SE10 9EZ",
          country: "Dune",
          phoneNumber: "0103330524",
          emailAddress: "arakkis@dune.planet",
        },
      });
      console.log("address updated", orderId);
      await guestRelayClient.updateOrder({
        id: orderId,
        choosePayment: {
          currency: {
            chainId: 31337,
            address: { raw: currency },
          },
          payee: {
            address: { raw: payee },
            callAsContract: false,
            chainId: 31337,
            name: "test",
          },
        },
      });
      console.log("payment chosen", orderId);
      const stream = guestRelayClient.createEventStream();
      for await (const { event } of stream) {
        //FIXME: not getting payment details currently for guests. use payTokenPreApproved here once paymentdetails comes through.
        console.log("event inside stream", event.updateOrder);
        if (event.updateOrder?.setPaymentDetails) {
          console.log("event.updateOrder", event.updateOrder);
          return;
        }
      }
    });

    it("create a new order", async () => {
      // create an order
      orderId = { raw: objectId() };
      await guestRelayClient.createOrder({ id: orderId });
    });

    it("guest updating an order", async () => {
      await guestRelayClient.updateOrder({
        id: orderId,
        changeItems: {
          adds: [{ listingId: itemId, quantity: 1 }],
        },
      });
    });

    it("single item checkout with a guest", async () => {
      // give the guest account some money to spend
      const txHash = await wallet.writeContract({
        address: abi.addresses.Eddies as Address,
        abi: abi.Eddies,
        functionName: "mint",
        args: [guestAccount.address, 999999999999],
      });

      // allow the payment contract to transfer on behalf of the guest user
      const hash = await guestWallet.writeContract({
        address: abi.addresses.Eddies as Address,
        abi: abi.Eddies,
        functionName: "approve",
        args: [abi.addresses.Payments, 9999999999],
      });
      const receipt = await publicClient.waitForTransactionReceipt({
        hash,
      });
      expect(receipt.status).toEqual("success");


      const stream = guestRelayClient.createEventStream();
      for await (const { event } of stream) {
        if (event.updateOrder?.setPaymentDetails) {
          const order = event.updateOrder.setPaymentDetails;
          const args = [
            31337,
            order.ttl,
            pad(zeroAddress, { size: 32 }), //orderHash
            toHex(currency), //currency address
            toHex(order.total.raw),
            toHex(payee), //payee address
            false, // is paymentendpoint?
            shopId,
            toHex(order.shopSignature.raw),
          ];
          const paymentId = (await publicClient.readContract({
            address: abi.addresses.Payments as Address,
            abi: abi.PaymentsByAddress,
            functionName: "getPaymentId",
            args: [args],
          })) as bigint;
          expect(toHex(order.paymentId.raw)).toEqual(toHex(paymentId));
    
          // TODO: call the pay function
          // const hash = await guestWallet.writeContract({
          //   address: abi.addresses.Payments as Address,
          //   abi: abi.PaymentsByAddress,
          //   functionName: "payTokenPreApproved",
          //   args: [args],
          // });
          // const receipt = await publicClient.waitForTransactionReceipt({
          //   hash,
          // });
          // expect(receipt.status).toEqual("success");
          return;
        }
      }
    });
  },
});

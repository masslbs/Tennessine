// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: MIT

// TODO: this should be folded into the correct sub-test(..) in relayClient.test.ts
import { expect } from "jsr:@std/expect";
import { describe, it } from "jsr:@std/testing/bdd";
import {
  type Account,
  type Address,
  bytesToBigInt,
  createPublicClient,
  createWalletClient,
  hexToBytes,
  http,
  toHex,
} from "viem";
import { hardhat } from "viem/chains";
import { bytesToHex } from "viem/utils";
import { privateKeyToAccount } from "viem/accounts";
import { random256BigInt, random32BytesHex } from "@massmarket/utils";
import {
  addresses,
  anvilPrivateKey2,
  eddiesAbi,
  paymentsByAddressAbi,
} from "@massmarket/contracts";
import { objectId, priceToUint256 } from "@massmarket/utils";
import { type ConcreteWalletClient, mintShop } from "@massmarket/blockchain";
import type schema from "@massmarket/schema";
import { discoverRelay, RelayClient } from "./mod.ts";

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

    const relayURL = Deno.env.get("RELAY_ENDPOINT") || "ws://localhost:4444/v3";

    async function createRelayClient(pk = random32BytesHex()) {
      const relayEndpoint = await discoverRelay(relayURL);
      return new RelayClient({
        relayEndpoint,
        keyCardWallet: privateKeyToAccount(pk),
      });
    }

    const shopId = random256BigInt();

    it("create shop", async () => {
      // create a shop
      const transactionHash = await mintShop(wallet, [
        shopId,
        wallet.account.address,
      ]); // wait for the transaction to be included in the blockchain
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: transactionHash,
      });
      expect(receipt.status).toBe("success");
    });

    let relayClient: RelayClient;
    it("enroll keycard", async () => {
      relayClient = await createRelayClient();
      const windowLocation = typeof window == "undefined"
        ? undefined
        : new URL(globalThis.location.href);
      const enrolledResponse = await relayClient.enrollKeycard(
        wallet,
        false,
        shopId,
        windowLocation,
      );
      expect(enrolledResponse.status).toBe(201);
    });

    // create a random address to pay to
    const payee: Uint8Array = hexToBytes(addresses.anvilAddress);
    const currency: Uint8Array = hexToBytes(addresses.Eddies as Address);

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

    const itemId = { raw: objectId() };
    it("should create a item", async () => {
      const metadata = {
        title: "guestCheckout test item",
        description: "test",
        images: ["https://http.cat/images/200.jpg"],
      };

      // create an item
      await relayClient.listing({
        id: itemId,
        price: { raw: priceToUint256("1.99") },
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
        value: 13980000000000000000n,
      });

      const w = createWalletClient({
        account: guestAccount,
        chain: hardhat,
        transport: http(),
      });

      guestRelayClient = await createRelayClient(sk);
      // enroll the guest client
      const windowLocation = typeof window == "undefined"
        ? undefined
        : new URL(globalThis.location.href);
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
      await guestRelayClient.updateOrder({
        id: orderId,
        changeItems: {
          adds: [{ listingId: itemId, quantity: 1 }],
        },
      });
      await guestRelayClient.updateOrder({ id: orderId, commitItems: {} });
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
    });

    it("single item checkout with a guest", async () => {
      // give the guest account some money to spend
      const txHash1 = await wallet.writeContract({
        address: addresses.Eddies as Address,
        abi: eddiesAbi,
        functionName: "mint",
        args: [guestAccount.address, 3980000000000000000n],
      });

      const receipt1 = await publicClient.waitForTransactionReceipt({
        hash: txHash1,
      });
      expect(receipt1.status).toEqual("success");

      const stream = guestRelayClient.createEventStream();
      let paymentHash: `0x${string}` | undefined;
      for await (const { event } of stream) {
        if (event.updateOrder?.setPaymentDetails) {
          const paymentDetails = event.updateOrder.setPaymentDetails;
          const total = paymentDetails.total!.raw!;
          const args = {
            chainId: 31337n,
            ttl: BigInt(paymentDetails.ttl!),
            order: bytesToHex(new Uint8Array(32)),
            currency: bytesToHex(currency),
            amount: bytesToBigInt(total),
            payeeAddress: bytesToHex(payee),
            isPaymentEndpoint: false,
            shopId: shopId,
            shopSignature: toHex(paymentDetails.shopSignature!.raw!),
          };
          const paymentId = (await publicClient.readContract({
            address: addresses.Payments as Address,
            abi: paymentsByAddressAbi,
            functionName: "getPaymentId",
            args: [args],
          })) as bigint;

          expect(toHex(paymentDetails.paymentId!.raw!)).toEqual(
            toHex(paymentId),
          );
          // allow the payment contract to transfer on behalf of the guest user
          const txHash2 = await guestWallet.writeContract({
            address: addresses.Eddies as Address,
            abi: eddiesAbi,
            functionName: "approve",
            args: [addresses.Payments, bytesToBigInt(total)],
          });
          const receipt2 = await publicClient.waitForTransactionReceipt({
            hash: txHash2,
          });
          expect(receipt2.status).toEqual("success");

          // call the pay function
          const hash = await guestWallet.writeContract({
            address: addresses.Payments as Address,
            abi: paymentsByAddressAbi,
            functionName: "pay",
            args: [args],
            value: bytesToBigInt(total),
          });
          const receipt = await publicClient.waitForTransactionReceipt({
            hash,
          });
          expect(receipt.status).toEqual("success");
          paymentHash = hash;
        }
        // check for payment confirmation by the relay before exiting
        // TODO: add timeout
        if (event.updateOrder?.addPaymentTx) {
          expect(event.updateOrder.id).toEqual(orderId);
          expect(toHex(event.updateOrder!.addPaymentTx!.txHash!.raw!)).toEqual(
            paymentHash,
          );
          return;
        }
      }
    });
  },
});

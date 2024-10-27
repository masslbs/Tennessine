// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: MIT

// TODO: this should be folded into the correct sub-test(..) in relayClient.test.ts
import { expect } from "jsr:@std/expect";
import { describe, test } from "jsr:@std/testing/bdd";
import {
  hexToBytes,
  toHex,
  createWalletClient,
  createPublicClient,
  http,
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
} from "@massmarket/utils";
import {
  BlockchainClient,
  type ConcreteWalletClient,
} from "@massmarket/blockchain";
import { RelayClient, discoverRelay } from "./mod.ts";

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

    test("create shop", async () => {
      // create a shop
      const transactionHash = await blockchain.createShop(wallet);
      // wait for the transaction to be included in the blockchain
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: transactionHash,
      });
      expect(receipt.status).toBe("success");
    });

    let relayClient: RelayClient;
    test("enroll keycard", async () => {
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

    test("write shop manifest", async () => {
      await relayClient.connect();
      await relayClient.authenticate();
      await relayClient.shopManifest(
        {
          payees: [
            {
              address: {
                raw: hexToBytes(randomAddress()),
              },
              callAsContract: false,
              chainId: 1,
              name: "default",
            },
          ],
          acceptedCurrencies: [
            {
              chainId: 10,
              address: { raw: currency },
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

    test("update shop manifest", async () => {
      // tell the relay to accept our money
      await relayClient.updateShopManifest({
        addAcceptedCurrencies: [
          {
            address: { raw: currency },
            chainId: 31337,
          },
        ],
        addPayee: {
          address: { raw: payee },
          callAsContract: false,
          chainId: 31337,
          name: "test",
        },
      });
    });

    let itemId = { raw: objectId() };
    test("should create a item", async () => {
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
    test("create and enroll guest", async () => {
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

      expect(response.status).toBe(201);
      guestWallet = w;
    });

    const orderId = { raw: objectId() };
    test("guest creating an order", async () => {
      // create an order
      await guestRelayClient.createOrder({ id: orderId });
    });

    test("guest updating an order", async () => {
      await guestRelayClient.updateOrder({
        id: orderId,
        changeItems: {
          adds: [{ listingId: itemId, quantity: 1 }],
        },
      });
    });

    Deno.test.ignore(
      "single item checkout with a guest",
      async () => {
        // give the guest account some money to spend
        const txHash = await wallet.writeContract({
          address: abi.addresses.Eddies as Address,
          abi: abi.Eddies,
          functionName: "mint",
          args: [guestAccount.address, 999999999999],
        });

        const mintComplete = publicClient
          .waitForTransactionReceipt({
            hash: txHash,
          })
          .then(() => {
            // allow the payment contract to transfer on behalf of the geuest user
            return guestWallet.writeContract({
              address: abi.addresses.Eddies as Address,
              abi: abi.Eddies,
              functionName: "approve",
              args: [abi.addresses.Payments, 9999999999],
            });
          })
          .then((hash) => {
            return publicClient.waitForTransactionReceipt({
              hash,
            });
          });

        // iterate through the event stream
        const stream = guestRelayClient.createEventStream();
        for await (const { event } of stream) {
          // wait for the order to be finalized
          if (event.updateOrder?.itemsFinalized) {
            const order = event.updateOrder.itemsFinalized;
            const args = [
              31337, // chainid
              order.ttl,
              toHex(order.orderHash),
              toHex(order.currencyAddr),
              toHex(order.totalInCrypto),
              toHex(order.payeeAddr),
              false, // is paymentendpoint?
              shopId,
              toHex(order.shopSignature),
            ];

            const paymentId = (await publicClient.readContract({
              address: abi.addresses.Payments as Address,
              abi: abi.PaymentsByAddress,
              functionName: "getPaymentId",
              args: [args],
            })) as bigint;
            expect(toHex(order.paymentId)).toEqual(toHex(paymentId));
            // need to wait for the minting of eddies to be done before sending them
            await mintComplete;
            // call the pay function
            throw new Error("not implemented");
            // guestWallet.writeContract({
            //   address: abi.addresses.Payments as Address,
            //   abi: abi.PaymentsByAddress,
            //   functionName: "payTokenPreApproved",
            //   args: [args],
            // });
          } else if (event.changeInventory) {
            expect(toHex(event.changeInventory.itemIds[0])).toEqual(
              toHex(itemId.raw),
            );
            return;
          }
        }
      },
    );
  },
});

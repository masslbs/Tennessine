// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: MIT

import { WebSocket } from "isows";
import {
  bytesToBigInt,
  bytesToHex,
  createPublicClient,
  createWalletClient,
  hexToBytes,
  http,
  toHex,
} from "viem";
import { hardhat } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { beforeAll, beforeEach, describe, test } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import {
  objectId,
  priceToUint256,
  random256BigInt,
  random32BytesHex,
  randomBytes,
} from "@massmarket/utils";
import {
  addresses,
  anvilPrivateKey,
  paymentsByAddressAbi,
  permissions,
  shopRegAbi,
} from "@massmarket/contracts";
import {
  getPaymentId,
  mintShop,
  publishInviteVerifier,
  redeemInviteSecret,
} from "@massmarket/blockchain";

import { discoverRelay, RelayClient } from "./mod.ts";

const windowLocation = typeof window == "undefined"
  ? undefined
  : new URL(globalThis.location.href);
// this key is from one of anvil's default keypairs
const account = privateKeyToAccount(anvilPrivateKey);

const wallet = createWalletClient({
  account,
  chain: hardhat,
  transport: http(),
});

const publicClient = createPublicClient({
  chain: hardhat,
  transport: http(),
});

const shopId = random256BigInt();
const relayURL = Deno.env.get("RELAY_ENDPOINT") || "ws://localhost:4444/v3";
const relayEndpoint = await discoverRelay(relayURL);

function createRelayClient(pk = random32BytesHex()) {
  return new RelayClient({
    relayEndpoint,
    keyCardWallet: privateKeyToAccount(pk),
  });
}

describe({
  name: "RelayClient",
  sanitizeResources: false,
  sanitizeOps: false,
  fn() {
    describe("RelayClient", () => {
      const relayClient = createRelayClient();
      test("should create a shop", async () => {
        const transactionHash = await mintShop(wallet, [
          shopId,
          wallet.account.address,
        ]); // wait for the transaction to be included in the blockchain
        const receipt = await publicClient.waitForTransactionReceipt({
          hash: transactionHash,
        });
        expect(receipt.status).toBe("success");
      });

      test("registrationTokenRedeem", async () => {
        // still contrived, we would use a separate keypair in reality and pass it via some sidechannel
        //
        // acc2 is the "long term wallet" of the new user
        // if we knew that before hand, we could just call registerUser(acc2.address, Clerk)
        const sk = random32BytesHex();
        const token = privateKeyToAccount(sk);
        const hash = await publishInviteVerifier(wallet, [
          shopId,
          token.address,
        ]);

        // wait for the transaction to be included in the blockchain
        const receipt = await publicClient.waitForTransactionReceipt({
          hash,
        });
        expect(receipt.status).toBe("success");
        const acc2 = privateKeyToAccount(sk);
        await wallet.sendTransaction({
          account,
          to: acc2.address,
          value: BigInt("250000000000000000"),
        });

        const client2Wallet = createWalletClient({
          account: acc2,
          chain: hardhat,
          transport: http(),
        });

        const relayClient2 = new RelayClient({
          relayEndpoint,
          keyCardWallet: privateKeyToAccount(sk),
        });

        const hash2 = await redeemInviteSecret(sk, client2Wallet, shopId);
        // wait for the transaction to be included in the blockchain
        const transaction = await publicClient.waitForTransactionReceipt({
          hash: hash2,
        });
        expect(transaction.status).toBe("success");

        // verify access level
        const canUpdateRootHash = await publicClient.readContract({
          address: addresses.ShopReg,
          abi: shopRegAbi,
          functionName: "hasPermission",
          args: [shopId, acc2.address, permissions.updateRootHash],
        });
        expect(canUpdateRootHash).toBe(true);
        const canRemoveUser = await publicClient.readContract({
          address: addresses.ShopReg,
          abi: shopRegAbi,
          functionName: "hasPermission",
          args: [shopId, acc2.address, permissions.removeUser],
        });
        expect(canRemoveUser).toBe(false);
        await Promise.all([
          relayClient2.disconnect(),
          relayClient.disconnect(),
        ]);
      });
    });

    describe("user behaviour", () => {
      const relayClient = createRelayClient();

      // enroll and login
      test("should enroll keycard", async () => {
        const response = await relayClient.enrollKeycard(
          wallet,
          false,
          shopId,
          windowLocation,
        );
        expect(response.status).toBe(201);
      });

      test("should connect and disconnect", async () => {
        await relayClient.connect();
        const authenticated = await relayClient.authenticate();
        expect(relayClient.connection.readyState).toBe(WebSocket.OPEN);
        expect(authenticated.response?.error).toBeNull();
        await relayClient.disconnect();
        expect(relayClient.connection.readyState).toBe(WebSocket.CLOSED);
        // check connection can be reopened
        await relayClient.connect();
        await relayClient.authenticate();
        expect(relayClient.connection.readyState).toBe(WebSocket.OPEN);
      });

      test("should reconnect", async () => {
        await relayClient.disconnect();
        await relayClient.connect();
        await relayClient.authenticate();
        await relayClient.sendMerchantSubscriptionRequest(shopId);
        expect(relayClient.connection.readyState).toBe(WebSocket.OPEN);
      });

      test("write shop manifest", async () => {
        await relayClient.shopManifest(
          {
            payees: [
              {
                address: {
                  raw: hexToBytes(addresses.anvilAddress),
                },
                callAsContract: false,
                chainId: 31337,
                name: "default",
              },
            ],
            acceptedCurrencies: [
              {
                chainId: 10,
                address: { raw: hexToBytes(addresses.zeroAddress) },
              },
            ],
            pricingCurrency: {
              chainId: 10,
              address: { raw: hexToBytes(addresses.zeroAddress) },
            },
            shippingRegions: [
              {
                name: "test",
                country: "test country",
                postalCode: "test postal",
                city: "test city",
                orderPriceModifiers: [],
              },
            ],
          },
          shopId,
        );
      });
      test("update shop manifest", async () => {
        await relayClient.updateShopManifest({
          addAcceptedCurrencies: [
            {
              address: { raw: hexToBytes(addresses.Eddies) },
              chainId: 31337,
            },
            {
              address: { raw: hexToBytes(addresses.zeroAddress) },
              chainId: 31337,
            },
          ],
        });
        await relayClient.updateShopManifest({
          removeAcceptedCurrencies: [
            {
              address: { raw: hexToBytes(addresses.Eddies) },
              chainId: 31337,
            },
          ],
        });
      });

      test("blob upload", async () => {
        const file = new File(["foo"], "foo.txt", {
          type: "text/plain",
        });
        const formData = new FormData();
        formData.append("file", file);
        const result = await relayClient.uploadBlob(formData);
        expect(result.ipfs_path).toBe(
          "/ipfs/QmcJw6x4bQr7oFnVnF6i8SLcJvhXjaxWvj54FYXmZ4Ct6p",
        );
      });

      describe("editing listing + tag", () => {
        const id = { raw: objectId() };
        beforeAll(async () => {
          const metadata = {
            title: "test",
            description: "test",
            images: ["https://http.cat/images/200.jpg"],
          };
          const price = priceToUint256("12.99");

          const requestId = await relayClient.listing({
            id,
            price: {
              raw: price,
            },
            metadata,
          });
          expect(requestId).not.toBeNull();
        });

        test("update item - metadata", async () => {
          const requestId = await relayClient.updateListing({
            id,
            metadata: {
              title: "new name",
              images: ["https://http.cat/images/200.jpg"],
            },
          });
          expect(requestId).not.toBeNull();
        });
        const tagId = { raw: objectId() };

        test("create tag", async () => {
          const requestId = await relayClient.tag({
            id: tagId,
            name: "Test Tag",
          });
          expect(requestId).not.toBeNull();
        });
        test("update tag", async () => {
          const requestId = await relayClient.updateTag({
            id: tagId,
            addListingIds: [id],
          });
          expect(requestId).not.toBeNull();
        });
      });
      describe("merchant checkout", () => {
        const id = { raw: objectId() };
        beforeAll(async () => {
          const metadata = {
            title: "test",
            description: "test",
            images: ["https://http.cat/images/200.jpg"],
          };
          const price = priceToUint256("12.99");

          const requestId = await relayClient.listing({
            id,
            price: {
              raw: price,
            },
            metadata,
          });
          expect(requestId).not.toBeNull();
        });
        test("should update stock", async () => {
          await relayClient.changeInventory({
            id,
            diff: 10,
          });
        });

        test("client commits an order", async () => {
          const orderId = { raw: objectId() };

          await relayClient.createOrder({ id: orderId });
          await relayClient.updateOrder({
            id: orderId,
            changeItems: {
              adds: [{ listingId: id, quantity: 1 }],
            },
          });
          await relayClient.updateOrder({
            id: orderId,
            setInvoiceAddress: {
              name: "test",
              address1: "100 Colomb Street",
              country: "test country",
              postalCode: "test postal",
              city: "test city",
              phoneNumber: "0103330524",
              emailAddress: "arakkis@dune.planet",
            },
            setShippingAddress: {
              name: "test",
              address1: "100 Colomb Street",
              country: "test country",
              postalCode: "test postal",
              city: "test city",
              phoneNumber: "0103330524",
              emailAddress: "arakkis@dune.planet",
            },
          });
          await relayClient.updateOrder({ id: orderId, commitItems: {} });
          console.log("he#####");
          await relayClient.updateOrder({
            id: orderId,
            choosePayment: {
              currency: {
                chainId: 31337,
                address: { raw: hexToBytes(addresses.zeroAddress) },
              },
              payee: {
                address: { raw: hexToBytes(addresses.anvilAddress) },
                callAsContract: false,
                chainId: 31337,
                name: "default",
              },
            },
          });
          const stream = relayClient.createEventStream();
          let paymentHash: `0x${string}` | undefined;
          for await (const { event } of stream) {
            if (event.updateOrder?.setPaymentDetails) {
              const paymentDetails = event.updateOrder.setPaymentDetails;
              const total = paymentDetails.total!.raw!;
              const args = {
                chainId: 31337n,
                ttl: BigInt(paymentDetails.ttl!),
                order: bytesToHex(new Uint8Array(32)),
                currency: addresses.zeroAddress, //currency address
                amount: bytesToBigInt(total),
                payeeAddress: addresses.anvilAddress, //payee address
                isPaymentEndpoint: false, // is paymentendpoint?
                shopId: shopId,
                shopSignature: toHex(paymentDetails.shopSignature!.raw!),
              };
              const paymentId = await getPaymentId(publicClient, [args]);

              expect(paymentDetails.paymentId!.raw!).toEqual(paymentId);

              const hash = await wallet.writeContract({
                address: addresses.Payments,
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
              expect(
                toHex(event!.updateOrder!.addPaymentTx!.txHash!.raw!),
              ).toEqual(paymentHash);
              return;
            }
          }
        });
      });

      describe("invite another user", () => {
        let client2Wallet;
        let relayClient2: RelayClient;
        beforeEach(async () => {
          const sk = random32BytesHex();
          const token = privateKeyToAccount(sk);
          const hash = await publishInviteVerifier(wallet, [
            shopId,
            token.address,
          ]);
          // wait for the transaction to be included in the blockchain
          const receipt = await publicClient.waitForTransactionReceipt({
            hash,
          });

          expect(receipt.status).toBe("success");
          const acc2 = privateKeyToAccount(sk);
          await wallet.sendTransaction({
            account,
            to: acc2.address,
            value: 250000000000000000n,
          });
          client2Wallet = createWalletClient({
            account: acc2,
            chain: hardhat,
            transport: http(),
          });
          relayClient2 = createRelayClient(sk);
          const redeemHash = await redeemInviteSecret(
            sk,
            client2Wallet,
            shopId,
          );
          // wait for the transaction to be included in the blockchain
          const redeemReceipt = await publicClient.waitForTransactionReceipt({
            hash: redeemHash,
          });

          expect(redeemReceipt.status).toBe("success");

          await relayClient2.enrollKeycard(
            client2Wallet,
            false,
            shopId,
            windowLocation,
          );
          await relayClient2.connect();
          await relayClient2.authenticate();
          await relayClient2.sendMerchantSubscriptionRequest(shopId);
        });

        test("client 2 receives events created by client 1", async () => {
          const getStream = async () => {
            const stream = relayClient2.createEventStream();
            for await (const _ of stream) {
              return 1;
            }
          };
          const evtLength = await getStream();
          expect(evtLength).toBeGreaterThan(0);
        });
        test("client2 can update manifest", async () => {
          await relayClient2.updateShopManifest({
            addPayee: {
              address: { raw: randomBytes(20) },
              callAsContract: false,
              chainId: 1,
              name: "new payee",
            },
          });
        });
      });
    });

    describe("If there is a network error, state manager should not change the state.", () => {
      const client = createRelayClient();
      const shopId = random256BigInt();

      test("Bad network calls should not change state data", async () => {
        const transactionHash = await mintShop(wallet, [
          shopId,
          wallet.account.address,
        ]);
        const receipt = await publicClient.waitForTransactionReceipt({
          hash: transactionHash,
        });
        expect(receipt.status).toBe("success");

        const response = await client.enrollKeycard(
          wallet,
          false,
          shopId,
          windowLocation,
        );
        expect(response.status).toBe(201);
        await client.connect();
        await client.authenticate();
        await client.shopManifest(
          {
            payees: [
              {
                address: {
                  raw: hexToBytes(addresses.anvilAddress),
                },
                callAsContract: false,
                chainId: 1,
                name: "default",
              },
            ],
            acceptedCurrencies: [
              {
                chainId: 10,
                address: { raw: hexToBytes(addresses.anvilAddress) },
              },
            ],
            pricingCurrency: {
              chainId: 10,
              address: { raw: hexToBytes(addresses.anvilAddress) },
            },
            shippingRegions: [
              {
                name: "test",
                country: "test country",
                postalCode: "test postal",
                city: "test city",
                orderPriceModifiers: [],
              },
            ],
          },
          shopId,
        );

        const updatePromise = client.updateShopManifest({
          addAcceptedCurrencies: [
            {
              chainId: 31337,
              address: { raw: hexToBytes("0xbad") },
            },
          ],
        });
        let called = false;
        try {
          await updatePromise;
        } catch (e) {
          expect((e as Error).message).toEqual(
            "Field `add_accepted_currency[0].addr` must have correct amount of bytes, got 2",
          );
          called = true;
        }
        expect(called).toBe(true);

        // const manifest = await stateManager.manifest.get();
        // expect(manifest.addAcceptedCurrencies.length).toEqual(0);

        // await expect(async () => {
        //   await client.listing({
        //     price: "10.99",
        //     metadata: "bad metadata",
        //   });
        // }).rejects.toThrowError();

        // const keys = await listingStore.keys().all();
        // expect(keys.length).toEqual(0);
      });
    });
  },
});

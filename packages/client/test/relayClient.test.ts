// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: MIT

import { WebSocket } from "isows";
import {
  hexToBytes,
  createWalletClient,
  createPublicClient,
  http,
  toBytes,
  type Address,
  bytesToHex,
} from "viem";
import { hardhat } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { describe, beforeEach, expect, test } from "vitest";

import {
  random32BytesHex,
  zeroAddress,
  priceToUint256,
  anvilAddress,
  anvilPrivateKey,
  objectId,
  eventId,
} from "@massmarket/utils";
import * as abi from "@massmarket/contracts";
import {
  BlockchainClient,
  WalletClientWithAccount,
} from "@massmarket/blockchain";

import { RelayClient, discoverRelay } from "../src";

// this key is from one of anvil's default keypairs
const account = privateKeyToAccount(anvilPrivateKey);

const wallet = createWalletClient({
  account,
  chain: hardhat,
  transport: http(),
}) as WalletClientWithAccount;

const publicClient = createPublicClient({
  chain: hardhat,
  transport: http(),
});

const shopId = random32BytesHex();
let blockchain: BlockchainClient;
const relayURL =
  (process && process.env["RELAY_ENDPOINT"]) || "ws://localhost:4444/v3";
const relayEndpoint = await discoverRelay(relayURL);

function createRelayClient(pk = random32BytesHex()) {
  return new RelayClient({
    relayEndpoint,
    keyCardWallet: privateKeyToAccount(pk),
  });
}
beforeEach(async () => {
  blockchain = new BlockchainClient(shopId);
});
describe("RelayClient", async () => {
  const relayClient = createRelayClient();

  test("should create a shop", async () => {
    const transactionHash = await blockchain.createShop(wallet);
    // wait for the transaction to be included in the blockchain
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: transactionHash,
    });
    expect(receipt.status).equals("success");
  });

  test("regstrationTokenRedeem", async () => {
    // still contrived, we would use a seperate keypair in reality and pass it via some sidechannel
    //
    // acc2 is the "long term wallet" of the new user
    // if we knew that before hand, we could just call registerUser(acc2.address, Clerk)
    const sk = random32BytesHex();
    const token = privateKeyToAccount(sk);
    const hash = await blockchain.createInviteSecret(wallet, token.address);

    // wait for the transaction to be included in the blockchain
    const receipt = await publicClient.waitForTransactionReceipt({
      hash,
    });
    expect(receipt.status).to.equal("success");
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
    }) as WalletClientWithAccount;

    const relayClient2 = new RelayClient({
      relayEndpoint,
      keyCardWallet: privateKeyToAccount(sk),
    });

    const hash2 = await blockchain.redeemInviteSecret(sk, client2Wallet);
    // wait for the transaction to be included in the blockchain
    const transaction = await publicClient.waitForTransactionReceipt({
      hash: hash2,
    });
    expect(transaction.status).to.equal("success");

    // verify access level
    const canUpdateRootHash = await publicClient.readContract({
      address: abi.addresses.ShopReg as Address,
      abi: abi.ShopReg,
      functionName: "hasPermission",
      args: [blockchain.shopId, acc2.address, abi.permissions.updateRootHash],
    });
    expect(canUpdateRootHash).toBe(true);
    const canRemoveUser = await publicClient.readContract({
      address: abi.addresses.ShopReg as Address,
      abi: abi.ShopReg,
      functionName: "hasPermission",
      args: [blockchain.shopId, acc2.address, abi.permissions.removeUser],
    });
    expect(canRemoveUser).toBe(false);

    await relayClient2.disconnect();
  });
  await relayClient.disconnect();
});

describe("user behaviour", () => {
  const relayClient = createRelayClient();

  // enroll and login
  test("should enroll keycard", async () => {
    const windowLocation =
      typeof window == "undefined" ? undefined : new URL(window.location.href);
    const response = await relayClient.enrollKeycard(
      wallet,
      false,
      shopId,
      windowLocation,
    );
    expect(response.status).toBe(201);
  });

  test("should connect and disconnect", { retry: 3 }, async () => {
    const authenticated = await relayClient.connect();
    expect(authenticated.response.error).toBeNull();
    const closeEvent = await relayClient.disconnect();
    const r = closeEvent as CloseEvent;
    expect(r.wasClean).toBe(true);
  });

  test("should reconnect", async () => {
    await relayClient.disconnect();
    await relayClient.connect();
    expect(relayClient.connection.readyState).toBe(WebSocket.OPEN);
  });

  test("write shop manifest", async () => {
    const id = objectId();
    await relayClient.shopManifest(
      {
        payees: [
          {
            address: {
              raw: toBytes(anvilAddress),
            },
            callAsContract: false,
            chainId: 1,
            name: "default",
          },
        ],
        acceptedCurrencies: [
          {
            chainId: 10,
            address: { raw: hexToBytes(zeroAddress) },
          },
        ],
        pricingCurrency: {
          chainId: 10,
          address: { raw: hexToBytes(zeroAddress) },
        },
        shippingRegions: [
          {
            name: "test",
            country: "test country",
            postalCode: "test postal",
            city: "test city",
            orderPriceModifierIds: [{ raw: id }],
          },
        ],
        orderPriceModifiers: [
          {
            id: { raw: id },
            title: "EU VAT",
            percentage: { raw: eventId() },
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
          address: { raw: hexToBytes(abi.addresses.Eddies as Address) },
          chainId: 31337,
        },
      ],
    });
    await relayClient.updateShopManifest({
      removeAcceptedCurrencies: [
        {
          address: { raw: hexToBytes(abi.addresses.Eddies as Address) },
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

  describe("editing the listing", () => {
    let itemId: { raw: Uint8Array };
    beforeEach(async () => {
      const metadata = {
        title: "test",
        description: "test",
        images: ["https://http.cat/images/200.jpg"],
      };
      const price = priceToUint256("12.99");
      itemId = await relayClient.listing({
        price: {
          raw: price,
        },
        metadata,
      });
      expect(itemId).not.toBeNull();
    });

    test("update item - metadata", async () => {
      await relayClient.updateListing({
        id: itemId,
        metadata: {
          title: "new name",
          images: ["https://http.cat/images/200.jpg"],
        },
      });
    });

    describe("tags", () => {
      let tagId: { raw: Uint8Array };
      beforeEach(async () => {
        tagId = await relayClient.tag({ name: "Testing New Tag" });
        expect(tagId).not.toBeNull();
      });
      test("add item to tag", async () => {
        await relayClient.updateTag({
          id: tagId,
          addListingIds: [itemId],
        });
      });
      test("remove item from tag", async () => {
        await relayClient.updateTag({
          id: tagId,
          removeListingIds: [itemId],
        });
      });
    });
  });

  // describe("invite another user", { retry: 3 }, async () => {
  //   let client2Wallet;
  //   let relayClient2: RelayClient;
  //   beforeEach(async () => {
  //     const sk = random32BytesHex();
  //     const token = privateKeyToAccount(sk);
  //     const hash = await blockchain.createInviteSecret(wallet, token.address);

  //     // wait for the transaction to be included in the blockchain
  //     const receipt = await publicClient.waitForTransactionReceipt({
  //       hash,
  //     });

  //     expect(receipt.status).to.equal("success");
  //     const acc2 = privateKeyToAccount(sk);
  //     await wallet.sendTransaction({
  //       account,
  //       to: acc2.address,
  //       value: BigInt("250000000000000000"),
  //     });
  //     client2Wallet = createWalletClient({
  //       account: acc2,
  //       chain: hardhat,
  //       transport: http(),
  //     });
  //     relayClient2 = new RelayClient({
  //       relayEndpoint,
  //       keyCardWallet: privateKeyToAccount(sk),
  //     });
  //     const redeemHash = await blockchain.redeemInviteSecret(sk, client2Wallet);
  //     // wait for the transaction to be included in the blockchain
  //     const redeemReceipt = await publicClient.waitForTransactionReceipt({
  //       hash: redeemHash,
  //     });

  //     expect(redeemReceipt.status).to.equal("success");
  //     const windowLocation =
  //       typeof window == "undefined"
  //         ? undefined
  //         : new URL(window.location.href);
  //     await relayClient2.enrollKeycard(
  //       client2Wallet,
  //       false,
  //       shopId,
  //       windowLocation,
  //     );
  //     await relayClient2.connect();
  //   });

  //   test("client2 successfully updates manifest", async () => {
  //     await relayClient2.updateShopManifest({
  //       setPricingCurrency: {
  //         chianId: 31337,
  //         address: { raw: hexToBytes(abi.addresses.Eddies as Address) },
  //       },
  //     });
  //   });
  //   test("client 1 receives events from createEventStream", async () => {
  //     const getStream = async () => {
  //       const stream = relayClient.createEventStream();
  //       for await (const evt of stream) {
  //         return 1;
  //       }
  //     };
  //     const evtLength = await getStream();
  //     expect(evtLength).toBeGreaterThan(0);
  //   });
  //   test("client 2 receives events from createEventStream", async () => {
  //     const getStream = async () => {
  //       const stream = relayClient2.createEventStream();
  //       for await (const evt of stream) {
  //         return 1;
  //       }
  //     };
  //     const evtLength = await getStream();
  //     expect(evtLength).toBeGreaterThan(0);
  //   });
  // });
});

// describe("If there is a network error, state manager should not change the state.", async () => {
//   const client = createRelayClient();

//   const shopId = random32BytesHex();

//   let blockchain = new BlockchainClient(shopId);

//   test("Bad network calls should not change state data", async () => {
//     const transactionHash = await blockchain.createShop(wallet);
//     const receipt = await publicClient.waitForTransactionReceipt({
//       hash: transactionHash,
//     });
//     expect(receipt.status).equals("success");
//     const publishedTagId = randomBytes(32);
//     const name = "test shop";
//     const description = "creating test shop";
//     const profilePictureUrl = "https://http.cat/images/200.jpg";
//     const windowLocation =
//       typeof window == "undefined" ? undefined : new URL(window.location.href);
//     const response = await client.enrollKeycard(
//       wallet,
//       false,
//       shopId,
//       windowLocation,
//     );
//     expect(response.status).toBe(201);
//     await client.connect();

//     await client.shopManifest(
//       {
//         name,
//         description,
//         profilePictureUrl,
//         publishedTagId,
//       },
//       shopId,
//     );

//     await expect(async () => {
//       await client.updateShopManifest({
//         addAcceptedCurrencies: [
//           {
//             chainId: 31337,
//             tokenAddr: "bad address",
//           },
//         ],
//       });
//     }).rejects.toThrowError();

//     const manifest = await stateManager.manifest.get();
//     expect(manifest.addAcceptedCurrencies.length).toEqual(0);

//     await expect(async () => {
//       await client.listing({
//         price: "10.99",
//         metadata: "bad metadata",
//       });
//     }).rejects.toThrowError();

//     const keys = await listingStore.keys().all();
//     expect(keys.length).toEqual(0);
//   });
// });

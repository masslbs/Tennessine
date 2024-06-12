// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: MIT

import { WebSocket } from "isows";
import {
  bytesToHex,
  createWalletClient,
  createPublicClient,
  http,
  type Address,
} from "viem";
import { hardhat } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { describe, beforeEach, afterEach, expect, test } from "vitest";

import { RelayClient } from "../lib";
import { random32BytesHex } from "../lib/utils";
import { market } from "../lib/protobuf/compiled";
import mmproto = market.mass;

import * as abi from "@massmarket/contracts";

const account = privateKeyToAccount(
  "0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6",
);

const wallet = createWalletClient({
  account,
  chain: hardhat,
  transport: http(),
});

const publicClient = createPublicClient({
  chain: hardhat,
  transport: http(),
});

const relayEndpoint =
  (process && process.env["RELAY_ENDPOINT"]) || "ws://localhost:4444/v2";

let relayClient: RelayClient;
const shopId = random32BytesHex();

beforeEach(async () => {
  relayClient = new RelayClient({
    shopId,
    relayEndpoint,
    keyCardWallet: privateKeyToAccount(random32BytesHex()),
    chain: hardhat,
    keyCardEnrolled: false,
  });
});

afterEach(async () => {
  await relayClient.disconnect();
});

describe("RelayClient", async () => {
  describe("connection behavior", () => {
    test("should connect and disconnect", async () => {
      await relayClient.connect();
      const closeEvent = await relayClient.disconnect();
      const r = closeEvent as CloseEvent;
      expect(r.wasClean).toBe(true);
    });

    test("should reconnect", async () => {
      await relayClient.disconnect();
      await relayClient.connect();
      expect(relayClient.connection.readyState).toBe(WebSocket.OPEN);
    });
  });

  test("should create a shop", async () => {
    const transactionHash = await relayClient.blockchain.createShop(wallet);
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
    const hash = await relayClient.blockchain.createInviteSecret(
      wallet,
      token.address,
    );

    // wait for the transaction to be included in the blockchain
    const receipt = await publicClient.waitForTransactionReceipt({
      hash,
    });

    expect(receipt.status).to.equal("success");
    const acc2 = privateKeyToAccount(sk);
    await wallet.sendTransaction({
      account,
      to: acc2.address,
      value: BigInt(250000000000000000),
    });

    const client2Wallet = createWalletClient({
      account: acc2,
      chain: hardhat,
      transport: http(),
    });

    const relayClient2 = new RelayClient({
      relayEndpoint,
      keyCardWallet: privateKeyToAccount(sk),
      chain: hardhat,
      keyCardEnrolled: false,
      shopId,
    });

    const hash2 = await relayClient.blockchain.redeemInviteSecret(
      sk,
      client2Wallet,
    );
    // wait for the transaction to be included in the blockchain
    const transaction = await publicClient.waitForTransactionReceipt({
      hash: hash2,
    });
    expect(transaction.status).to.equal("success");

    //
    const PERMRootHash = await publicClient.readContract({
      address: abi.addresses.ShopReg as Address,
      abi: abi.ShopReg,
      functionName: "PERM_updateRootHash",
    });
    const PERMRemoveUser = await publicClient.readContract({
      address: abi.addresses.ShopReg as Address,
      abi: abi.ShopReg,
      functionName: "PERM_removeUser",
    });
    // verify access level
    const canUpdateRootHash = await publicClient.readContract({
      address: abi.addresses.ShopReg as Address,
      abi: abi.ShopReg,
      functionName: "hasPermission",
      args: [shopId, acc2.address, PERMRootHash],
    });
    expect(canUpdateRootHash).toBe(true);
    const isAdmin = await publicClient.readContract({
      address: abi.addresses.ShopReg as Address,
      abi: abi.ShopReg,
      functionName: "hasPermission",
      args: [shopId, acc2.address, PERMRemoveUser],
    });
    expect(isAdmin).toBe(false);

    await relayClient2.disconnect();
  });
});

describe("user behaviour", () => {
  // enroll and login
  beforeEach(async () => {
    const response = await relayClient.enrollKeycard(wallet);
    expect(response.status).toBe(201);
    const authenticated =
      (await relayClient.connect()) as mmproto.ChallengeSolvedResponse;
    expect(authenticated.error).toBeNull();
  });

  test("write shop manifest", async () => {
    const publishedTagId = null;
    let r = await relayClient.writeShopManifest(publishedTagId);
    // This is a hack to please browser and node world
    // Find out why one return number and the other class Long
    if (r.eventSequenceNo !== 2 && r.eventSequenceNo.low !== 2) {
      expect(true).toBe(false);
    }
  });

  test("update shop manifest", async () => {
    await relayClient.updateShopManifest({ domain: "socks.mass.market" });
    await relayClient.updateShopManifest({
      publishedTagId: random32BytesHex(),
    });
    await relayClient.updateShopManifest({
      addERC20: abi.addresses.Eddies as Address,
    });
    await relayClient.updateShopManifest({
      removeERC20: abi.addresses.Eddies as Address,
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
    let itemId: `0x${string}`;
    // create item
    beforeEach(async () => {
      const metadata = {
        name: "test",
        description: "test",
        image: "https://http.cat/images/200.jpg",
      };
      itemId = await relayClient.createItem("10.99", metadata);
      expect(itemId).not.toBeNull();
    });

    test("update item - price", async () => {
      await relayClient.updateItem(itemId, { price: "20.99" });
      expect(itemId).not.toBeNull();
    });

    test("update item - metadata", async () => {
      await relayClient.updateItem(itemId, {
        metadata: {
          name: "new name",
          image: "https://http.cat/images/200.jpg",
        },
      });
      expect(itemId).not.toBeNull();
    });

    describe("tagging", () => {
      let tagId: `0x${string}`;
      beforeEach(async () => {
        tagId = await relayClient.createTag("Testing New Tag");
        expect(tagId).not.toBeNull();
      });

      test("add item to tag", async () => {
        await relayClient.addItemToTag(tagId, itemId);
      });

      test("remove item from tag", async () => {
        await relayClient.removeFromTag(tagId, itemId);
      });
    });

    describe("checkout process", () => {
      let orderId: `0x${string}`;
      beforeEach(async () => {
        orderId = await relayClient.createOrder();
        // increase stock
        await relayClient.changeStock([itemId], [10]);
      });

      test("single item checkout", { timeout: 10000 }, async () => {
        await relayClient.changeOrder(orderId, itemId, 1);
        const checkout = await relayClient.commitOrder(orderId);
        expect(checkout).not.toBeNull();
        expect(checkout.orderFinalizedId).not.toBeNull();

        const getStream = async () => {
          const stream = relayClient.createEventStream();
          // @ts-expect-error FIXME
          for await (const event of stream) {
            if (event.updateOrder?.itemsFinalized) {
              return bytesToHex(event.updateOrder.orderId);
            }
          }
          return null;
        };
        const receivedId = await getStream();
        expect(receivedId).toEqual(orderId);
      });

      test("erc20 checkout", { timeout: 10000 }, async () => {
        await relayClient.updateShopManifest({
          addERC20: abi.addresses.Eddies as Address,
        });
        await relayClient.changeOrder(orderId, itemId, 1);

        const checkout = await relayClient.commitOrder(
          orderId,
          abi.addresses.Eddies as Address,
        );
        expect(checkout).not.toBeNull();
        expect(checkout.orderFinalizedId).not.toBeNull();
      });
    });
  });

  describe("invite another user", { retry: 3 }, async () => {
    let client2Wallet;
    let relayClient2: RelayClient;
    beforeEach(async () => {
      const sk = random32BytesHex();
      const token = privateKeyToAccount(sk);
      const hash = await relayClient.blockchain.createInviteSecret(
        wallet,
        token.address,
      );

      // wait for the transaction to be included in the blockchain
      const receipt = await publicClient.waitForTransactionReceipt({
        hash,
      });

      expect(receipt.status).to.equal("success");
      const acc2 = privateKeyToAccount(sk);
      await wallet.sendTransaction({
        account,
        to: acc2.address,
        value: BigInt(250000000000000000),
      });
      client2Wallet = createWalletClient({
        account: acc2,
        chain: hardhat,
        transport: http(),
      });
      relayClient2 = new RelayClient({
        relayEndpoint,
        keyCardWallet: privateKeyToAccount(sk),
        chain: hardhat,
        keyCardEnrolled: false,
        shopId,
      });
      const redeemHash = await relayClient.blockchain.redeemInviteSecret(
        sk,
        client2Wallet,
      );
      // wait for the transaction to be included in the blockchain
      const redeemReceipt = await publicClient.waitForTransactionReceipt({
        hash: redeemHash,
      });

      expect(redeemReceipt.status).to.equal("success");
      await relayClient2.enrollKeycard(client2Wallet);
      await relayClient2.connect();
    });

    test("client2 successfully updates manifest", async () => {
      await relayClient2.updateShopManifest({
        domain: "test2-test",
      });
      console.log("client2 updated manifest");
    });

    test("client 2 receives events from createEventStream", async () => {
      const getStream = async () => {
        const stream = relayClient2.createEventStream();
        // @ts-expect-error FIXME
        for await (const evt of stream) {
          return 1;
        }
      };
      const evtLength = await getStream();
      expect(evtLength).toBeGreaterThan(0);
      await relayClient2.disconnect();
    });
  });
});

// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: MIT

import { randomBytes } from "crypto";
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

import { RelayClient, ManifestField } from "../lib";
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
  (process && process.env["RELAY_ENDPOINT"]) || "ws://localhost:4444/v1";

let testingDiscoveryURL = new URL(relayEndpoint);
testingDiscoveryURL.protocol = "http";
testingDiscoveryURL.pathname = "/testing/discovery";

let relayClient: RelayClient;
const storeId: `0x${string}` = `0x${randomBytes(32).toString("hex")}`;
const keyCard = new Uint8Array(32);

beforeEach(async () => {
  crypto.getRandomValues(keyCard);
  relayClient = new RelayClient({
    relayEndpoint,
    keyCardWallet: privateKeyToAccount(bytesToHex(keyCard)),
    storeId,
    chain: hardhat,
  });
  await relayClient.connect();
});

afterEach(async () => {
  await relayClient.disconnect();
});

describe("RelayClient", async () => {
  describe("connection behavior", () => {
    test("should connect and disconnect", async () => {
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

  test("should create a store", async () => {
    const result = await relayClient.createStore(storeId, wallet);
    expect(result).not.toBeNull();
  });

  test("regstrationTokenRedeem", async () => {
    // still contrived, we would use a seperate keypair in reality and pass it via some sidechannel
    //
    // acc2 is the "long term wallet" of the new user
    // if we knew that before hand, we could just call registerUser(acc2.address, Clerk)

    const sk = await relayClient.createInviteSecret(wallet);
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
      storeId: storeId as `0x${string}`,
      chain: hardhat,
    });

    // the new client redeems the invite, and now is a clerk
    const hash = await relayClient2.redeemInviteSecret(sk, client2Wallet);
    // wait for the transaction to be included in the blockchain
    const transaction = await publicClient.waitForTransactionReceipt({
      hash,
    });
    expect(transaction.status).to.equal("success");

    // verify access level
    const hasAccess = await publicClient.readContract({
      address: abi.addresses.StoreReg as Address,
      abi: abi.StoreReg,
      functionName: "hasAtLeastAccess",
      args: [storeId, acc2.address, 1],
    });
    expect(hasAccess).toBe(true);
    const isAdmin = await publicClient.readContract({
      address: abi.addresses.StoreReg as Address,
      abi: abi.StoreReg,
      functionName: "hasAtLeastAccess",
      args: [storeId, acc2.address, 2],
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
    const res = await relayClient.login();
    expect(res.error).toBeNull();
  });

  test("write store manifest", async () => {
    const publishedTagId = null;
    let r = await relayClient.writeStoreManifest(publishedTagId);
    // @ts-expect-error FIXME:
    // This is a hack to please browser and node world
    // Find out why one return number and the other class Long
    if (r.eventSequenceNo !== 2 && r.eventSequenceNo.low !== 2) {
      expect(true).toBe(false);
    }
  });

  test("update store manifest", async () => {
    await relayClient.updateManifest(
      ManifestField.MANIFEST_FIELD_DOMAIN,
      "test",
    );
    await relayClient.updateManifest(
      ManifestField.MANIFEST_FIELD_DOMAIN,
      "socks.mass.market",
    );
    await relayClient.updateManifest(
      ManifestField.MANIFEST_FIELD_ADD_ERC20,
      abi.addresses.Eddies,
    );
    await relayClient.updateManifest(
      ManifestField.MANIFEST_FIELD_REMOVE_ERC20,
      abi.addresses.Eddies,
    );
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
        image: "https://http.cat/images/202.jpg",
      };
      itemId = await relayClient.createItem("10.99", metadata);
      expect(itemId).not.toBeNull();
    });

    test("update item - price", async () => {
      await relayClient.updateItem(
        itemId,
        mmproto.UpdateItem.ItemField.ITEM_FIELD_PRICE,
        "20.99",
      );
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
      let cartId: `0x${string}`;
      beforeEach(async () => {
        cartId = await relayClient.createCart();
        // increase stock
        await relayClient.changeStock([itemId], [10]);
      });

      test("single item checkout", { timeout: 10000 }, async () => {
        await relayClient.changeCart(cartId, itemId, 1);

        const checkout = await relayClient.commitCart(cartId);
        expect(checkout).not.toBeNull();
        expect(checkout.cartFinalizedId).not.toBeNull();

        const stream = relayClient.createEventStream();
        // @ts-expect-error FIXME
        for await (const evt of stream) {
          for (const event of evt.events) {
            if (
              event.cartFinalized &&
              bytesToHex(event.cartFinalized!.cartId!) === cartId
            ) {
              return true;
            }
          }
        }
      });

      test("erc20 checkout", { timeout: 10000 }, async () => {
        await relayClient.updateManifest(
          ManifestField.MANIFEST_FIELD_ADD_ERC20,
          abi.addresses.Eddies,
        );
        await relayClient.changeCart(cartId, itemId, 1);

        const checkout = await relayClient.commitCart(
          cartId,
          abi.addresses.Eddies as Address,
        );
        expect(checkout).not.toBeNull();
        expect(checkout.cartFinalizedId).not.toBeNull();
      });
    });
  });

  test.skip("invite another user", { retry: 3 }, async () => {
    const sk = await relayClient.createInviteSecret(wallet);
    console.log("created invite secret", sk);
    const acc2 = privateKeyToAccount(sk);
    await wallet.sendTransaction({
      account,
      to: acc2.address,
      value: BigInt(250000000000000000),
    });
    console.log("transacted coins to acc2");

    const client2Wallet = createWalletClient({
      account: acc2,
      chain: hardhat,
      transport: http(),
    });
    const relayClient2 = new RelayClient({
      relayEndpoint,
      keyCardWallet: privateKeyToAccount(sk),
      storeId: storeId as `0x${string}`,
      chain: hardhat,
    });

    // the new client redeems the invite, and now is a clerk
    await relayClient2.redeemInviteSecret(sk, client2Wallet);
    console.log("client2 redeemed invite");
    await relayClient2.enrollKeycard(client2Wallet);
    console.log("client2 enrolled keyCard");
    await relayClient2.login();
    console.log("client2 logged in");

    await relayClient2.updateManifest(
      ManifestField.MANIFEST_FIELD_DOMAIN,
      "test2-test",
    );
    console.log("client2 updated manifest");

    const stream = relayClient.createEventStream();
    if (stream) {
      // @ts-expect-error FIXME
      for await (const evt of stream) {
        console.log({ evt });
        expect(evt.events.length).toBeGreaterThan(0);
      }
    }
    console.log("client2 has 7 events");

    await relayClient2.disconnect();
    console.log("clients disconnected");
  });
});

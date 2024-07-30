// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: MIT

// TODO: this should be folded into the correct sub-test(..) in relayClient.test.ts

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
import { expect, test } from "vitest";

import { random32BytesHex, randomBytes } from "@massmarket/utils";
import * as abi from "@massmarket/contracts";
import { randomAddress } from "@massmarket/utils";
import {
  BlockchainClient,
  WalletClientWithAccount,
} from "@massmarket/blockchain";
import { RelayClient, discoverRelay } from "../src";

// this key is from one of anvil's default keypairs
const account = privateKeyToAccount(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
);

const wallet = createWalletClient({
  account,
  chain: hardhat,
  transport: http(),
}) as WalletClientWithAccount;

const publicClient = createPublicClient({
  chain: hardhat,
  transport: http(),
});

let blockchain: BlockchainClient;
const relayURL =
  (process && process.env["RELAY_ENDPOINT"]) || "ws://localhost:4444/v2";
const relayEndpoint = await discoverRelay(relayURL);

function createRelayClient(pk = random32BytesHex()) {
  return new RelayClient({
    relayEndpoint,
    keyCardWallet: privateKeyToAccount(pk),
  });
}

const shopId = random32BytesHex();
blockchain = new BlockchainClient(shopId);

test("create shop", { timeout: 10000 }, async () => {
  // create a shop
  const transactionHash = await blockchain.createShop(wallet);
  // wait for the transaction to be included in the blockchain
  const receipt = await publicClient.waitForTransactionReceipt({
    hash: transactionHash,
  });
  expect(receipt.status).equals("success");
});

let relayClient: RelayClient;
test("enroll keycard", { timeout: 10000 }, async () => {
  relayClient = createRelayClient();
  const windowLocation =
    typeof window == "undefined" ? undefined : new URL(window.location.href);
  const enrolledResponse = await relayClient.enrollKeycard(
    wallet,
    false,
    shopId,
    windowLocation,
  );
  expect(enrolledResponse.status).toBe(201);
});

test("write shop manifest", async () => {
  const publishedTagId = randomBytes(32);
  const name = "test shop";
  const description = "creating test shop";
  const profilePictureUrl = "https://http.cat/images/200.jpg";
  const response = await relayClient.shopManifest(
    {
      name,
      description,
      profilePictureUrl,
      publishedTagId,
    },
    shopId,
  );
  expect(response.length).toBe(32);
});

let payee: Uint8Array;
let currency: Uint8Array;
test("update shop manifest", async () => {
  // create a random address to pay to
  payee = hexToBytes(randomAddress());
  currency = hexToBytes(abi.addresses.Eddies as Address);
  // tell the relay to accept our money
  const r = await relayClient.updateShopManifest({
    addAcceptedCurrencies: [
      {
        tokenAddr: currency,
        chainId: 31337,
      },
    ],
    addPayee: {
      addr: payee,
      callAsContract: false,
      chainId: 31337,
      name: "test",
    },
  });

  expect(r.length).toBe(32);
});

let itemId: Uint8Array;
test("should create a item", { timeout: 10000 }, async () => {
  const metadata = new TextEncoder().encode(
    JSON.stringify({
      name: "test",
      description: "test",
      image: "https://http.cat/images/200.jpg",
    }),
  );
  // create an item
  itemId = await relayClient.createItem({
    price: "10.99",
    metadata,
  });

  expect(itemId).not.toBeNull();
});

test("should update stock", { timeout: 10000 }, async () => {
  // increase stock
  const r = await relayClient.changeStock({
    itemIds: [itemId],
    diffs: [10],
  });

  expect(r.length).toBe(32);
});

let guestAccount: Account;
let guestRelayClient: RelayClient;
let guestWallet: WalletClientWithAccount;
test("create and enroll guest", { timeout: 10000 }, async () => {
  // generate a random guest
  const sk = random32BytesHex();
  guestAccount = privateKeyToAccount(sk);
  await wallet.sendTransaction({
    account,
    to: guestAccount.address,
    value: BigInt("250000000000000000"),
  });
  guestWallet = createWalletClient({
    account: guestAccount,
    chain: hardhat,
    transport: http(),
  });

  guestRelayClient = createRelayClient(sk);
  // enroll the guest client
  const windowLocation =
    typeof window == "undefined" ? undefined : new URL(window.location.href);
  const response = await guestRelayClient.enrollKeycard(
    guestWallet,
    true,
    shopId,
    windowLocation,
  );

  expect(response.status).toBe(201);
});

let orderId: Uint8Array;
test("guest creating an order", { timeout: 10000 }, async () => {
  // create an order
  orderId = await guestRelayClient.createOrder();
  expect(orderId.length).toBe(32);
});

test("guest updating an order", { timeout: 10000 }, async () => {
  // create an order
  const r = await guestRelayClient.updateOrder({
    orderId,
    changeItems: {
      itemId,
      quantity: 1,
    },
  });
  expect(r.length).toBe(32);
});

test("guest finilize an order", { timeout: 10000 }, async () => {
  // create an order
  const checkout = await guestRelayClient.commitOrder({
    orderId,
    currency: {
      tokenAddr: currency,
      chainId: 31337,
    },
    payeeName: "test",
  });
  expect(checkout.orderFinalizedId).not.toBeNull();
});

test("single item checkout with a guest", { timeout: 10000 }, async () => {
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

  // commit the order
  console.log("committed order");

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
      guestWallet.writeContract({
        address: abi.addresses.Payments as Address,
        abi: abi.PaymentsByAddress,
        functionName: "payTokenPreApproved",
        args: [args],
      });
    } else if (event.changeStock) {
      expect(toHex(event.changeStock.itemIds[0])).toEqual(toHex(itemId));
      return;
    }
  }
});

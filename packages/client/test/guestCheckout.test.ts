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
  toBytes,
} from "viem";
import { hardhat } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { expect, test } from "vitest";

import { random32BytesHex, zeroAddress } from "@massmarket/utils";
import * as abi from "@massmarket/contracts";
import {
  randomAddress,
  stringifyToBuffer,
  anvilPrivateKey,
  priceToUint256,
} from "@massmarket/utils";
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

// create a random address to pay to
let payee: Uint8Array = hexToBytes(randomAddress());
let currency: Uint8Array = hexToBytes(abi.addresses.Eddies as Address);

test("write shop manifest", async () => {
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
      baseCurrency: {
        chainId: 10,
        address: { raw: currency },
      },
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

let itemId: Uint8Array;
test("should create a item", { timeout: 10000 }, async () => {
  const baseInfo = {
    title: "guestCheckout test item",
    description: "test",
    images: ["https://http.cat/images/200.jpg"],
  };

  // create an item
  itemId = await relayClient.listing({
    basePrice: { raw: priceToUint256("10.99") },
    baseInfo,
  });
});

test("should update stock", { timeout: 10000 }, async () => {
  // increase stock
  await relayClient.changeInventory({
    id: itemId,
    diff: [10],
  });
});

test.skip("client commits an order", { timeout: 10000 }, async () => {
  const orderId = await relayClient.createOrder();
  await relayClient.updateOrder({
    id: orderId,
    changeItems: {
      adds: [{ listingId: itemId, quantity: 1 }],
    },
  });
  await relayClient.updateOrder({
    id: orderId,
    invoiceAddress: {
      name: "Paul Atreides",
      address1: "100 Colomb Street",
      city: "Arakkis",
      postalCode: "SE10 9EZ",
      country: "Dune",
      phoneNumber: "0103330524",
      emailAddress: "arakkis@dune.planet",
    },
  });
  await relayClient.commitOrder(
    {
      currency: {
        address: { raw: currency },
        chainId: 31337,
      },
      payee: {
        name: "test",
        chainId: 31337,
        callAsContract: false,
        address: { raw: payee },
      },
    },
    orderId,
  );
  // expect(checkout.orderFinalizedId).not.toBeNull();
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
});

test("guest updating an order", { timeout: 10000 }, async () => {
  await guestRelayClient.updateOrder({
    id: orderId,
    changeItems: {
      adds: [{ listingId: itemId, quantity: 1 }],
    },
  });
});

test.skip("single item checkout with a guest", { timeout: 10000 }, async () => {
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
      guestWallet.writeContract({
        address: abi.addresses.Payments as Address,
        abi: abi.PaymentsByAddress,
        functionName: "payTokenPreApproved",
        args: [args],
      });
    } else if (event.changeInventory) {
      expect(toHex(event.changeInventory.itemIds[0])).toEqual(toHex(itemId));
      return;
    }
  }
});

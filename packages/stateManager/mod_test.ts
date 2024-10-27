import { afterAll, beforeEach, describe, test } from "jsr:@std/testing/bdd";
import { assert } from "jsr:@std/assert";
import { expect } from "jsr:@std/expect";
import { MemoryLevel } from "memory-level";
import {
  type Listing,
  type Tag,
  type ShopManifest,
  type Order,
  type KeyCard,
  type OrdersByStatus,
  ListingViewState,
  OrderState,
  ShopCurrencies,
} from "./types.ts";
import { StateManager } from "./mod.ts";
import { MockClient } from "./mockClient.ts";
import { randomAddress, zeroAddress, objectId } from "@massmarket/utils";
import {
  createPublicClient,
  http,
  formatUnits,
  Address,
  bytesToHex,
  fromHex,
} from "viem";
import { hardhat } from "viem/chains";
import * as abi from "@massmarket/contracts";

function setupStateManagerStores() {
  const opts = {
    valueEncoding: "json",
  };
  const db = new MemoryLevel(opts);

  const listingStore = db.sublevel<string, Listing>("listingStore", opts);
  const tagStore = db.sublevel<string, Tag>("tagStore", opts);
  const shopManifestStore = db.sublevel<string, ShopManifest>(
    "shopManifestStore",
    opts,
  );
  const orderStore = db.sublevel<string, Order | OrdersByStatus>(
    "orderStore",
    opts,
  );

  const keycardStore = db.sublevel<string, KeyCard>("keycardStore", opts);
  return {
    db,
    listingStore,
    tagStore,
    shopManifestStore,
    orderStore,
    keycardStore,
  };
}

const eddies = abi.addresses.Eddies.toLowerCase() as Address;

const currencies = [
  {
    chainId: 10,
    address: eddies,
  },
  {
    chainId: 12,
    address: zeroAddress,
  },
];
const payees = [
  {
    address: randomAddress(),
    callAsContract: false,
    chainId: 1,
    name: "default",
  },
];
const orderPriceModifiers = [
  {
    title: "EU VAT",
    percentage: bytesToHex(objectId()),
  },
];
const shippingRegions = [
  {
    name: "test",
    country: "test country",
    postalCode: "test postal",
    city: "test city",
    orderPriceModifiers,
  },
];

const publicClient = createPublicClient({
  chain: hardhat,
  transport: http(),
});

test("should create an event for every shop event", async () => {
  const client = new MockClient();
  const {
    db,
    listingStore,
    tagStore,
    shopManifestStore,
    orderStore,
    keycardStore,
  } = setupStateManagerStores();
  const stateManager = new StateManager(
    client,
    listingStore,
    tagStore,
    shopManifestStore,
    orderStore,
    keycardStore,
    randomAddress(),
    publicClient,
  );
  expect(client.keyCardWallet.address).toEqual(
    client.vectors.signatures.signer.address,
  );
  await stateManager.keycards.addAddress(client.keyCardWallet.address);
  //Store test vector address to db for event verification
  let count = 0;
  // console.log("vector count", client.vectors.events.length);

  const isDone = new Promise<void>((resolve, reject) => {
    // let timeout: number = 0;
    function updateCount() {
      count++;
      if (count === client.vectors.events.length) {
        // console.log("done");
        // clearTimeout(timeout);
        resolve();
      } else if (count > client.vectors.events.length) {
        reject(new Error("Overflow"));
      } else {
        // console.log("progress", count);
      }
    }

    // timeout = setTimeout(() => {
    //   reject(new Error("Timeout"));
    // }, 5000);

    stateManager.manifest.on("create", updateCount);
    stateManager.manifest.on("update", updateCount);
    stateManager.keycards.on("newKeyCard", updateCount);
    stateManager.listings.on("create", updateCount);
    stateManager.listings.on("update", updateCount);
    stateManager.listings.on("changeInventory", updateCount);
    stateManager.listings.on("addItemId", updateCount);
    stateManager.listings.on("removeItemId", updateCount);
    stateManager.tags.on("create", updateCount);
    stateManager.tags.on("update", updateCount);
    stateManager.tags.on("addListingId", updateCount);
    stateManager.tags.on("removeListingIds", updateCount);
    stateManager.orders.on("create", updateCount);
    stateManager.orders.on("orderCanceled", updateCount);
    stateManager.orders.on("orderPaid", updateCount);
    stateManager.orders.on("shippingAddress", updateCount);
    stateManager.orders.on("invoiceAddress", updateCount);
    stateManager.orders.on("changeItems", updateCount);
    stateManager.orders.on("commitItems", updateCount);
    stateManager.orders.on("choosePayment", updateCount);
    stateManager.orders.on("paymentDetails", updateCount);
    stateManager.orders.on("addPaymentTx", updateCount);
  });

  await client.connect();
  await isDone;
  await db.close();
});


describe("Fill state manager with test vectors", () => {
  let client: MockClient;
  let stateManager: StateManager;
  const {
    db,
    listingStore,
    tagStore,
    shopManifestStore,
    orderStore,
    keycardStore,
  } = setupStateManagerStores();
  beforeEach(async () => {
    await db.clear();
    client = new MockClient();
    stateManager = new StateManager(
      client,
      listingStore,
      tagStore,
      shopManifestStore,
      orderStore,
      keycardStore,
      randomAddress(),
      publicClient,
    );
    await stateManager.keycards.addAddress(client.keyCardWallet.address);
    await client.connect();
    const isDone = new Promise<void>((resolve, reject) => {
      // krudge because we dont have a callback for seqNo updates
      const interval = setInterval(() => {
        stateManager.manifest.getSeqNo().then((seqNo) => {
          // toString because of Long type
          if (seqNo === client.vectors.events.length - 1) {
            clearInterval(interval);
            resolve();
          }
        });
      }, 250);
      // setTimeout(() => {
      //   clearInterval(interval);
      //   reject(new Error("Timeout"));
      // }, 1000);
    });
    await isDone;
  });
  afterAll(async () => {
    await db.close();
  });

  test("ShopManifest - adds and updates shop manifest events", async () => {
    const vectorState = client.vectors.reduced;
    const shop = await stateManager.manifest.get();
    const vm = vectorState.manifest;
    expect(shop.acceptedCurrencies.length).toEqual(
      vm.accepted_currencies.length,
    );
    expect(shop.acceptedCurrencies[0].chainId).toEqual(
      vm.accepted_currencies[0].chain_id,
    );
    expect(shop.acceptedCurrencies[0].address).toEqual(
      vm.accepted_currencies[0].address.raw,
    );
    const pricingCurrency = shop.pricingCurrency as ShopCurrencies;
    expect(pricingCurrency.chainId).toEqual(vm.pricing_currency.chain_id);
    expect(pricingCurrency.address).toEqual(vm.pricing_currency.address.raw);
    expect(shop.payees.length).toEqual(vm.payees.length);
    for (const payee of vm.payees) {
      const smPayee = shop.payees.find((p) => p.name === payee.name);
      expect(smPayee).toBeTruthy();
      expect(smPayee!.address).toEqual(payee.address.raw);
      expect(smPayee!.name).toEqual(payee.name);
      expect(smPayee!.chainId).toEqual(payee.chain_id);
    }
    //TODO: need test vectors for Shipping Region/Order Price Modififers
  });

  test("KeycardManager - updates keycard events", async () => {
    const vectorState = client.vectors.reduced;
    const keys = await stateManager.keycards.get();
    expect(vectorState.keycards.length).toEqual(keys.length);
    for (const key of vectorState.keycards) {
      const keyFound = keys.find((k) => k === key.toLowerCase());
      expect(keyFound).toBeTruthy();
    }
  });

  test("ListingManager - adds and updates item events", async () => {
    const vectorState = client.vectors.reduced;
    let itemCount = 0;
    for await (const [key, item] of stateManager.listings.iterator()) {
      itemCount++;
      const vectorItem = vectorState.listings.find((vi) => {
        return vi.id.raw === key;
      });
      expect(vectorItem).toBeTruthy();

      expect(BigInt(item.price)).toEqual(BigInt(vectorItem!.price.raw));
      if (vectorItem!.metadata) {
        expect(item.metadata.title).toEqual(vectorItem!.metadata.title);
        expect(item.metadata.images).toEqual(vectorItem!.metadata.images);
      }
    }
    expect(itemCount).toEqual(Object.keys(vectorState.listings).length);
  });

  test("TagManager - adds and updates tag events", async () => {
    const vectorState = client.vectors.reduced;
    const { tags } = vectorState;
    let tagCount = 0;
    for await (const [id, tag] of stateManager.tags.iterator()) {
      tagCount++;
      expect(tags[id].name).toEqual(tag.name);
    }
    expect(tagCount).toEqual(Object.keys(vectorState.tags).length);
  });

  test("OrderManager - adds and updates order events", async () => {
    const vectorState = client.vectors.reduced;
    //Orders with witnessed Tx should have properties: txHash, paymentDetails, and choosePayment,
    const vectorOrders = vectorState.orders;
    const ordersWithTxHash = await stateManager.orders.getStatus(
      OrderState.STATE_PAYMENT_TX,
    );
    for (const oId of ordersWithTxHash) {
      const vectorOrder = vectorOrders.find((vo) => vo.id.raw === oId);

      const stateManagerOrder = await stateManager.orders.get(oId);
      //Check that items/qty are equal.
      expect(Object.keys(stateManagerOrder.items).length).toEqual(
        vectorOrder!.items!.length,
      );
      vectorOrder?.items?.forEach((vi) => {
        const iid = vi.listing_id.raw as `0x${string}`;
        expect(stateManagerOrder.items[iid]).toEqual(vi.quantity);
      });

      const { txHash, paymentDetails, choosePayment } = stateManagerOrder;
      expect(txHash).toBeTruthy();
      //Check paymentDetails are equal.
      expect(paymentDetails?.paymentId).toEqual(
        vectorOrder!.payment_details?.payment_id.raw,
      );
      expect(paymentDetails?.total).toEqual(
        fromHex(
          vectorOrder!.payment_details!.total.raw as `0x${string}`,
          "number",
        ).toString(),
      );
      //Check chosenPayment is equal
      expect(choosePayment?.currency.address).toEqual(
        vectorOrder!.chosen_currency!.address.raw,
      );
      expect(choosePayment?.currency.chainId).toEqual(
        vectorOrder!.chosen_currency!.chain_id,
      );
      expect(choosePayment?.payee.address).toEqual(
        vectorOrder!.chosen_payee!.address.raw,
      );
      expect(choosePayment?.payee.chainId).toEqual(
        vectorOrder!.chosen_payee!.chain_id,
      );
    }
  });
});

describe("Unverified events should be caught in error", () => {
  test("catches error", async () => {
    const {
      db,
      listingStore,
      tagStore,
      shopManifestStore,
      orderStore,
      keycardStore,
    } = setupStateManagerStores();
    await db.clear();
    const client = new MockClient();
    const stateManager = new StateManager(
      client,
      listingStore,
      tagStore,
      shopManifestStore,
      orderStore,
      keycardStore,
      randomAddress(),
      publicClient,
    );
    // not adding keycard address to test unverified event error
    // await stateManager.keycards.addAddress(client.keyCardWallet.address);
    let called = false;
    stateManager.eventStreamProcessing.catch((e) => {
      // TODO: assert error type
      expect(e).toBeTruthy();
      called = true;
    });
    await stateManager.manifest.create(
      {
        acceptedCurrencies: currencies,
        pricingCurrency: {
          chainId: 1,
          address: zeroAddress,
        },
        payees,
        shippingRegions,
      },

      randomAddress(),
    );
    console.log("create resolved ");
    expect(called).toBeTruthy();
    await db.close();
  });
});

describe("CRUD functions update stores", () => {
  const {
    db,
    listingStore,
    tagStore,
    shopManifestStore,
    orderStore,
    keycardStore,
  } = setupStateManagerStores();
  const client = new MockClient();
  const stateManager = new StateManager(
    client,
    listingStore,
    tagStore,
    shopManifestStore,
    orderStore,
    keycardStore,
    randomAddress(),
    publicClient,
  );
  stateManager.eventStreamProcessing().then();
  beforeEach(async () => {
    await db.clear();
    //Store test vector address to db for event verification
    await stateManager.keycards.addAddress(client.keyCardWallet.address);
  });
  afterAll(async () => {
    await db.close();
  });
  describe("ShopManifest", () => {
    beforeEach(async () => {
      await stateManager.manifest.create(
        {
          acceptedCurrencies: currencies,
          pricingCurrency: {
            chainId: 1,
            address: zeroAddress,
          },
          payees,
          shippingRegions,
        },

        randomAddress(),
      );
      const shop = await stateManager.manifest.get();
      expect(shop.acceptedCurrencies).toEqual(currencies);
      expect(shop.pricingCurrency).toEqual({
        chainId: 1,
        address: zeroAddress,
      });
      expect(shop.payees).toEqual(payees);
      expect(shop.shippingRegions).toEqual(shippingRegions);
    });

    test("UpdateManifest - setPricingCurrency", async () => {
      const newBase = {
        chainId: 100,
        address: eddies,
      };
      await stateManager.manifest.update({
        setPricingCurrency: newBase,
      });
      const { pricingCurrency } = await stateManager.manifest.get();
      expect(pricingCurrency).toEqual(newBase);
    });
    test("UpdateManifest - adds/removes acceptedCurrencies", async () => {
      const newCurrencies = [
        {
          chainId: 10,
          address: randomAddress(),
        },
        {
          chainId: 2,
          address: randomAddress(),
        },
      ];
      await stateManager.manifest.update({
        addAcceptedCurrencies: newCurrencies,
      });
      const { acceptedCurrencies } = await stateManager.manifest.get();
      expect(acceptedCurrencies).toEqual(currencies.concat(newCurrencies));
      expect(acceptedCurrencies.length).toEqual(4);
      await stateManager.manifest.update({
        removeAcceptedCurrencies: [currencies[1]],
      });
      const removed = await stateManager.manifest.get();
      expect(removed.acceptedCurrencies.length).toEqual(3);
      //Make sure the correct currency is removed
      const found = removed.acceptedCurrencies.find(
        (c) => c.address === zeroAddress,
      );
      expect(found).toBe(undefined);
    });
    test("UpdateManifest - addPayee/removePayee", async () => {
      const newPayee = {
        address: randomAddress(),
        callAsContract: false,
        chainId: 1,
        name: "new payee",
      };
      await stateManager.manifest.update({
        addPayee: newPayee,
      });
      const { payees } = await stateManager.manifest.get();
      //Check that any previously added payees and new payee are both included.
      const p = payees.concat([newPayee]);
      for (const i in payees) {
        expect(p[i]).toEqual(payees[i]);
      }
      await stateManager.manifest.update({
        removePayee: newPayee,
      });
      const removed = await stateManager.manifest.get();
      expect(removed.payees.length).toBe(1);
      //Make sure we removed the correct payee.
      expect(removed.payees[0].address).toBe(payees[0].address);
    });
  });

  describe("ListingManager", () => {
    const decimals = 18;
    const metadata = {
      title: "Test Item 1",
      description: "Test description 1",
      images: ["https://http.cat/images/201.jpg"],
    };
    let id: `0x${string}`;
    beforeEach(async () => {
      const res = await stateManager.listings.create(
        {
          price: "12.00",
          metadata,
          viewState: ListingViewState.LISTING_VIEW_STATE_PUBLISHED,
        },
        decimals,
      );
      id = res.id;
      const item = await stateManager.listings.get(id);
      expect(formatUnits(BigInt(item.price), decimals)).toEqual("12");
      expect(item.metadata).toEqual(metadata);
      expect(item.viewState).toEqual(
        ListingViewState.LISTING_VIEW_STATE_PUBLISHED,
      );
    });

    test("update + changeInventory", async () => {
      const updatedMetadata = {
        title: "Updated Test Item 1",
        description: "Updated test description 1",
        images: ["https://http.cat/images/205.jpg"],
      };
      await stateManager.listings.update(
        {
          id,
          price: "25.55",
          metadata: updatedMetadata,
        },
        decimals,
      );
      const item = await stateManager.listings.get(id);
      expect(formatUnits(BigInt(item.price), decimals)).toEqual("25.55");
      expect(item.metadata).toEqual(updatedMetadata);
    });

    /*
    test("update - changeViewState", async () => {
      await stateManager.listings.update(
        {
          id,
          viewState: ListingViewState.LISTING_VIEW_STATE_UNSPECIFIED,
        },
        decimals,
      );
      const item = await stateManager.listings.get(id);
      expect(item.viewState).toEqual(
        ListingViewState.LISTING_VIEW_STATE_UNSPECIFIED,
      );
    });
    */

    test("changeInventory", async () => {
      await stateManager.listings.changeInventory(id, 60);
      await stateManager.listings.changeInventory(id, -2);
      const item = await stateManager.listings.get(id);
      expect(item.quantity).toEqual(58);
    });

    test("add/remove item to/from tag", async () => {
      const tag = await stateManager.tags.create("Test Create Tag");
      const tag2 = await stateManager.tags.create("Test Create Tag 2");
      await stateManager.listings.addListingToTag(tag.id, id);
      const added = await stateManager.listings.get(id);
      expect(added.tags.length).toEqual(1);
      expect(tag.id).toEqual(added.tags[0]);
      await stateManager.listings.addListingToTag(tag2.id, id);
      await stateManager.listings.removeListingFromTag(tag.id, id);
      const removed = await stateManager.listings.get(id);
      expect(removed.tags.length).toEqual(1);
      expect(removed.tags[0]).toEqual(tag2.id);
    });
  });

  describe("OrderManager", () => {
    let itemId: `0x${string}`;
    beforeEach(async () => {
      const item = await stateManager.listings.create({
        price: "12.00",
        metadata: {
          title: "Test Item in Order Test",
          description: "Test description 1",
          images: ["https://http.cat/images/201.jpg"],
        },
      });
      itemId = item.id;
    });
    test("Create and changeItems", async () => {
      const order1 = await stateManager.orders.create();
      const order2 = await stateManager.orders.create();
      await stateManager.orders.addsItems(order1.id, itemId, 4);
      const uo = await stateManager.orders.get(order1.id);
      expect(uo.items[itemId]).toEqual(4);
      await stateManager.orders.addsItems(order1.id, itemId, 5);
      const uo2 = await stateManager.orders.get(order1.id);
      expect(uo2.items[itemId]).toEqual(9);

      // Since we just created this order, status should be open.
      expect(uo.status).toEqual(OrderState.STATE_OPEN);
      expect(uo2.status).toEqual(OrderState.STATE_OPEN);

      // Should also be able to get orders by status.
      const orders = await stateManager.orders.getStatus(OrderState.STATE_OPEN);
      expect(orders[0]).toEqual(order1.id);
      expect(orders[1]).toEqual(order2.id);

      // Removes items from order
      await stateManager.orders.removeItems(order1.id, [
        { listingId: itemId, quantity: 3 },
      ]);
      const changedOrder = await stateManager.orders.get(order1.id);
      //Correctly removes 3 from the previously selected 9 qty.
      expect(changedOrder.items[itemId]).toEqual(6);
    });

    test("updateOrder - updateShippingDetails/updateInvoiceAddress", async () => {
      const { id } = await stateManager.orders.create();
      const shippingInfo = {
        name: "Paul Atreides",
        address1: "100 Colomb Street",
        city: "Arakkis",
        postalCode: "SE10 9EZ",
        country: "Dune",
        phoneNumber: "0103330524",
        emailAddress: "arakkis@dune.planet",
      };
      await stateManager.orders.updateShippingDetails(id, shippingInfo);
      const { status, shippingDetails } = await stateManager.orders.get(id);
      expect(status).toEqual(OrderState.STATE_OPEN);
      expect(shippingDetails).toEqual(shippingInfo);
      //should be able to update partially
      await stateManager.orders.updateShippingDetails(id, {
        country: "Mexico",
        phoneNumber: "1113334444",
      });
      const updated = await stateManager.orders.get(id);
      expect(updated!.shippingDetails!.name).toEqual(shippingInfo.name);
      expect(updated!.shippingDetails!.address1).toEqual(shippingInfo.address1);
      expect(updated!.shippingDetails!.city).toEqual(shippingInfo.city);
      expect(updated!.shippingDetails!.postalCode).toEqual(
        shippingInfo.postalCode,
      );
      expect(updated!.shippingDetails!.emailAddress).toEqual(
        shippingInfo.emailAddress,
      );
      expect(updated!.shippingDetails!.country).toEqual("Mexico");
      expect(updated!.shippingDetails!.phoneNumber).toEqual("1113334444");

      await stateManager.orders.updateInvoiceAddress(id, shippingInfo);
      const order = await stateManager.orders.get(id);
      expect(order.invoiceAddress).toEqual(shippingInfo);
    });

    test("updateOrder - cancel", async () => {
      const { id } = await stateManager.orders.create();
      await stateManager.orders.cancel(id, 0);
      const cancelled = await stateManager.orders.get(id);
      //New status should be cancelled
      expect(cancelled.status).toEqual(OrderState.STATE_CANCELED);
      // Should also be able to get orders by status.
      const cancelledOrders = await stateManager.orders.getStatus(
        OrderState.STATE_CANCELED,
      );
      expect(cancelledOrders[0]).toEqual(id);
      //Make sure the order id is not in open orders
      const openOrders = await stateManager.orders.getStatus(
        OrderState.STATE_OPEN,
      );
      expect(openOrders.find((oId) => oId === id)).toBe(undefined);
    });

    test("Update Order - commit/choosePayment", async () => {
      // const wait = new Promise<void>((resolve) => {
      //   setTimeout(() => {
      //     console.log("-> timeout");
      //     resolve();
      //   }, 5000);
      // })
      const { id } = await stateManager.orders.create();
      const order = await stateManager.orders.get(id);
      const payee = {
        address: randomAddress(),
        callAsContract: false,
        chainId: 1,
        name: "default",
      };
      const currency = {
        address: zeroAddress,
        chainId: 1,
      };
      //Order should not have a choosePayment/paymentDetails property yet.
      expect(order.choosePayment).toBeFalsy();
      expect(order.paymentDetails).toBeFalsy();

      await stateManager.orders.commit(id);
      await stateManager.orders.choosePayment(id, { currency, payee });
      const updatedOrder = await stateManager.orders.get(id);
      expect(updatedOrder.choosePayment?.currency).toEqual(currency);
      //Make sure the order is only in committed orders.
      const committedOrders = await stateManager.orders.getStatus(
        OrderState.STATE_COMMITED,
      );
      const o = committedOrders.find((oId) => oId === id);
      expect(o).toBeTruthy();

      //Mimic client event paymentDetails once commit is called.
      await client.sendPaymentDetails(id);

      await new Promise<void>((resolve) => {
        // TODO: check the orders
        stateManager.orders.on("paymentDetails", (order) => {
          resolve();
        });
      });
      const committed = await stateManager.orders.get(id);
      expect(committed.paymentDetails).toBeTruthy();
      // await wait;
    });
  });
});

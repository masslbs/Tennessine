import { describe, expect, test, vi, beforeEach, assert } from "vitest";
import { MemoryLevel } from "memory-level";
import {
  type Item,
  type Tag,
  type ShopManifest,
  type Order,
  type KeyCard,
  type OrdersByStatus,
  ListingViewState,
  OrderState,
} from "../types";
import { StateManager } from "..";
import { MockClient } from "./mockClient";
import {
  randomAddress,
  random32BytesHex,
  zeroAddress,
} from "@massmarket/utils";
import { formatUnits, Address } from "viem";
import * as abi from "@massmarket/contracts";

const db = new MemoryLevel({
  valueEncoding: "json",
});
db.clear();
const listingStore = db.sublevel<string, Item>("listingStore", {
  valueEncoding: "json",
});
const tagStore = db.sublevel<string, Tag>("tagStore", {
  valueEncoding: "json",
});
const shopManifestStore = db.sublevel<string, ShopManifest>(
  "shopManifestStore",
  {
    valueEncoding: "json",
  },
);
const orderStore = db.sublevel<string, Order | OrdersByStatus>("orderStore", {
  valueEncoding: "json",
});

const keycardStore = db.sublevel<string, KeyCard>("keycardStore", {
  valueEncoding: "json",
});

describe("Fill state manager with test vectors", async () => {
  const client = new MockClient();
  const stateManager = new StateManager(
    client,
    listingStore,
    tagStore,
    shopManifestStore,
    orderStore,
    keycardStore,
  );

  let count = 0;

  stateManager.manifest.on("create", () => {
    count++;
  });
  stateManager.manifest.on("update", () => {
    count++;
  });
  stateManager.items.on("create", () => {
    count++;
  });

  stateManager.items.on("update", () => {
    count++;
  });
  stateManager.items.on("changeInventory", () => {
    count++;
  });
  stateManager.items.on("addItemId", () => {
    count++;
  });
  stateManager.items.on("removeItemId", () => {
    count++;
  });
  stateManager.orders.on("create", () => {
    count++;
  });
  stateManager.orders.on("orderCanceled", () => {
    count++;
  });
  stateManager.orders.on("orderPaid", () => {
    count++;
  });
  stateManager.tags.on("create", () => {
    count++;
  });
  stateManager.orders.on("shippingAddress", () => {
    count++;
  });
  stateManager.orders.on("invoiceAddress", () => {
    count++;
  });
  stateManager.orders.on("changeItems", () => {
    count++;
  });
  stateManager.keycards.on("newKeyCard", () => {
    count++;
  });
  stateManager.orders.on("orderCommit", () => {
    count++;
  });
  stateManager.orders.on("paymentDetails", () => {
    count++;
  });
  client.connect();

  await vi.waitUntil(async () => {
    return count == client.vectors.events.length;
  });
  const vectorState = client.vectors.reduced;
  test("ShopManifest - adds and updates shop manifest events", async () => {
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
    expect(shop.baseCurrency.chainId).toEqual(vm.base_currency.chain_id);
    expect(shop.baseCurrency.address).toEqual(vm.base_currency.address.raw);
    expect(shop.payees.length).toEqual(vm.payees.length);
    for (const i in vm.payees) {
      //fixme:testvectors update

      expect(shop.payees[i].address).toEqual(vm.payees[i].address.raw);
      expect(shop.payees[i].name).toEqual(vm.payees[i].name);
      expect(shop.payees[i].chainId).toEqual(vm.payees[i].chain_id);
    }
  });

  test("KeycardManager - updates keycard events", async () => {
    let keyCount = 0;
    for await (const [pk, walletAddress] of stateManager.keycards.iterator()) {
      keyCount++;
      expect(pk).toEqual(vectorState.keycards[walletAddress as string]);
    }
    expect(Object.keys(vectorState.keycards).length).toEqual(keyCount);
  });

  test("ListingManager - adds and updates item events", async () => {
    let itemCount = 0;
    for await (const [id, item] of stateManager.items.iterator()) {
      itemCount++;
      const vectorItem = vectorState.listings.find((l) => {
        return l.id === Number(id);
      });
      console.log({ vectorItem, item });
      // const bytes = hexToBytes(vectorItem!.base_price.raw, { size: 32 });
      // console.log({ bytes });
      // const number = bytesToBigInt(bytes);
      // console.log({ number })

      expect(item.basePrice).toEqual(BigInt(vectorItem!.base_price.raw));
      expect(item.baseInfo.title).toEqual(vectorItem!.base_info!.title);
      expect(item.baseInfo.images).toEqual(vectorItem!.base_info!.images);
      // expect(item.quantity).toEqual(vectorItem!.stock_qty);
    }
    expect(itemCount).toEqual(Object.keys(vectorState.inventory).length);
  });

  test("TagManager - adds and updates tag events", async () => {
    const { tags } = vectorState;
    let tagCount = 0;
    for await (const [id, tag] of stateManager.tags.iterator()) {
      tagCount++;
      expect(tags[String(id)].name).toEqual(tag.name);
    }
    expect(tagCount).toEqual(Object.keys(vectorState.tags).length);
  });

  test("OrderManager - adds and updates order events", async () => {
    //Check that all paid orders have has txHash
    for await (const order of vectorState.orders) {
      const o = await stateManager.orders.get(order.id);
      if (order.state === OrderState.STATE_PAID) {
        expect(o.status).toEqual(OrderState.STATE_PAID);
        expect(o.txHash).toBeTruthy();
        // Should also be able to get orders by status.
        const orders = await stateManager.orders.getStatus(
          OrderState.STATE_PAID,
        );
        expect(orders[0]).toEqual(order.id);
      }
      if (order.state === OrderState.STATE_CANCELED) {
        expect(o.status).toEqual(OrderState.STATE_CANCELED);
      }
      if (order.state === OrderState.STATE_OPEN) {
        expect(o.status).toEqual(OrderState.STATE_OPEN);
        expect(o.items).toEqual(order.items);
        // Should also be able to get orders by status.
        const orders = await stateManager.orders.getStatus(
          OrderState.STATE_OPEN,
        );
        expect(orders[0]).toEqual(order.id);
      }
      if (order.state === OrderState.STATE_COMMITED) {
        expect(o.items).toEqual(order.items);
      }
    }
  });
});

describe("CRUD functions update stores", async () => {
  const eddies = abi.addresses.Eddies.toLowerCase() as Address;
  const client = new MockClient();
  const stateManager = new StateManager(
    client,
    listingStore,
    tagStore,
    shopManifestStore,
    orderStore,
    keycardStore,
  );

  beforeEach(async () => {
    db.clear();
  });
  describe("ShopManifest", () => {
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
    beforeEach(async () => {
      await stateManager.manifest.create(
        {
          acceptedCurrencies: currencies,
          baseCurrency: {
            chainId: 1,
            address: zeroAddress,
          },
          payees,
        },
        randomAddress(),
      );
      const shop = await stateManager.manifest.get();
      assert.deepEqual(shop.acceptedCurrencies, currencies);
      assert.deepEqual(shop.baseCurrency, {
        chainId: 1,
        address: zeroAddress,
      });
      assert.deepEqual(shop.payees, payees);
    });

    test.only("UpdateManifest - setBaseCurrency", async () => {
      const newBase = {
        chainId: 100,
        address: eddies,
      };
      await stateManager.manifest.update({
        setBaseCurrency: newBase,
      });
      const { baseCurrency } = await stateManager.manifest.get();
      assert.deepEqual(baseCurrency, newBase);
    });
    test.only("UpdateManifest - adds/removes acceptedCurrencies", async () => {
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
      assert.deepEqual(acceptedCurrencies, currencies.concat(newCurrencies));
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
    test.only("UpdateManifest - addPayee/removePayee", async () => {
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
        assert.deepEqual(p[i], payees[i]);
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
    const baseInfo = {
      title: "Test Item 1",
      description: "Test description 1",
      images: ["https://http.cat/images/201.jpg"],
    };
    let id: BigInt;
    beforeEach(async () => {
      const res = await stateManager.items.create(
        {
          basePrice: "12.00",
          baseInfo,
          viewState: ListingViewState.LISTING_VIEW_STATE_PUBLISHED,
        },
        decimals,
      );
      id = res.id;
      const item = await stateManager.items.get(id);
      expect(formatUnits(BigInt(item.basePrice), decimals)).toEqual("12");
      assert.deepEqual(item.baseInfo, baseInfo);
      expect(item.viewState).toEqual(
        ListingViewState.LISTING_VIEW_STATE_PUBLISHED,
      );
    });
    test.only("update + changeInventory", async () => {
      const updatedBaseInfo = {
        title: "Updated Test Item 1",
        description: "Updated test description 1",
        images: ["https://http.cat/images/205.jpg"],
      };
      await stateManager.items.update(
        {
          id,
          basePrice: "25.55",
          baseInfo: updatedBaseInfo,
          viewState: ListingViewState.LISTING_VIEW_STATE_UNSPECIFIED,
        },
        decimals,
      );
      await stateManager.items.changeInventory(id, 60);
      await stateManager.items.changeInventory(id, -2);
      const item = await stateManager.items.get(id);
      expect(formatUnits(BigInt(item.basePrice), decimals)).toEqual("25.55");
      assert.deepEqual(item.baseInfo, updatedBaseInfo);
      expect(item.quantity).toEqual(58);
    });

    test.only("add/remove item to/from tag", async () => {
      const tag = await stateManager.tags.create("Test Create Tag");
      const tag2 = await stateManager.tags.create("Test Create Tag 2");

      await stateManager.items.addItemToTag(tag.id, id);
      const added = await stateManager.items.get(id);
      expect(added.tags.length).toEqual(1);
      expect(tag.id).toEqual(added.tags[0]);
      await stateManager.items.addItemToTag(tag2.id, id);
      await stateManager.items.removeItemFromTag(tag.id, id);
      const removed = await stateManager.items.get(id);
      expect(removed.tags.length).toEqual(1);
      expect(removed.tags[0]).toEqual(tag2.id);
    });
  });
  describe("OrderManager", () => {
    let itemId: BigInt;
    beforeEach(async () => {
      const item = await stateManager.items.create({
        basePrice: "12.00",
        baseInfo: {
          title: "Test Item in Order Test",
          description: "Test description 1",
          images: ["https://http.cat/images/201.jpg"],
        },
      });
      itemId = item.id;
    });
    test.only("Create and changeItems", async () => {
      const order1 = await stateManager.orders.create();
      const order2 = await stateManager.orders.create();
      await stateManager.orders.addsItems(order1.id, itemId, 4);
      const uo = await stateManager.orders.get(order1.id);
      expect(uo.items[itemId]).toEqual(4);

      //Since we just created this order, status should be open.
      expect(uo.status).toEqual(OrderState.STATE_OPEN);

      // Should also be able to get orders by status.
      const orders = await stateManager.orders.getStatus(OrderState.STATE_OPEN);
      expect(orders[0]).toEqual(order1.id);
      expect(orders[1]).toEqual(order2.id);

      //removes items from order
      await stateManager.orders.removesItems(order1.id, itemId, 3);
      const changedOrder = await stateManager.orders.get(order1.id);
      expect(changedOrder.items[itemId]).toEqual(3);
    });
  });

  test.only("updateOrder - updateShippingDetails/updateInvoiceAddress", async () => {
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
    assert.deepEqual(shippingDetails, shippingInfo);
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
    assert.deepEqual(order.invoiceAddress, shippingInfo);
  });
  test.only("updateOrder - cancel", async () => {
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
    //Make sure the order id is not open orders
    const openOrders = await stateManager.orders.getStatus(
      OrderState.STATE_OPEN,
    );
    expect(openOrders.find((oId) => oId === id)).toBe(undefined);
  });
  // test("Commit triggers an updateOrder event with paid property", async () => {
  //   const { id } = await stateManager.orders.create();
  //   const order = await stateManager.orders.get(id);
  //   //Before order is committed, it should not have an orderFinalized property
  //   expect(order.orderFinalized).toBeFalsy();

  //   await stateManager.orders.commit(id, zeroAddress, 1, "default");
  //   let received = false;
  //   stateManager.orders.on("itemsFinalized", (order) => {
  //     received = true;
  //   });
  //   await vi.waitUntil(async () => {
  //     return received;
  //   });
  //   const committed = await stateManager.orders.get(id);
  //   expect(committed.orderFinalized).toBeTruthy();
  // });
});

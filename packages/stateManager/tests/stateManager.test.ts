import { describe, expect, test, vi, beforeEach } from "vitest";
import { MemoryLevel } from "memory-level";
import {
  StateManager,
  type Item,
  type Tag,
  type ShopManifest,
  type Order,
  type KeyCard,
} from "../";
import { MockClient } from "./mockClient";
import {
  randomAddress,
  random32BytesHex,
  zeroAddress,
} from "@massmarket/utils";

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
const orderStore = db.sublevel<string, Order>("orderStore", {
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
  stateManager.items.on("changeStock", () => {
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
  stateManager.orders.on("itemsFinalized", () => {
    count++;
  });
  stateManager.tags.on("create", () => {
    count++;
  });
  stateManager.orders.on("updateShippingDetails", () => {
    count++;
  });
  stateManager.orders.on("changeItems", () => {
    count++;
  });
  stateManager.keycards.on("newKeyCard", () => {
    count++;
  });

  client.connect();

  await vi.waitUntil(async () => {
    return count == client.vectors.events.length;
  });
  const vectorState = client.vectors.reduced;
  test("ShopManifest - adds and updates shop manifest events", async () => {
    const shop = await stateManager.manifest.get();
    expect(shop.name).toEqual(vectorState.manifest.name);
    expect(shop.profilePictureUrl).toEqual(
      vectorState.manifest.profile_picture_url,
    );
    expect(shop.description).toEqual(vectorState.manifest.description);
    expect(shop.publishedTagId).toEqual(vectorState.manifest.published_tag);
    expect(shop.addAcceptedCurrencies!.length).toEqual(
      vectorState.manifest.accepted_currencies.length,
    );
    expect(shop.addAcceptedCurrencies[0].chainId).toEqual(
      vectorState.manifest.accepted_currencies[0].chain,
    );
    expect(shop.addAcceptedCurrencies[0].tokenAddr).toEqual(
      vectorState.manifest.accepted_currencies[0].addr,
    );
    expect(shop.setBaseCurrency!.chainId).toEqual(
      vectorState.manifest.base_currency.chain,
    );
    expect(shop.setBaseCurrency!.tokenAddr).toEqual(
      vectorState.manifest.base_currency.addr,
    );
  });

  test("ListingManager - adds and updates item events", async () => {
    let itemCount = 0;
    for await (const [id, item] of stateManager.items.iterator()) {
      itemCount++;
      const vectorItem = vectorState.items[id];
      expect(item.price).toEqual(vectorItem.price);
      const parsed = JSON.parse(vectorItem.metadata);
      expect(item.metadata.title).toEqual(parsed.title);
      expect(item.metadata.image).toEqual(parsed.image);
      expect(item.quantity).toEqual(vectorItem.stock_qty);
    }
    expect(itemCount).toEqual(Object.keys(vectorState.inventory).length);
  });

  test("TagManager - adds and updates tag events", async () => {
    const { tags } = vectorState;
    let tagCount = 0;
    for await (const [id, tag] of stateManager.tags.iterator()) {
      tagCount++;
      expect(tags[id].name).toEqual(tag.name);
    }
    expect(tagCount).toEqual(Object.keys(vectorState.tags).length);
  });

  test("OrderManager - adds and updates order events", async () => {
    const { payed, abandoned, committed, open } = vectorState.orders;
    //If order has a txHash that means the order has been payed and status should be marked as complete.
    //So we are checking that all payed orders have status=complete and that it has a txHash
    for await (const order of payed) {
      const o = await stateManager.orders.get(order.order_id as `0x${string}`);
      expect(o.status).toEqual("COMPLETE");
      expect(o.txHash).toEqual(order.tx_hash);
    }
    //Abandoned orders should be stauts=failed
    for await (const order of abandoned) {
      const o = await stateManager.orders.get(order.order_id as `0x${string}`);
      expect(o.status).toEqual("FAILED");
    }
    //Commited orders should have the items + qty purchased, and the total amount.
    for await (const order of committed) {
      const o = await stateManager.orders.get(order.order_id as `0x${string}`);
      expect(o.items).toEqual(order.items);
    }
    //Open orders should have status=pending and have the corrects items + qty
    for await (const order of open) {
      const o = await stateManager.orders.get(order.order_id as `0x${string}`);
      expect(o.status).toEqual("PENDING");
      expect(o.items).toEqual(order.items);
    }
  });
});

describe("CRUD functions update stores", async () => {
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

  test("ShopManifest - create", async () => {
    const res = await stateManager.manifest.create(
      {
        name: "Test Shop",
        description: "Testing shopManifest",
      },
      randomAddress(),
    );
    const shop = await stateManager.manifest.get();
    expect(shop.name).toEqual("Test Shop");
    expect(shop.description).toEqual("Testing shopManifest");
  });

  test("ShopManifest - update", async () => {
    const cm = await stateManager.manifest.create(
      {
        name: "Test Shop",
        description: "Testing shopManifest",
      },
      randomAddress(),
    );
    expect(cm).toBeTruthy();
    await stateManager.manifest.update({
      tokenId: cm.tokenId,
      name: "Update Test Shop",
      description: "Testing updateShopManifest",
      profilePictureUrl: "https://http.cat/images/202.jpg",
      publishedTagId: random32BytesHex(),
      addAcceptedCurrencies: [
        {
          chainId: 1,
          tokenAddr: zeroAddress,
        },
      ],
      setBaseCurrency: {
        chainId: 1,
        tokenAddr: zeroAddress,
      },
    });
    const {
      name,
      description,
      profilePictureUrl,
      publishedTagId,
      setBaseCurrency,
      addAcceptedCurrencies,
    } = await stateManager.manifest.get();
    expect(name).toEqual("Update Test Shop");
    expect(description).toEqual("Testing updateShopManifest");
    expect(profilePictureUrl).toEqual("https://http.cat/images/202.jpg");
    expect(publishedTagId).toEqual(publishedTagId);
    expect(setBaseCurrency!.chainId).toEqual(1);
    expect(setBaseCurrency!.tokenAddr).toEqual(zeroAddress);
    expect(addAcceptedCurrencies!.length).toEqual(1);
    expect(addAcceptedCurrencies![0].chainId).toEqual(1);
    expect(addAcceptedCurrencies![0].tokenAddr).toEqual(zeroAddress);
  });

  test("TagManager - create", async () => {
    const { id } = await stateManager.tags.create("Test Create Tag");
    const tag = await stateManager.tags.get(id);
    expect(tag.name).toEqual("Test Create Tag");
  });

  test("ListingManager - create", async () => {
    const { id } = await stateManager.items.create({
      price: "12.00",
      metadata: {
        title: "Test Item 1",
        description: "Test description 1",
        image: "https://http.cat/images/201.jpg",
      },
    });

    const item = await stateManager.items.get(id);
    expect(item.price).toEqual("12.00");
    expect(item.metadata.title).toEqual("Test Item 1");
    expect(item.metadata.description).toEqual("Test description 1");
    expect(item.metadata.image).toEqual("https://http.cat/images/201.jpg");
    expect(item.quantity).toEqual(0);
  });

  test("ListingManager - add/remove item to/from tag", async () => {
    const item = await stateManager.items.create({
      price: "12.00",
      metadata: {
        title: "Test Item 1",
        description: "Test description 1",
        image: "https://http.cat/images/201.jpg",
      },
    });
    const tag = await stateManager.tags.create("Test Create Tag");
    expect(item.id).toBeTruthy();
    expect(tag.id).toBeTruthy();
    await stateManager.items.addItemToTag(tag.id, item.id);
    const added = await stateManager.items.get(item.id);
    expect(added.tags.length).toEqual(1);
    expect(tag.id).toEqual(added.tags[0]);
    await stateManager.items.removeItemFromTag(tag.id, item.id);
    const removed = await stateManager.items.get(item.id);
    expect(removed.tags.length).toEqual(0);
  });

  test("ListingManager - update + changeStock", async () => {
    const { id } = await stateManager.items.create({
      price: "12.00",
      metadata: {
        title: "Test Item 2",
        description: "Test description 2",
        image: "https://http.cat/images/201.jpg",
      },
    });
    await stateManager.items.update({
      id,
      price: "25.00",
      metadata: {
        title: "Updated Test Item 1",
        description: "Updated test description 1",
        image: "https://http.cat/images/205.jpg",
      },
    });
    const r = await stateManager.items.changeStock([id], [5]);
    const item = await stateManager.items.get(id);
    expect(item.price).toEqual("25.00");
    expect(item.metadata.title).toEqual("Updated Test Item 1");
    expect(item.metadata.description).toEqual("Updated test description 1");
    expect(item.metadata.image).toEqual("https://http.cat/images/205.jpg");
    expect(item.quantity).toEqual(5);
  });
  test("OrderManager - create/update", async () => {
    const { id } = await stateManager.orders.create();
    const o = await stateManager.items.create({
      price: "12.00",
      metadata: {
        title: "Test Item in Order Test",
        description: "Test description 1",
        image: "https://http.cat/images/201.jpg",
      },
    });
    await stateManager.orders.changeItems(id, o.id, 4);
    const uo = await stateManager.orders.get(id);
    expect(uo.items[o.id]).toEqual(4);
    //Since we just created this order, status should be pending.
    expect(uo.status).toEqual("PENDING");
  });

  test("OrderManager - updateShippingDetails/cancel", async () => {
    const { id } = await stateManager.orders.create();
    const shippingInfo = {
      name: "Paul Atreides",
      address1: "100 Colomb Street",
      city: "Arakkis",
      postalCode: "SE10 9EZ",
      country: "Dune",
      phoneNumber: "0103330524",
    };
    await stateManager.orders.updateShippingDetails(id, shippingInfo);
    const { status, shippingDetails } = await stateManager.orders.get(id);
    expect(status).toEqual("PENDING");
    expect(shippingDetails!.name).toEqual(shippingInfo.name);
    expect(shippingDetails!.address1).toEqual(shippingInfo.address1);
    expect(shippingDetails!.city).toEqual(shippingInfo.city);
    expect(shippingDetails!.phoneNumber).toEqual(shippingInfo.phoneNumber);
    expect(shippingDetails!.country).toEqual(shippingInfo.country);
    expect(shippingDetails!.postalCode).toEqual(shippingInfo.postalCode);

    //should be able to update partially
    await stateManager.orders.updateShippingDetails(id, {
      country: "Mexico",
      phoneNumber: "1113334444",
    });
    const updated = await stateManager.orders.get(id);
    expect(updated!.shippingDetails!.name).toEqual(shippingInfo.name);
    expect(updated!.shippingDetails!.country).toEqual("Mexico");
    expect(updated!.shippingDetails!.phoneNumber).toEqual("1113334444");

    await stateManager.orders.cancel(id, 0);
    const canceled = await stateManager.orders.get(id);
    //New status should be fail
    expect(canceled.status).toEqual("FAILED");
  });
  test("OrderManager - calling commit should trigger an updateOrder event with itemsFinalized property", async () => {
    const { id } = await stateManager.orders.create();
    await stateManager.items.create({
      price: "12.00",
      metadata: {
        title: "Test Item in Order Test",
        description: "Test description 1",
        image: "https://http.cat/images/201.jpg",
      },
    });
    const order = await stateManager.orders.get(id);
    //Before order is committed, it should not have an orderFinalized property
    expect(order.orderFinalized).toBeFalsy();

    await stateManager.orders.commit(id, zeroAddress, 1, "default");
    let received = false;
    stateManager.orders.on("itemsFinalized", (order) => {
      received = true;
    });
    await vi.waitUntil(async () => {
      return received;
    });
    const committed = await stateManager.orders.get(id);
    expect(committed.orderFinalized).toBeTruthy();
  });
});

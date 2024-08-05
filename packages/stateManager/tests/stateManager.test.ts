import { describe, expect, test, vi } from "vitest";
import { MemoryLevel } from "memory-level";
import { StateManager } from "@massmarket/stateManager";
import { testVectors } from "@massmarket/schema";
import { MockClient } from "./mockClient";
import {
  randomAddress,
  random32BytesHex,
  zeroAddress,
} from "@massmarket/utils";
import schema from "@massmarket/schema";
const db = new MemoryLevel({
  valueEncoding: "json",
});
db.clear();
const listingStore = db.sublevel("listingStore", {
  valueEncoding: "json",
});
const tagStore = db.sublevel("tagStore", {
  valueEncoding: "json",
});
const shopManifestStore = db.sublevel("shopManifestStore", {
  valueEncoding: "json",
});
const orderStore = db.sublevel("orderStore", {
  valueEncoding: "json",
});

const keycardStore = db.sublevel("keycardStore", {
  valueEncoding: "json",
});

describe("Fill state manager with test vectors", async () => {
  const client = new MockClient();
  const stateManager = new StateManager(
    // @ts-expect-error FIXME looking for client to be RelayClient
    client,
    listingStore,
    tagStore,
    shopManifestStore,
    orderStore,
    keycardStore,
  );

  let count = 0;

  stateManager.manifest.on("createShopManifest", (g) => {
    count++;
  });
  stateManager.manifest.on("updateShopManifest", (g) => {
    count++;
  });
  stateManager.items.on("createItem", (g) => {
    count++;
  });
  stateManager.items.on("updateItem", (g) => {
    count++;
  });
  stateManager.items.on("changeStock", (g) => {
    count++;
  });
  stateManager.items.on("addItemId", (g) => {
    count++;
  });
  stateManager.items.on("removeItemId", (g) => {
    count++;
  });
  stateManager.orders.on("createOrder", (g) => {
    count++;
  });
  stateManager.orders.on("orderCanceled", (g) => {
    count++;
  });
  stateManager.orders.on("itemsFinalized", (g) => {
    count++;
  });
  stateManager.tags.on("createTag", (g) => {
    count++;
  });
  stateManager.orders.on("updateShippingDetails", (g) => {
    count++;
  });
  stateManager.orders.on("changeItems", (g) => {
    count++;
  });
  stateManager.keycards.on("newKeyCard", (g) => {
    count++;
  });

  client.connect();

  await vi.waitUntil(async () => {
    return count == testVectors.events.length;
  });
  const vectorState = testVectors.reduced;

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
    const listingIterator = stateManager.items.iterator;
    for await (const [id, item] of listingIterator) {
      const vectorItem = vectorState.items[id];
      expect(item.price).toEqual(vectorItem.price);
      const parsed = JSON.parse(vectorItem.metadata);
      expect(item.metadata.title).toEqual(parsed.title);
      expect(item.metadata.image).toEqual(parsed.image);
      expect(item.quantity).toEqual(vectorItem.stock_qty);
    }
  });

  test("TagManager - adds and updates tag events", async () => {
    const tagIterator = stateManager.tags.iterator;
    const { tags } = vectorState;
    for await (const [id, tag] of tagIterator) {
      expect(tags[id].name).toEqual(tag.name);
    }
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
    // @ts-expect-error FIXME looking for client to be RelayClient
    client,
    listingStore,
    tagStore,
    shopManifestStore,
    orderStore,
    keycardStore,
  );
  let tokenId = null;
  test("ShopManifest - create", async () => {
    db.clear();
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
    db.clear();
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
        name: "Test Item 1",
        description: "Test description 1",
        image: "https://http.cat/images/201.jpg",
      },
    });

    const item = await stateManager.items.get(id);
    expect(item.price).toEqual("12.00");
    expect(item.metadata.name).toEqual("Test Item 1");
    expect(item.metadata.description).toEqual("Test description 1");
    expect(item.metadata.image).toEqual("https://http.cat/images/201.jpg");
    expect(item.quantity).toEqual(0);
  });
  test("ListingManager - update + changeStock", async () => {
    db.clear();
    const { id } = await stateManager.items.create({
      price: "12.00",
      metadata: {
        name: "Test Item 2",
        description: "Test description 2",
        image: "https://http.cat/images/201.jpg",
      },
    });
    await stateManager.items.update({
      id,
      price: "25.00",
      metadata: {
        name: "Updated Test Item 1",
        description: "Updated test description 1",
        image: "https://http.cat/images/205.jpg",
      },
    });
    const r = await stateManager.items.changeStock([id], [5]);
    const item = await stateManager.items.get(id);
    expect(item.price).toEqual("25.00");
    expect(item.metadata.name).toEqual("Updated Test Item 1");
    expect(item.metadata.description).toEqual("Updated test description 1");
    expect(item.metadata.image).toEqual("https://http.cat/images/205.jpg");
    expect(item.quantity).toEqual(5);
  });
  test("OrderManager - create/update", async () => {
    const { id } = await stateManager.orders.create();
    const o = await stateManager.items.create({
      price: "12.00",
      metadata: {
        name: "Test Item in Order Test",
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

  test("OrderManager - cancel", async () => {
    db.clear();
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
    const {
      status,
      shippingDetails: {
        name,
        address1,
        city,
        postalCode,
        country,
        phoneNumber,
      },
    } = await stateManager.orders.get(id);
    expect(status).toEqual("PENDING");
    expect(name).toEqual(shippingInfo.name);
    expect(address1).toEqual(shippingInfo.address1);
    expect(city).toEqual(shippingInfo.city);
    expect(phoneNumber).toEqual(shippingInfo.phoneNumber);
    expect(country).toEqual(shippingInfo.country);
    expect(postalCode).toEqual(shippingInfo.postalCode);

    //should be able to update partially
    await stateManager.orders.updateShippingDetails(id, {
      country: "Mexico",
      phoneNumber: "1113334444",
    });
    const updated = await stateManager.orders.get(id);
    expect(updated.shippingDetails.name).toEqual(shippingInfo.name);
    expect(updated.shippingDetails.country).toEqual("Mexico");
    expect(updated.shippingDetails.phoneNumber).toEqual("1113334444");

    await stateManager.orders.cancel(id, 0);
    const canceled = await stateManager.orders.get(id);
    //New status should be fail
    expect(canceled.status).toEqual("FAILED");
  });
});

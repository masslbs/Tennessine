// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { expect, test, vi, describe } from "vitest";

import { MockClient, type VectorItems } from "./mockClient";
import { buildState } from "../src/utils/buildState";
import {
  productReducer,
  productAction,
  updateProductAction,
} from "../src/reducers/productReducers";
import { allTagsReducer, allTagsAction } from "../src/reducers/tagReducers";
import { orderReducer, allOrderActions } from "../src/reducers/orderReducers";
import {
  finalizedOrderActions,
  finalizedOrderReducer,
} from "../src/reducers/finalizedOrderReducers";
import { pubKeyReducer, pubKeyAction } from "../src/reducers/KCPubKeysReducers";
import { storeReducer, updateStoreDataAction } from "@/reducers/storeReducer";
import {
  acceptedCurrencyReducer,
  AcceptedCurrencyActions,
} from "@/reducers/acceptedCurrencyReducers";

describe("mockclient", async () => {
  const client = new MockClient();
  let storeData = { name: "", profilePictureUrl: "", baseCurrencyAddr: null };
  let products = new Map();
  let allTags = new Map();
  let orderItems = new Map();
  let publishedTagId: `0x${string}` = "0x";
  let acceptedCurrencies;
  const events = [];
  let finalizedOrders = new Map();
  let pubKeys: `0x${string}`[] = [];
  function productsDispatch(action: productAction | updateProductAction) {
    products = productReducer(products, action);
  }
  function tagsDisaptch(action: allTagsAction) {
    allTags = allTagsReducer(allTags, action);
  }
  function setOrderItems(action: allOrderActions) {
    orderItems = orderReducer(orderItems, action);
  }
  function setPublishedTagId(id: `0x${string}`) {
    publishedTagId = id;
    console.log(`publishedTagId set to: ${publishedTagId}`);
  }
  function setFinalizedOrders(action: finalizedOrderActions) {
    finalizedOrders = finalizedOrderReducer(finalizedOrders, action);
  }
  function setPubKeys(action: pubKeyAction) {
    pubKeys = pubKeyReducer(pubKeys, action);
  }
  function setStoreData(action: updateStoreDataAction) {
    //@ts-expect-error FIXME
    storeData = storeReducer(storeData, action);
  }
  function setAcceptedCurrencies(action: AcceptedCurrencyActions) {
    acceptedCurrencies = acceptedCurrencyReducer(new Map(), action);
    console.log({ acceptedCurrencies });
  }

  client.on("event", (e) => {
    events.push(e.request);
    buildState(
      products,
      allTags,
      e,
      productsDispatch,
      tagsDisaptch,
      setOrderItems,
      setPublishedTagId,
      setFinalizedOrders,
      setPubKeys,
      setStoreData,
      setAcceptedCurrencies,
    );
  });

  await client.connect();
  const vectorItems: VectorItems = client.vectors.reduced.items;

  await vi.waitUntil(async () => {
    return events.length == client.vectors.events.length;
  });

  const testItemsMap = new Map(Object.entries(vectorItems));
  const testDataKeysArr = Array.from([...testItemsMap.keys()]);
  const testPublishedTag = client.vectors.reduced.manifest.published_tag;
  const productsMapKeysArr = Array.from([...products.keys()]);
  const testTagsMap = new Map(Object.entries(client.vectors.reduced.tags));
  test("Correctly builds a map of all products", () => {
    //first item
    expect(products.size).toEqual(testItemsMap.size);
    expect(products.get(productsMapKeysArr[0]).price).toEqual(
      testItemsMap.get(testDataKeysArr[0])?.price,
    );
    const testData = testItemsMap.get(testDataKeysArr[0])?.metadata as string;
    const productsData = products.get(productsMapKeysArr[0]).metadata;
    expect(productsData.title).toEqual(JSON.parse(testData).title);
    //second item
    const testData2 = testItemsMap.get(testDataKeysArr[1])?.metadata as string;
    const productsData2 = products.get(productsMapKeysArr[1]).metadata;
    expect(products.get(productsMapKeysArr[1]).price).toEqual(
      testItemsMap.get(testDataKeysArr[1])?.price,
    );
    expect(productsData2.image).toEqual(JSON.parse(testData2).image);
  });

  test("Correctly stores published tag id", () => {
    expect(publishedTagId).toEqual(testPublishedTag);
  });

  test("Add a product to tag", () => {
    const itemTagIds = products.get(productsMapKeysArr[0]).tagIds;
    const firstTagId = itemTagIds[0];
    expect(firstTagId).toContain(
      testItemsMap.get(testDataKeysArr[0])?.tag_id[0],
    );
    const tag = allTags.get(firstTagId);
    const testTag = testTagsMap.get(firstTagId);
    expect(tag.text).toEqual(testTag?.name);
  });

  test("Remove product from tag", () => {
    expect(products.get(productsMapKeysArr[1]).tagIds).toEqual(
      testItemsMap.get(testDataKeysArr[1])?.tag_id,
    );
  });

  test("Create order", () => {
    const testDataOrderObj = client.vectors.reduced.orders.open;
    const testDataFirstOrderId = Object.keys(testDataOrderObj)[0];
    const testDataFirstOrderItemId = Object.keys(
      testDataOrderObj[testDataFirstOrderId],
    )[0];
    const orderExists = orderItems.get(testDataFirstOrderId);
    expect(orderExists.items).toBeTruthy();
    expect(orderExists.items[testDataFirstOrderItemId]).toEqual(
      testDataOrderObj[testDataFirstOrderId][testDataFirstOrderItemId],
    );
  });

  test("Change stock of item", () => {
    expect(products.get(productsMapKeysArr[0]).stockQty).toEqual(
      testItemsMap.get(testDataKeysArr[0])?.stock_qty,
    );
    expect(products.get(productsMapKeysArr[1]).stockQty).toEqual(
      testItemsMap.get(testDataKeysArr[1])?.stock_qty,
    );
  });
});

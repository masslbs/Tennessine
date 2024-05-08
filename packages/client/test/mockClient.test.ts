// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: MIT

import { expect, test, vi, describe } from "vitest";

import { MockClient, type VectorItems } from "./mockClient";
import { buildState } from "@massmarket/frontend/src/utils/buildState";
import {
  productReducer,
  productAction,
  updateProductAction,
} from "@massmarket/frontend/src/reducers/productReducers";
import {
  allTagsReducer,
  allTagsAction,
} from "@massmarket/frontend/src/reducers/tagReducers";
import {
  cartReducer,
  allCartActions,
} from "@massmarket/frontend/src/reducers/cartReducers";
import {
  finalizedCartActions,
  finalizedCartReducer,
} from "@massmarket/frontend/src/reducers/finalizedCartReducers";

describe("mockclient", async () => {
  const client = new MockClient();
  let products = new Map();
  let allTags = new Map();
  let cartItems = new Map();
  let etErc20Addr: null | `0x${string}` = null;
  let publishedTagId = null;
  const events = [];
  let finalizedCarts = new Map();

  function productsDispatch(action: productAction | updateProductAction) {
    products = productReducer(products, action);
  }
  function tagsDisaptch(action: allTagsAction) {
    allTags = allTagsReducer(allTags, action);
  }
  function setCartItems(action: allCartActions) {
    cartItems = cartReducer(cartItems, action);
  }
  function setErc20Addr(add: `0x${string}` | null) {
    etErc20Addr = add;
    console.log(`etErc20Addr set to: ${etErc20Addr}`);
  }
  function setPublishedTagId(id: `0x${string}` | null) {
    publishedTagId = id;
    console.log(`publishedTagId set to: ${publishedTagId}`);
  }
  function setFinalizedCarts(action: finalizedCartActions) {
    finalizedCarts = finalizedCartReducer(finalizedCarts, action);
  }

  client.on("event", (e) => {
    events.push(e.request);
    buildState(
      products,
      allTags,
      e.request.events,
      productsDispatch,
      tagsDisaptch,
      setCartItems,
      setErc20Addr,
      setPublishedTagId,
      setFinalizedCarts,
    );
  });

  await client.connect();
  const vectorItems: VectorItems = client.vectors.reduced.items;

  await vi.waitUntil(async () => {
    return events.length == client.vectors.events.length;
  });

  const testItemsMap = new Map(Object.entries(vectorItems));
  const testDataKeysArr = Array.from([...testItemsMap.keys()]);
  const testTagsMap = new Map(
    Object.entries(client.vectors.reduced.manifest.published_tag),
  );
  const productsMapKeysArr = Array.from([...products.keys()]);

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

  test("Correctly builds a map of all tags", () => {
    const allTagsKeysArr = Array.from([...allTags.keys()]);
    const firstTagId = allTags.get(allTagsKeysArr[0]).id;
    //chop off '0x'
    const idToHex = firstTagId.slice(2);
    expect(testTagsMap.size).toEqual(allTags.size);
    expect(testTagsMap.get(idToHex)?.text).toEqual(
      allTags.get(firstTagId).text,
    );
  });

  test("Add a product to tag", () => {
    const firstItemTagIds = products.get(productsMapKeysArr[0]).tagIds;
    //chop off '0x'
    const idToHex = firstItemTagIds[0].slice(2);
    expect(firstItemTagIds[0]).toContain(
      testItemsMap.get(testDataKeysArr[0])?.tag_id[0],
    );
    const tag = allTags.get(firstItemTagIds[0]);
    const testTag = testTagsMap.get(idToHex);
    expect(tag.text).toEqual(testTag?.text);
  });

  test("Remove product from tag", () => {
    expect(products.get(productsMapKeysArr[1]).tagIds).toEqual(
      testItemsMap.get(testDataKeysArr[1])?.tag_id,
    );
  });

  test("Create cart", () => {
    const testDataCartObj = client.vectors.reduced.open_carts;
    const testDataFirstCartId = Object.keys(testDataCartObj)[0];
    const testDataFirstCartItemId = Object.keys(
      testDataCartObj[testDataFirstCartId],
    )[0];
    const cartExists = cartItems.get(`0x${testDataFirstCartId}`);
    expect(cartExists.items).toBeTruthy();
    expect(cartExists.items[`0x${testDataFirstCartItemId}`]).toEqual(
      testDataCartObj[testDataFirstCartId][testDataFirstCartItemId],
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

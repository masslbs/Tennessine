// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { expect, test, vi, describe } from "vitest";

import { MockClient, type VectorItems } from "./mockClient";
import { StateManager } from "@massmarket/stateManager";
import { Level } from "level";

describe("mockclient", async () => {
  const client = new MockClient();
  const db = new Level(`./test`, {
    valueEncoding: "json",
  });
  const listingStore = db.sublevel("listingStore");
  const tagStore = db.sublevel("tagStore");
  const shopDetailStore = db.sublevel("shopDetailStore");
  const orderStore = db.sublevel("orderStore");
  const events = [];
  const stateManager = new StateManager(
    client,
    listingStore,
    tagStore,
    shopDetailStore,
    orderStore,
  );
  client.on("events", (e) => {
    events.push(e.request);
  });
  await client.connect();
  const itemIterator = stateManager.items.getIterator();
  await vi.waitUntil(async () => {
    return events.length == client.vectors.events.length;
  });
  const test = itemIterator();
  const tesdt = test.all();
  console.log(tesdt);
});

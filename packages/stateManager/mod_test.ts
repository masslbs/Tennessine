import { assertEquals } from "@std/assert";

import { MemStore } from "@massmarket/store";
import { createTestClients } from "@massmarket/client/test";
import {
  type codec,
  extractEntriesFromHAMT,
  fetchAndDecode,
} from "@massmarket/utils";

import StateManager from "./mod.ts";

type TestVector = Map<
  string,
  Array<Map<string, Map<string, Map<string, Map<string, codec.CodecValue>>>>>
>;

Deno.test("Database Testings", async (t) => {
  const store = new MemStore();

  await t.step("Set Manifest, Listings, and Orders", async () => {
    //Manifest
    const manifestVector = await fetchAndDecode("ManifestOkay") as TestVector;
    const manifests = manifestVector.get("Snapshots")?.map((snapshot) => {
      return snapshot!.get("After")!.get("Value")!.get("Manifest");
    }) || [];
    const db = new StateManager({
      store,
      objectId: manifests[0]!.get("ShopID") as bigint,
    });
    // Need to initialize the listings map
    await db.set(["Listings"], new Map());
    await db.set(["Orders"], new Map());
    await db.set(["Manifest"], manifests[0]!);

    const result = await db.get(["Manifest"]);
    assertEquals(result, manifests[0]);
    //Listing
    const ListingsVector = await fetchAndDecode("ListingOkay") as TestVector;
    const listings = ListingsVector?.get("Snapshots")?.map((snapshot) => {
      const hamtNode = snapshot?.get("After")?.get("Value")?.get(
        "Listings",
      );
      return extractEntriesFromHAMT(hamtNode);
    }) || [];
    for (const listingMap of listings) {
      for (const [id, listing] of listingMap.entries()) {
        await db.set(["Listings", id], listing as codec.CodecValue);
        const result = await db.get(["Listings", id]);
        assertEquals(result, listing);
      }
    }
    //Order
    const OrderVector = await fetchAndDecode("OrderOkay") as TestVector;
    const orders = OrderVector?.get("Snapshots")?.map((snapshot) => {
      const hamtNode = snapshot?.get("After")?.get("Value")?.get("Orders");
      return extractEntriesFromHAMT(hamtNode);
    }) || [];

    for (const orderMap of orders) {
      for (const [id, order] of orderMap.entries()) {
        await db.set(["Orders", id], order as codec.CodecValue);
        const result = await db.get(["Orders", id]);
        assertEquals(result, order);
      }
    }
  });

  await t.step("add a relay and set a key and retrieve it", async () => {
    const { relayClient } = await createTestClients();
    const sm = new StateManager({
      store,
      objectId: relayClient.shopId,
    });
    // connect to the relay
    const { resolve, promise } = Promise.withResolvers();
    sm.events.on((manifestPatch) => {
      console.log(manifestPatch);
      resolve(manifestPatch);
    }, ["Manifest"]);

    await sm.addConnection(relayClient);
    await promise;
    const testAddr = Uint8Array.from([
      0xf0,
      0xf1,
      0xf2,
      0x03,
      0x04,
      0x05,
      0xf6,
      0xf7,
      0xf8,
      0x09,
      0x0a,
      0x0b,
      0xfc,
      0xfd,
      0xfe,
      0x0f,
      0x01,
      0x02,
      0xf3,
      0xf4,
    ]);

    const testCurrency = new Map<string, codec.CodecValue>([
      ["Address", testAddr],
      ["ChainID", 1337],
    ]);
    await sm.set(
      ["Manifest", "PricingCurrency"],
      testCurrency,
    );
    const value = await sm.get(["Manifest", "PricingCurrency"]);
    assertEquals(
      value,
      new Map<string, codec.CodecValue>([
        ["Address", testAddr],
        ["ChainID", 1337],
      ]),
    );
  });
});

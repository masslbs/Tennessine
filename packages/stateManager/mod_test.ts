import { assertEquals } from "@std/assert";

import { MemStore } from "@massmarket/merkle-dag-builder/memstore";
import { createTestClients } from "@massmarket/client/test";
import { extractEntriesFromHAMT, fetchAndDecode } from "@massmarket/utils";

import StateManager from "./mod.ts";
import { Listing } from "../schema/standin_listing.ts";
import { Manifest } from "../schema/standin_manifest.ts";
import { Order } from "../schema/standin_order.ts";

Deno.test("Database Testings", async (t) => {
  const store = new MemStore();

  await t.step("Set Manifest, Listings, and Orders", async () => {
    const manifestVector = await fetchAndDecode("ManifestOkay");
    const manifests = manifestVector.get("Snapshots")?.map((snapshot: any) => {
      return snapshot.get("After").get("Value").get("Manifest");
    }) || [];
    const db = new StateManager({
      store,
      objectId: manifests[0].get("ShopID") as bigint,
    });
    // Need to initialize the listings map
    await db.set(["Listings"], new Map());
    await db.set(["Orders"], new Map());

    await t.step("Set Manifest", async () => {
      const unpacked = new Manifest(manifests[0]);
      const mapped = unpacked.returnAsMap();
      await db.set(["Manifest"], mapped);

      const result = await db.get(["Manifest"]);
      assertEquals(result, manifests[0]);
    });

    await t.step("Set Listings", async () => {
      const ListingsVector = await fetchAndDecode("ListingOkay");
      const listings =
        ListingsVector?.get("Snapshots")?.map((snapshot: any) => {
          const hamtNode = snapshot?.get("After")?.get("Value")?.get(
            "Listings",
          );
          return extractEntriesFromHAMT(hamtNode);
        }) || [];
      for (const listingMap of listings) {
        for (const [id, listing] of listingMap.entries()) {
          const unpacked = new Listing(listing);
          const mapped = unpacked.returnAsMap();
          await db.set(["Listings", id], mapped);
          const result = await db.get(["Listings", id]);
          assertEquals(result, mapped);
        }
      }
      await db.get(["Listings"]);
    });
  });
  await t.step("Set Orders", async () => {
    const OrderVector = await fetchAndDecode("OrderOkay");
    const orders = OrderVector?.get("Snapshots")?.map((snapshot: any) => {
      const hamtNode = snapshot?.get("After")?.get("Value")?.get("Orders");
      return extractEntriesFromHAMT(hamtNode);
    }) || [];

    for (const orderMap of orders) {
      for (const [id, order] of orderMap.entries()) {
        const unpacked = new Order(order);
        const mapped = unpacked.returnAsMap();
        await db.set(["Orders", id], mapped);

        const result = await db.get(["Orders", id]);
        assertEquals(result, mapped);
      }
    }
    await db.get(["Orders"]);
  });
  await t.step("add a relay and set a key and retrieve it", async () => {
    const { relayClient } = await createTestClients();
    const sm = new StateManager({
      store,
      objectId: relayClient.shopId,
    });
    // connect to the relay
    const { resolve, promise } = Promise.withResolvers();
    sm.events.on(["Manifest"], (manifestPatch) => {
      resolve(manifestPatch);
    });

    await sm.addConnection(relayClient);
    // wait for the first manifest patch event
    const first = await promise;
    console.log(first);
    await sm.set(
      ["Manifest", "ShippingRegions", "default"],
      new Map([
        ["City", ""],
        ["Country", "DE"],
        ["PostalCode", ""],
        ["PriceModifiers", null],
      ]),
    );
    // const value = await sm.get(["Manifest", "ShippingRegions", "default"]);
    // assertEquals(value, "value");
  });
});

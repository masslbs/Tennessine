import { assertEquals } from "@std/assert";
import { extractEntriesFromHAMT, fetchAndDecode } from "@massmarket/utils";

import { Manifest } from "./standin_manifest.ts";
import { Listing } from "./standin_listing.ts";
// import { Order } from "./standin_order.ts";
//
type Rmap = Map<string, Rmap>;

Deno.test("unpack manifest vectors", async (t) => {
  const manifestOkayVector = await fetchAndDecode("ManifestOkay");
  const manifestOkayVectorSnapshots = manifestOkayVector.get(
    "Snapshots",
  ) as Array<Rmap>;

  const vector = manifestOkayVectorSnapshots.map(
    (snapshot) => {
      return {
        name: snapshot.get("Name") as unknown as string,
        value: snapshot?.get("After")?.get("Value")?.get("Manifest")!,
      };
    },
  ) || [];

  console.log("count of manifests", vector.length);
  for (const manifest of vector) {
    await t.step(manifest.name as string, () => {
      const unpacked = new Manifest(manifest.value);
      console.log(unpacked);
      assertEquals(unpacked.returnAsMap(), manifest.value);
    });
  }
});

Deno.test("unpack listing vectors", async (t) => {
  const listingOkayVector = await fetchAndDecode("ListingOkay") as Rmap;

  const vectors = (listingOkayVector?.get("Snapshots") as unknown as [])?.map(
    (snapshot: Rmap) => {
      const values = extractEntriesFromHAMT(
        snapshot!.get("After")!.get("Value")!.get("Listings"),
      );
      return {
        name: snapshot!.get("Name"),
        values: values,
      };
    },
  ) || [];

  console.log("count of listings", vectors.length);
  for (const vector of vectors) {
    for (const [id, listing] of vector.values.entries()) {
      await t.step(`${vector.name} - ${id}`, () => {
        console.log("listing:", vector.name, id);
        console.log(listing);
        const unpacked = new Listing(listing as Rmap);
        console.log(unpacked);
        // returnAsMap doesn't exist
        // assertEquals(listing, unpacked.returnAsMap());
      });
    }
  }
});
/*
Deno.test("unpack order vectors", async () => {
  const orderOkayVector = await fetchAndDecode("OrderOkay");

  const orders = orderOkayVector?.get("Snapshots")?.map((snapshot: any) => {
    const hamtNode = snapshot?.get("After")?.get("Value")?.get("Orders");
    return extractEntriesFromHAMT(hamtNode);
  }) || [];

  console.log("count of orders", orders.length);

  for (const orderMap of orders) {
    for (const [id, order] of orderMap.entries()) {
      console.log("order id", id);
      const unpacked = new Order(order);
      console.log(unpacked);
      assertEquals(order, unpacked.returnAsMap());
    }
  }
});
*/

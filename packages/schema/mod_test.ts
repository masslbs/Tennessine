import { assertEquals } from "@std/assert";
import { extractEntriesFromHAMT, fetchAndDecode } from "@massmarket/utils";

import { Listing, Manifest, Order } from "./mod.ts";

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
      const unpacked = Manifest.fromCBOR(
        manifest.value as Map<string, unknown>,
      );
      console.log(unpacked);
      assertEquals(unpacked.asCBORMap(), manifest.value);
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
        const unpacked = Listing.fromCBOR(listing as Map<string, unknown>);
        console.log(unpacked);
        assertEquals(unpacked.asCBORMap(), listing);
      });
    }
  }
});

Deno.test("unpack order vectors", async () => {
  const orderOkayVector = await fetchAndDecode("OrderOkay");

  const orders = (orderOkayVector?.get("Snapshots") as unknown as [])?.map(
    (snapshot: Rmap) => {
      const hamtNode = snapshot?.get("After")?.get("Value")?.get("Orders");
      return extractEntriesFromHAMT(hamtNode);
    },
  ) || [];

  console.log("count of orders", orders.length);

  for (const orderMap of orders) {
    for (const [id, order] of orderMap.entries()) {
      console.log("order id", id);
      const unpacked = Order.fromCBOR(order as Map<string, unknown>);
      console.log(unpacked);
      assertEquals(unpacked.asCBORMap(), order);
    }
  }
});

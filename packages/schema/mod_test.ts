import { codec } from "@massmarket/utils";

import { Manifest } from "./standin_manifest.ts";
import { Listing } from "./standin_listing.ts";
import { Order } from "./standin_order.ts";

async function fetchAndDecode(filename: string) {
  const response = await fetch(
    `file://${Deno.env.get("MASS_TEST_VECTORS")}/vectors/${filename}.cbor`,
  );
  const bytes = await response.bytes();
  return codec.decode(bytes) as Map<string, any>;
}

function extractEntriesFromHAMT(hamtNode: any): Map<number, any> {
  if (!hamtNode || !Array.isArray(hamtNode) || hamtNode.length < 2) {
    return new Map();
  }

  const entries = hamtNode[1];
  const result = new Map<number, any>();

  if (Array.isArray(entries)) {
    for (const entry of entries) {
      if (Array.isArray(entry) && entry.length >= 2) {
        // Check if this is a leaf node or another HAMT node
        if (entry.length > 2 && entry[2] !== null) {
          // This is another HAMT node, recurse into it
          const subEntries = extractEntriesFromHAMT(entry[2]);
          // Merge the results
          for (const [subKey, subValue] of subEntries.entries()) {
            result.set(subKey, subValue);
          }
        } else {
          // This is a leaf node
          const key = entry[0];
          const value = entry[1];
          // Convert key (Uint8Array) to number (8-byte big endian)
          const keyNum = new DataView(
            key.buffer,
            key.byteOffset,
            key.byteLength,
          )
            .getBigUint64(0, false);
          result.set(Number(keyNum), value);
        }
      }
    }
  }
  console.log("hamt result", result);
  return result;
}

Deno.test("unpack manifest vectors", async () => {
  const manifestOkayVector = await fetchAndDecode("ManifestOkay");

  const manifests =
    manifestOkayVector.get("Snapshots")?.map((snapshot: any) => {
      return snapshot.get("After").get("Value").get("Manifest");
    }) || [];

  console.log("count of manifests", manifests.length);

  for (const manifest of manifests) {
    const unpacked = new Manifest(manifest);
    console.log(unpacked);
  }
});

Deno.test("unpack listing vectors", async () => {
  const listingOkayVector = await fetchAndDecode("ListingOkay");

  const listings = listingOkayVector?.get("Snapshots")?.map((snapshot: any) => {
    const hamtNode = snapshot?.get("After")?.get("Value")?.get("Listings");
    return extractEntriesFromHAMT(hamtNode);
  }) || [];

  console.log("count of listings", listings.length);

  for (const listingMap of listings) {
    for (const [id, listing] of listingMap.entries()) {
      console.log("listing id", id);
      const unpacked = new Listing(listing);
      console.log(unpacked);
    }
  }
});

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
    }
  }
});

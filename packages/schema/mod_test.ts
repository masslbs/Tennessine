import { extractEntriesFromHAMT, fetchAndDecode } from "@massmarket/utils";

import { Manifest } from "./standin_manifest.ts";
import { Listing } from "./standin_listing.ts";
import { Order } from "./standin_order.ts";

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

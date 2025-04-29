import { Listing, Order } from "@massmarket/schema";
import { extractEntriesFromHAMT, fetchAndDecode } from "@massmarket/utils";
import type { CodecValue } from "@massmarket/utils/codec";

type TestVector = Map<
  string,
  Array<Map<string, Map<string, Map<string, Map<string, CodecValue>>>>>
>;

const manifestVector = await fetchAndDecode("ManifestOkay") as TestVector;
export const allManifests = manifestVector.get("Snapshots")?.map((snapshot) => {
  return snapshot!.get("After")!.get("Value")!.get("Manifest");
}) || [];

const listingVector = await fetchAndDecode("ShopOkay") as TestVector;
const listingsMap = new Map<number, Listing>();
listingVector.get("Snapshots")?.forEach((snapshot) => {
  const listingsHamt = extractEntriesFromHAMT(
    snapshot!.get("After")!.get("Value")!.get("Listings"),
  );
  if (!listingsHamt) throw new Error("No listings found");
  if (!(listingsHamt instanceof Map)) {
    throw new Error("Listings HAMT is not a Map");
  }
  for (const [_key, listingMap] of listingsHamt.entries()) {
    if (Number(_key) > 2 ** 32) { // TODO: fix ID type number | bigint
      continue;
    }
    listingsMap.set(Number(_key), Listing.fromCBOR(listingMap));
  }
});
const ordersVector = await fetchAndDecode("OrderOkay") as TestVector;
const ordersMap = new Map<number, Order>();
const orderListingsMap = new Map<number, Listing>();
ordersVector.get("Snapshots")?.forEach((snapshot) => {
  const ordersHamt = extractEntriesFromHAMT(
    snapshot!.get("After")!.get("Value")!.get("Orders"),
  );
  if (!ordersHamt) throw new Error("No orders found");
  if (!(ordersHamt instanceof Map)) throw new Error("Orders HAMT is not a Map");
  const listingsHamt = extractEntriesFromHAMT(
    snapshot!.get("After")!.get("Value")!.get("Listings"),
  );

  for (const [_key, orderMap] of ordersHamt.entries()) {
    ordersMap.set(Number(_key), Order.fromCBOR(orderMap));
  }
  if (!listingsHamt) throw new Error("No listings found");
  if (!(listingsHamt instanceof Map)) {
    throw new Error("Listings HAMT is not a Map");
  }
  for (const [_key, listingMap] of listingsHamt.entries()) {
    if (Number(_key) > 2 ** 32) { // TODO: fix ID type number | bigint
      continue;
    }
    orderListingsMap.set(Number(_key), Listing.fromCBOR(listingMap));
  }
});
export const allOrders = ordersMap;
export const allOrderListings = orderListingsMap;
export const allListings = listingsMap;

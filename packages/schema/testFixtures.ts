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
  for (const [_key, listingMap] of listingsHamt.entries()) {
    listingsMap.set(
      _key,
      Listing.fromCBOR(listingMap as Map<string, CodecValue>),
    );
  }
});
const ordersVector = await fetchAndDecode("OrderOkay") as TestVector;
const ordersMap = new Map<number, Order>();
const orderListingsMap = new Map<number, Listing>();
ordersVector.get("Snapshots")?.forEach((snapshot) => {
  const ordersHamt = extractEntriesFromHAMT(
    snapshot!.get("After")!.get("Value")!.get("Orders"),
  );
  const listingsHamt = extractEntriesFromHAMT(
    snapshot!.get("After")!.get("Value")!.get("Listings"),
  );
  for (const [_key, orderMap] of ordersHamt.entries()) {
    ordersMap.set(
      _key,
      Order.fromCBOR(orderMap as Map<string, CodecValue>),
    );
  }
  for (const [_key, listingMap] of listingsHamt.entries()) {
    orderListingsMap.set(
      _key,
      Listing.fromCBOR(listingMap as Map<string, CodecValue>),
    );
  }
});
export const allOrders = ordersMap;
export const allOrderListings = orderListingsMap;
export const allListings = listingsMap;

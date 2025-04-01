import { Listing } from "@massmarket/schema";
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
export const allListings = listingsMap;

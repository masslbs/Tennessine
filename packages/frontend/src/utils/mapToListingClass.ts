import { Listing } from "@massmarket/schema";
import { CodecKey, CodecValue } from "@massmarket/utils/codec";

export function mapToListingClass(allListings: Map<CodecKey, CodecValue>) {
  const listings: Listing[] = [];
  for (const [_id, l] of allListings.entries()) {
    listings.push(Listing.fromCBOR(l));
  }
  return listings;
}

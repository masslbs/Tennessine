// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: MIT
// @ts-types="./compiled.d.ts"
import pb from "./compiled.js";
export default pb.market.mass;
import { Manifest, PayeeMap, AcceptedCurrencyMap, ChainAddress } from "./standin_manifest.ts";
import { Listing, ListingMetadata } from "./standin_listing.ts";
export { Listing, ListingMetadata, Manifest, PayeeMap, AcceptedCurrencyMap, ChainAddress };

// a few concrete fields we need to handle in the client.
// these are not generated from the proto files.
export const EnvelopMessageTypes = {
  PingRequest: "pingRequest",
  SubscriptionPushRequest: "subscriptionPushRequest",
};

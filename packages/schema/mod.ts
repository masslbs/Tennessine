// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: MIT
// @ts-types="./compiled.d.ts"
import pb from "./compiled.js";
export default pb.market.mass;
import {
  AcceptedCurrencyMap,
  ChainAddress,
  Manifest,
  Payee,
  PayeeMap,
  PayeeMetadata,
} from "./standin_manifest.ts";
import {
  Listing,
  ListingMetadata,
  ListingViewState,
} from "./standin_listing.ts";
import { Order, OrderedItem, OrderState } from "./standin_order.ts";
import { BaseClass } from "./utils.ts";
export {
  AcceptedCurrencyMap,
  BaseClass,
  ChainAddress,
  Listing,
  ListingMetadata,
  ListingViewState,
  Manifest,
  Order,
  OrderedItem,
  OrderState,
  Payee,
  PayeeMap,
  PayeeMetadata,
};

// a few concrete fields we need to handle in the client.
// these are not generated from the proto files.
export const EnvelopMessageTypes = {
  PingRequest: "pingRequest",
  SubscriptionPushRequest: "subscriptionPushRequest",
};

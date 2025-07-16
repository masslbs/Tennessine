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
  ShippingRegion,
  ShippingRegionsMap,
} from "./standin_manifest.ts";
import {
  Listing,
  ListingMetadata,
  ListingViewState,
} from "./standin_listing.ts";
import {
  AddressDetails,
  Order,
  OrderedItem,
  OrderPaymentState,
  PaymentDetails,
} from "./standin_order.ts";
import { BaseClass } from "./utils.ts";
export {
  AcceptedCurrencyMap,
  AddressDetails,
  BaseClass,
  ChainAddress,
  Listing,
  ListingMetadata,
  ListingViewState,
  Manifest,
  Order,
  OrderedItem,
  OrderPaymentState,
  Payee,
  PayeeMap,
  PayeeMetadata,
  PaymentDetails,
  ShippingRegion,
  ShippingRegionsMap,
};

// a few concrete fields we need to handle in the client.
// these are not generated from the proto files.
export const EnvelopMessageTypes = {
  PingRequest: "pingRequest",
  SubscriptionPushRequest: "subscriptionPushRequest",
};
export const defaultState = new Map(Object.entries({
  Tags: new Map(),
  Orders: new Map(),
  Accounts: new Map(),
  Inventory: new Map(),
  Listings: new Map(),
  Manifest: new Map(),
  SchemeVersion: 1,
}));

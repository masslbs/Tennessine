// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: MIT

import pb from "./compiled.js";
import schema = pb.market.mass;
import google = pb.google;

export default schema;
export { google };

import testVectors from "./testVectors.json" with { type: "json" };
export { testVectors };
/**
 * Define the test vector's types
 */
type VectorEvent = {
  type: string;
  // actually all combinations are known but depends on 'type', not sure how to map this.
  // Might not be necessary to access these for these tests, tho.
  object: any;
  signature: string;
  hash: string;
  encoded: string;
};

export type VectorItems = {
  id: { raw: string };
  price: { raw: string };
  metadata?: {
    title: string;
    description: string;
    images: string[];
  };
  view_state?: number;
  stock_updates?: {
    in_stock?: boolean;
  }[];
  options?: {
    id: { raw: string };
    title?: string;
    vairations?: {
      id: { raw: string };
      variation_info: {
        title?: string;
        description?: string;
      };
      price_diff_sign: boolean;
      price_diff: {
        raw: string;
      };
    }[];
  }[];
  stock_statuses?: {
    variation_ids: { raw: string }[];
    in_stock?: boolean;
    expected_in_stock_by?: string;
  }[];
};
interface VectorAddress {
  address: { raw: string };
  chain_id: number;
  name?: string;
}

export type VectorOrderDetails = {
  payment_id: string;

  // which items and how many of them
  items: { [key: string]: number };

  // decimal string of the total price to be payed
  total: string;
};

export interface TestVectors {
  signatures: {
    shop_id: string;
    signer_address: string;
  };
  events: any;
  reduced: {
    manifest: {
      token_id: { raw: string };
      payees: VectorAddress[];
      accepted_currencies: VectorAddress[];
      pricing_currency: VectorAddress;
    };
    // keycard_id -> user_wallet
    keycards: string[];

    // item_id -> { price, metadata }
    listings: VectorItems[];

    // tag_id -> { name }
    tags: { [key: string]: { name: string; item_ids: string[] } };

    // item_id -> quantity
    inventory: {
      listing_id: string;
      variations: string[];
      quantity: number;
    }[];

    orders: {
      id: { raw: string };
      items?: {
        listing_id: { raw: string };
        quantity: number;
        variation_ids?: { raw: string }[];
      }[];
      invoice_address?: {
        name: string;
        address1: string;
        city: string;
        postal_code: string;
        country: string;
        email_address: string;
        phone_number: string;
      };
      chosen_payee?: VectorAddress;
      chosen_currency?: VectorAddress;
      payment_details?: {
        payment_id: {
          raw: string;
        };
        total: {
          raw: string;
        };
        listing_hashes?: {
          listing_hashes?: string;
          cid: string;
        }[];
        ttl: string;
        shop_signature: {
          raw: string;
        };
        canceled_at?: string;
      };
    }[];
  };
}

// Export the PB types
export type PBObject =
  | schema.IPingRequest
  | schema.IAuthenticateRequest
  | schema.IChallengeSolvedRequest
  | schema.IEventWriteRequest
  | schema.ISyncStatusRequest
  | schema.IGetBlobUploadURLRequest
  | schema.ISubscriptionRequest;

export enum PBMessage {
  PingRequest = "pingRequest",
  SubscriptionPushRequest = "subscriptionPushRequest",
}

export type PBInstance =
  | schema.PingRequest
  | schema.AuthenticateRequest
  | schema.ChallengeSolvedRequest
  | schema.SyncStatusRequest
  | schema.EventWriteRequest
  | schema.GetBlobUploadURLRequest;

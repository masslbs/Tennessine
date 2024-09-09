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
  id: number;
  base_price: { raw: string };
  base_info?: {
    title: string;
    description: string;
    images: string[];
  };
  view_state?: number;
  stock_updates?: {
    in_stock?: boolean;
  }[];
  options?: {
    id: number;
    title?: string;
    vairations?: {
      id: number;
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
    variation_ids: number[];
    in_stock?: boolean;
    expected_in_stock_by?: string;
  }[];
};
type VectorAddress = {
  address: { raw: string };
  chain_id: number;
  name?: string;
};

export type VectorOrderDetails = {
  payment_id: string;

  // which items and how many of them
  items: { [key: string]: number };

  // decimal string of the total price to be payed
  total: string;
};

export type TestVectors = {
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
      base_currency: VectorAddress;
    };
    // keycard_id -> user_wallet
    keycards: string[];

    // item_id -> { price, metadata }
    listings: VectorItems[];

    // tag_id -> { name }
    tags: { [key: string]: { name: string; item_ids: number[] } };

    // item_id -> quantity
    inventory: { listing_id: number; variations: number[]; quantity: number }[];

    orders: {
      id: number;
      state: number;
      items?: {
        listing_id: number;
        quantity: number;
        variation_ids?: number[];
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
};

// Export the PB types
export type PBObject =
  | schema.IPingRequest
  | schema.IAuthenticateRequest
  | schema.IChallengeSolvedRequest
  | schema.IEventWriteRequest
  | schema.ISyncStatusRequest
  | schema.IGetBlobUploadURLRequest
  | schema.IGetBlobUploadURLResponse;

export type PBMessage =
  // transport
  | typeof schema.PingRequest
  | typeof schema.EventWriteRequest
  | typeof schema.SyncStatusRequest
  // auth
  | typeof schema.AuthenticateRequest
  | typeof schema.ChallengeSolvedRequest
  // store
  | typeof schema.GetBlobUploadURLRequest
  | typeof schema.GetBlobUploadURLResponse;

export type PBInstance =
  | schema.PingRequest
  | schema.AuthenticateRequest
  | schema.ChallengeSolvedRequest
  | schema.SyncStatusRequest
  | schema.EventWriteRequest
  | schema.GetBlobUploadURLRequest
  | schema.GetBlobUploadURLResponse;

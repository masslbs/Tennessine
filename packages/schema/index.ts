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
  [key: string]: {
    price: string;
    metadata: string;
    tag_id: string[];
    stock_qty: number;
  };
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
    signer_address: string;
  };
  events: VectorEvent[];
  reduced: {
    manifest: {
      name: string;
      description: string;
      shop_token_id: string;
      domain: string;
      published_tag: string;
      profile_picture_url: string;
      accepted_currencies: {
        chain: number;
        addr: string;
      }[];
      base_currency: {
        chain: number;
        addr: string;
      };
    };
    // keycard_id -> user_wallet
    keycards: { [key: string]: string };

    // item_id -> { price, metadata }
    items: VectorItems;

    // tag_id -> { name }
    tags: { [key: string]: { name: string } };

    // items assigned to the published tag
    published_items: string[];

    // item_id -> quantity
    inventory: { [key: string]: number };

    orders: {
      // order_id -> item_id -> quantity
      open: {
        order_id: string;
        items: { [key: string]: number };
      }[];

      // order_id -> order details
      // items_finalized: { [key: string]: VectorOrderDetails };

      payed: {
        order_id: string;
        tx_hash: string;
      }[];

      // array of order_id
      abandoned: { order_id: string }[];
      committed: { order_id: string; items: { [key: string]: number } }[];
    };
  };
};

// Export the PB types
export type PBObject =
  | schema.IPingRequest
  | schema.IPingResponse
  | schema.IAuthenticateRequest
  | schema.IAuthenticateResponse
  | schema.IChallengeSolvedRequest
  | schema.IChallengeSolvedResponse
  | schema.IEventWriteRequest
  | schema.IEventWriteResponse
  | schema.ISyncStatusRequest
  | schema.ISyncStatusResponse
  | schema.ICommitItemsToOrderRequest
  | schema.ICommitItemsToOrderResponse
  | schema.IGetBlobUploadURLRequest
  | schema.IGetBlobUploadURLResponse;

export type PBMessage =
  // transport
  | typeof schema.PingRequest
  | typeof schema.PingResponse
  | typeof schema.EventWriteRequest
  | typeof schema.EventWriteResponse
  | typeof schema.EventPushRequest
  | typeof schema.EventPushResponse
  | typeof schema.SyncStatusRequest
  | typeof schema.SyncStatusResponse
  // auth
  | typeof schema.AuthenticateRequest
  | typeof schema.AuthenticateResponse
  | typeof schema.ChallengeSolvedRequest
  | typeof schema.ChallengeSolvedResponse
  // store
  | typeof schema.CommitItemsToOrderRequest
  | typeof schema.CommitItemsToOrderResponse
  | typeof schema.GetBlobUploadURLRequest
  | typeof schema.GetBlobUploadURLResponse;

export type PBInstance =
  | schema.PingRequest
  | schema.PingResponse
  | schema.AuthenticateRequest
  | schema.AuthenticateResponse
  | schema.ChallengeSolvedRequest
  | schema.ChallengeSolvedResponse
  | schema.SyncStatusRequest
  | schema.SyncStatusResponse
  | schema.EventWriteRequest
  | schema.EventWriteResponse
  | schema.EventPushRequest
  | schema.EventPushResponse
  | schema.CommitItemsToOrderRequest
  | schema.CommitItemsToOrderResponse
  | schema.GetBlobUploadURLRequest
  | schema.GetBlobUploadURLResponse;

// TODO: codegen these
export const MESSAGE_TYPES = new Map([
  [schema.PingRequest, 1],
  [schema.PingResponse, 2],
  [schema.EventWriteRequest, 3],
  [schema.EventWriteResponse, 4],
  [schema.SyncStatusRequest, 5],
  [schema.SyncStatusResponse, 6],
  [schema.EventPushRequest, 7],
  [schema.EventPushResponse, 8],
  // auth
  [schema.AuthenticateRequest, 20],
  [schema.AuthenticateResponse, 21],
  [schema.ChallengeSolvedRequest, 22],
  [schema.ChallengeSolvedResponse, 23],
  // store
  [schema.GetBlobUploadURLRequest, 30],
  [schema.GetBlobUploadURLResponse, 31],
  [schema.CommitItemsToOrderRequest, 32],
  [schema.CommitItemsToOrderResponse, 33],
]);

// TODO: codegen these
export const MESSAGE_PREFIXES = new Map([
  [1, schema.PingRequest],
  [2, schema.PingResponse],
  [3, schema.EventWriteRequest],
  [4, schema.EventWriteResponse],
  [5, schema.SyncStatusRequest],
  [6, schema.SyncStatusResponse],
  [7, schema.EventPushRequest],
  [8, schema.EventPushResponse],

  [20, schema.AuthenticateRequest],
  [21, schema.AuthenticateResponse],
  [22, schema.ChallengeSolvedRequest],
  [23, schema.ChallengeSolvedResponse],

  [30, schema.GetBlobUploadURLRequest],
  [31, schema.GetBlobUploadURLResponse],
  [32, schema.CommitItemsToOrderRequest],
  [33, schema.CommitItemsToOrderResponse],
]);

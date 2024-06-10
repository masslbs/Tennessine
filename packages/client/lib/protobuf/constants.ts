// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: MIT

import * as pb from "./compiled";
import mmproto = pb.market.mass;

export type PBObject =
  | mmproto.IPingRequest
  | mmproto.IPingResponse
  | mmproto.IAuthenticateRequest
  | mmproto.IAuthenticateResponse
  | mmproto.IChallengeSolvedRequest
  | mmproto.IChallengeSolvedResponse
  | mmproto.IEventWriteRequest
  | mmproto.IEventWriteResponse
  | mmproto.ISyncStatusRequest
  | mmproto.ISyncStatusResponse
  | mmproto.ICommitItemsToOrderRequest
  | mmproto.ICommitItemsToOrderResponse
  | mmproto.IGetBlobUploadURLRequest
  | mmproto.IGetBlobUploadURLResponse;

export type PBMessage =
  // transport
  | typeof mmproto.PingRequest
  | typeof mmproto.PingResponse
  | typeof mmproto.EventWriteRequest
  | typeof mmproto.EventWriteResponse
  | typeof mmproto.EventPushRequest
  | typeof mmproto.EventPushResponse
  | typeof mmproto.SyncStatusRequest
  | typeof mmproto.SyncStatusResponse
  // auth
  | typeof mmproto.AuthenticateRequest
  | typeof mmproto.AuthenticateResponse
  | typeof mmproto.ChallengeSolvedRequest
  | typeof mmproto.ChallengeSolvedResponse
  // store
  | typeof mmproto.CommitItemsToOrderRequest
  | typeof mmproto.CommitItemsToOrderResponse
  | typeof mmproto.GetBlobUploadURLRequest
  | typeof mmproto.GetBlobUploadURLResponse;

export type PBInstance =
  | mmproto.PingRequest
  | mmproto.PingResponse
  | mmproto.AuthenticateRequest
  | mmproto.AuthenticateResponse
  | mmproto.ChallengeSolvedRequest
  | mmproto.ChallengeSolvedResponse
  | mmproto.SyncStatusRequest
  | mmproto.SyncStatusResponse
  | mmproto.EventWriteRequest
  | mmproto.EventWriteResponse
  | mmproto.EventPushRequest
  | mmproto.EventPushResponse
  | mmproto.CommitItemsToOrderRequest
  | mmproto.CommitItemsToOrderResponse
  | mmproto.GetBlobUploadURLRequest
  | mmproto.GetBlobUploadURLResponse;

// TODO: codegen these
export const MESSAGE_TYPES = new Map([
  [mmproto.PingRequest, 1],
  [mmproto.PingResponse, 2],
  [mmproto.EventWriteRequest, 3],
  [mmproto.EventWriteResponse, 4],
  [mmproto.SyncStatusRequest, 5],
  [mmproto.SyncStatusResponse, 6],
  [mmproto.EventPushRequest, 7],
  [mmproto.EventPushResponse, 8],
  // auth
  [mmproto.AuthenticateRequest, 20],
  [mmproto.AuthenticateResponse, 21],
  [mmproto.ChallengeSolvedRequest, 22],
  [mmproto.ChallengeSolvedResponse, 23],
  // store
  [mmproto.GetBlobUploadURLRequest, 30],
  [mmproto.GetBlobUploadURLResponse, 31],
  [mmproto.CommitItemsToOrderRequest, 32],
  [mmproto.CommitItemsToOrderResponse, 33],
]);

// TODO: codegen these
export const MESSAGE_PREFIXES = new Map([
  [1, mmproto.PingRequest],
  [2, mmproto.PingResponse],
  [3, mmproto.EventWriteRequest],
  [4, mmproto.EventWriteResponse],
  [5, mmproto.SyncStatusRequest],
  [6, mmproto.SyncStatusResponse],
  [7, mmproto.EventPushRequest],
  [8, mmproto.EventPushResponse],

  [20, mmproto.AuthenticateRequest],
  [21, mmproto.AuthenticateResponse],
  [22, mmproto.ChallengeSolvedRequest],
  [23, mmproto.ChallengeSolvedResponse],

  [30, mmproto.GetBlobUploadURLRequest],
  [31, mmproto.GetBlobUploadURLResponse],
  [32, mmproto.CommitItemsToOrderRequest],
  [33, mmproto.CommitItemsToOrderResponse],
]);

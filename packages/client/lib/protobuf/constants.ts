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
  | mmproto.ICommitCartRequest
  | mmproto.ICommitCartResponse
  | mmproto.IGetBlobUploadURLRequest
  | mmproto.IGetBlobUploadURLResponse
  | mmproto.ISyncStatusRequest
  | mmproto.ISyncStatusResponse;

export type PBMessage =
  | typeof mmproto.PingRequest
  | typeof mmproto.PingResponse
  | typeof mmproto.AuthenticateRequest
  | typeof mmproto.AuthenticateResponse
  | typeof mmproto.ChallengeSolvedRequest
  | typeof mmproto.ChallengeSolvedResponse
  | typeof mmproto.EventWriteRequest
  | typeof mmproto.EventWriteResponse
  | typeof mmproto.CommitCartRequest
  | typeof mmproto.CommitCartResponse
  | typeof mmproto.GetBlobUploadURLRequest
  | typeof mmproto.GetBlobUploadURLResponse
  | typeof mmproto.SyncStatusRequest
  | typeof mmproto.SyncStatusResponse
  | typeof mmproto.EventPushRequest
  | typeof mmproto.EventPushResponse;

export type PBInstance =
  | mmproto.PingRequest
  | mmproto.PingResponse
  | mmproto.AuthenticateRequest
  | mmproto.AuthenticateResponse
  | mmproto.ChallengeSolvedRequest
  | mmproto.ChallengeSolvedResponse
  | mmproto.EventWriteRequest
  | mmproto.EventWriteResponse
  | mmproto.CommitCartRequest
  | mmproto.CommitCartResponse
  | mmproto.GetBlobUploadURLRequest
  | mmproto.GetBlobUploadURLResponse
  | mmproto.SyncStatusRequest
  | mmproto.SyncStatusResponse
  | mmproto.EventPushRequest
  | mmproto.EventPushResponse;

// TODO: codegen these
export const MESSAGE_TYPES = new Map([
  [mmproto.PingRequest, 1],
  [mmproto.PingResponse, 2],
  [mmproto.AuthenticateRequest, 3],
  [mmproto.AuthenticateResponse, 4],
  [mmproto.ChallengeSolvedRequest, 5],
  [mmproto.ChallengeSolvedResponse, 6],
  [mmproto.GetBlobUploadURLRequest, 9],
  [mmproto.GetBlobUploadURLResponse, 0x0a],
  [mmproto.EventWriteRequest, 0x0d],
  [mmproto.EventWriteResponse, 0x0e],
  [mmproto.CommitCartRequest, 0x13],
  [mmproto.CommitCartResponse, 0x14],
  [mmproto.SyncStatusRequest, 0x0f],
  [mmproto.SyncStatusResponse, 0x10],
  [mmproto.EventPushRequest, 0x11],
  [mmproto.EventPushResponse, 0x12],
]);

// TODO: codegen these
export const MESSAGE_PREFIXES = new Map([
  [1, mmproto.PingRequest],
  [2, mmproto.PingResponse],
  [3, mmproto.AuthenticateRequest],
  [4, mmproto.AuthenticateResponse],
  [5, mmproto.ChallengeSolvedRequest],
  [6, mmproto.ChallengeSolvedResponse],
  [9, mmproto.GetBlobUploadURLRequest],
  [0x0a, mmproto.GetBlobUploadURLResponse],
  [0x0d, mmproto.EventWriteRequest],
  [0x0e, mmproto.EventWriteResponse],
  [0x0f, mmproto.SyncStatusRequest],
  [0x10, mmproto.SyncStatusResponse],
  [0x11, mmproto.EventPushRequest],
  [0x12, mmproto.EventPushResponse],
  [0x13, mmproto.CommitCartRequest],
  [0x14, mmproto.CommitCartResponse],
]);

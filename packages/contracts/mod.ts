// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: Unlicense
import tokenAddresses from "./tokenAddresses.json" with { type: "json" };
export { tokenAddresses };
export * from "./src/generated.ts";

export const permissions = {
  addPermission: 0,
  removePermission: 1,
  updateRootHash: 2,
  addRelay: 3,
  removeRelay: 4,
  replaceRelay: 5,
  registerUser: 6,
  removeUser: 7,
  publishInviteVerifier: 8,
} as const;

// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: Unlicense

import contractAddresses from "./deploymentAddresses.json" with {
  type: "json",
};
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

const _addresses = {
  ...contractAddresses,
  anvilAddress: "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720",
  zeroAddress: "0x0000000000000000000000000000000000000000",
};

type Addresses<Object> = Record<keyof Object, `0x${string}`>;
export const addresses = _addresses as Addresses<typeof _addresses>;

export const anvilPrivateKey =
  "0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6" as const;
export const anvilPrivateKey2 =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" as const;

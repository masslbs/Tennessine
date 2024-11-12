// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: Unlicense
import type { Address } from "viem";

import addresses from "./deploymentAddresses.json" with { type: "json" };
export { addresses };
import tokenAddresses from "./tokenAddresses.json" with { type: "json" };
export { tokenAddresses };
import Payments from "./abi/Payments.json" with { type: "json" };
export { Payments };

// FIXME: this _should_ be generated from the abi
export type PaymentArgs = [
  number, //chainID
  number, //ttl
  `0x${string}`, //orderHash
  Address, //currency address
  bigint, //total
  Address, //payee address
  boolean, //isPaymentEndpoint
  `0x${string}`, //shopId
  `0x${string}`, // shopSig
];

import PaymentsByAddress from "./abi/PaymentsByAddress.json" with {
  type: "json",
};
export { PaymentsByAddress };
import RelayReg from "./abi/RelayReg.json" with { type: "json" };
export { RelayReg };
import ShopReg from "./abi/ShopReg.json" with { type: "json" };
export { ShopReg };
import ERC20 from "./abi/ERC20.json" with { type: "json" };
export { ERC20 };
import Eddies from "./abi/Eddies.json" with { type: "json" };
export { Eddies };
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
};
export const zeroAddress = "0x0000000000000000000000000000000000000000";

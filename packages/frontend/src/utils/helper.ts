import { formatUnits } from "viem";

import { KeycardRole } from "../types.ts";

export function multiplyAndFormatUnits(
  price: bigint,
  quantity: number,
  decimals: number,
) {
  return formatUnits(BigInt(price) * BigInt(quantity), decimals);
}

export function removeCachedKeycards() {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.includes("keycard")) {
      const keycard = JSON.parse(localStorage.getItem(key)!);
      if (keycard.role === KeycardRole.NEW_GUEST) {
        localStorage.removeItem(key);
        i--;
      }
    }
  }
}

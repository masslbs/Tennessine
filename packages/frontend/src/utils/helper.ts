import { formatUnits } from "viem";

import { KeycardRole, OrderState } from "../types.ts";

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
export function isValidEmail(email: string) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}
export function formatDate(ttl: number) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(ttl * 1000);
}

export function OrderStateFromNumber(num: number) {
  switch (num) {
    case OrderState.Unspecified:
      return `Unspecified`;
    case OrderState.Open:
      return `Open`;
    case OrderState.Canceled:
      return `Canceled`;
    case OrderState.Committed:
      return `Committed`;
    case OrderState.PaymentChosen:
      return `Payment Chosen`;
    case OrderState.Unpaid:
      return `Unpaid`;
    case OrderState.Paid:
      return `Paid`;
    default:
      throw new Error(`Invalid order state: ${num}`);
  }
}

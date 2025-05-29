// Any utility functions for form validation
import { isAddress, isHex, toHex } from "viem";

export function isValidHex(hex: string) {
  return isHex(hex);
}

export function isValidAddress(address: Uint8Array) {
  return isAddress(toHex(address));
}

export function isValidUrl(urlString: string): boolean {
  try {
    new URL(urlString);
    return true;
  } catch (_e) {
    return false;
  }
}

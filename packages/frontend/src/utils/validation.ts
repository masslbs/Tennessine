// Any utility functions for form validation
import { isAddress, isHex, toHex } from "viem";

export const isValidHex = (hex: string) => {
  return isHex(hex);
};

export const isValidAddress = (address: Uint8Array) => {
  return isAddress(toHex(address));
};

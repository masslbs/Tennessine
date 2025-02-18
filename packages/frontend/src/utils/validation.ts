// Any utility functions for form validation
import { isAddress, isHex } from "viem";

export const isValidHex = (hex: string) => {
  return isHex(hex);
};

export const isValidAddress = (address: string) => {
  return isAddress(address);
};

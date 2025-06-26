import { Address, toBytes, zeroAddress } from "viem";
import { abi, tokenAddresses } from "@massmarket/contracts";

// Any utility functions for tokens
export function getTokenAddress(
  symbol: string,
  chainId: number,
): Uint8Array {
  if (symbol === "ETH") return toBytes(zeroAddress);
  if (symbol === "EDD") return toBytes(abi.eddiesAddress);
  const addresses: {
    [key: string]: {
      [key: string]: string;
    };
  } = tokenAddresses;
  const tokenAddress = addresses[chainId][symbol] as Address;

  if (!tokenAddress) {
    throw new Error(`Token not found for ${symbol} on chainId: ${chainId}`);
  }
  return toBytes(tokenAddress);
}

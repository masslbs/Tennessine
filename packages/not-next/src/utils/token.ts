import * as abi from "@massmarket/contracts";
import { Address } from "viem";

export const getTokenAddress = (symbol: string, chainId: string): Address => {
  if (symbol === "ETH") return abi.addresses.zeroAddress;
  const addresses: {
    [key: string]: {
      [key: string]: string;
    };
  } = abi.tokenAddresses;
  const tokenAddress = addresses[chainId][symbol] as Address;

  if (!tokenAddress) {
    throw new Error(`Token not found for ${symbol} on chainId: ${chainId}`);
  }
  return tokenAddress;
};

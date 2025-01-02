import { Address, PublicClient } from "viem";
import * as abi from "@massmarket/contracts";
import { assert } from "@massmarket/utils";

// Any utility functions for tokens
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

export const getTokenInformation = (
  publicClient: PublicClient,
  tokenAddress: `0x${string}`,
): Promise<[string, number]> => {
  assert(publicClient.chain, "publicClient.chain is undefined");
  if (tokenAddress === abi.addresses.zeroAddress) {
    return new Promise((resolve) => {
      resolve(["ETH", 18]);
    });
  }
  const symbol = publicClient.readContract({
    address: tokenAddress,
    abi: abi.eddiesAbi,
    functionName: "symbol",
    args: [],
  }) as Promise<string>;
  const decimal = publicClient.readContract({
    address: tokenAddress,
    abi: abi.eddiesAbi,
    functionName: "decimals",
    args: [],
  }) as Promise<number>;
  return Promise.all([symbol, decimal]);
};

import { Address, PublicClient, toBytes, zeroAddress } from "viem";
import {
  eddiesAbi,
  eddiesAddress,
  tokenAddresses,
} from "@massmarket/contracts";
import { assert } from "@massmarket/utils";

// Any utility functions for tokens
export const getTokenAddress = (
  symbol: string,
  chainId: number,
): Uint8Array => {
  if (symbol === "ETH") return toBytes(zeroAddress);
  if (symbol === "EDD") return toBytes(eddiesAddress);
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
};

export const getTokenInformation = (
  publicClient: PublicClient,
  tokenAddress: `0x${string}`,
): Promise<[string, number]> => {
  assert(publicClient.chain, "publicClient.chain is undefined");
  if (tokenAddress === zeroAddress) {
    return new Promise((resolve) => {
      resolve(["ETH", 18]);
    });
  }
  const symbol = publicClient.readContract({
    address: tokenAddress,
    abi: eddiesAbi,
    functionName: "symbol",
    args: [],
  }) as Promise<string>;
  const decimal = publicClient.readContract({
    address: tokenAddress,
    abi: eddiesAbi,
    functionName: "decimals",
    args: [],
  }) as Promise<number>;
  return Promise.all([symbol, decimal]);
};

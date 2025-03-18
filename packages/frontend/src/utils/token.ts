import { Address, PublicClient, zeroAddress } from "viem";
import {
  eddiesAbi,
  eddiesAddress,
  tokenAddresses,
} from "@massmarket/contracts";
import { assert } from "@massmarket/utils";
import { TCurrencyMap } from "../types.ts";

// Any utility functions for tokens
export const getTokenAddress = (symbol: string, chainId: string): Address => {
  if (symbol === "ETH") return zeroAddress;
  if (symbol === "EDD") return eddiesAddress;
  const addresses: {
    [key: string]: {
      [key: string]: string;
    };
  } = tokenAddresses;
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

export function compareAddedRemovedChains(
  originalMap: TCurrencyMap,
  modifiedMap: TCurrencyMap,
) {
  const removed: { Address: string; chainID: number }[] = [];
  const added: { Address: string; chainID: number }[] = [];

  // Check for removed tokens
  originalMap.forEach((tokens, chainId) => {
    Object.keys(tokens).forEach((address) => {
      const modifiedChainTokens = modifiedMap.get(chainId);
      if (!modifiedChainTokens || !(address in modifiedChainTokens)) {
        removed.push({ Address: address, chainID: chainId });
      }
    });
  });

  // Check for added tokens
  modifiedMap.forEach((tokens, chainId) => {
    Object.keys(tokens).forEach((address) => {
      const originalChainTokens = originalMap.get(chainId);
      if (!originalChainTokens || !(address in originalChainTokens)) {
        added.push({ Address: address, chainID: chainId });
      }
    });
  });

  return { removed, added };
}

import { Address, PublicClient } from "viem";
import * as abi from "@massmarket/contracts";
import { assert } from "@massmarket/utils";
import { Currency } from "../types.js";

// Any utility functions for tokens
export const getTokenAddress = (symbol: string, chainId: string): Address => {
  if (symbol === "ETH") return abi.addresses.zeroAddress;
  if (symbol === "EDD") return abi.addresses.Eddies;
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

export function compareAddedRemovedChains(
  originalArray: Currency[],
  modifiedArray: Currency[],
) {
  const removed = originalArray.filter((item1) =>
    // Only return chains that are not in the modified array
    !modifiedArray.some((item2) =>
      item2.address.toLowerCase() === item1.address.toLowerCase() &&
      item2.chainId === item1.chainId
    )
  );

  const added = modifiedArray.filter((item2) =>
    // Only return chains that are not in the original array
    !originalArray.some((item1) =>
      item1.address.toLowerCase() === item2.address.toLowerCase() &&
      item1.chainId === item2.chainId
    )
  );

  return { removed, added };
}

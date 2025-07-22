import { Address, hexToBytes, toBytes, zeroAddress } from "viem";
import { type Chain, hardhat } from "wagmi/chains";
import { abi, tokenAddresses } from "@massmarket/contracts";
import type { CurrencyChainOption } from "../types.ts";

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

// This util formats all currencies for display for pricing/accepted currency.
export function getAllCurrencyOptions(chains: Chain[]): CurrencyChainOption[] {
  return [...chains].map((chain) => {
    return {
      label: `ETH/${chain.name}`,
      value: `ETH/${chain.id}`,
      address: hexToBytes(zeroAddress),
      chainId: chain.id,
    };
  }).concat(
    [...chains].map((chain) => {
      const token = chain.id === hardhat.id ? "EDD" : "USDC";
      return {
        label: `${token}/${chain.name}`,
        value: `${token}/${chain.id}`,
        address: getTokenAddress(token, chain.id),
        chainId: chain.id,
      };
    }),
  );
}

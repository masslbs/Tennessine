// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Metadata } from "@/types";
import { ReadonlyURLSearchParams } from "next/navigation";
import { PublicClient } from "viem";
import { zeroAddress } from "@massmarket/utils";
import * as abi from "@massmarket/contracts";
import { sepolia, hardhat } from "wagmi/chains";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const formatEthAdd = (walletAdd: string) => {
  return `${walletAdd.slice(0, 6)}...${walletAdd.slice(-4)}`;
};

export const formatPK = (pk: `0x${string}`) => {
  return `${pk.slice(0, 3)}...${pk.slice(-3)}`;
};

export const parseMetadata = (metadata: Uint8Array) => {
  const textDecoder = new TextDecoder();
  const result = textDecoder.decode(metadata);
  const _meta: Metadata = JSON.parse(result);
  return _meta;
};

export const decodeMetadata = (metadata: Uint8Array) => {
  const textDecoder = new TextDecoder();
  return textDecoder.decode(metadata);
};

export const createQueryString = (
  name: string,
  value: string,
  searchParams: ReadonlyURLSearchParams,
) => {
  const params = new URLSearchParams(searchParams);
  params.set(name, value);

  return params.toString();
};

export const isValidHex = (hex: string) => {
  return Boolean(hex.match(/^0x[0-9a-f]+$/i));
};

export const getTokenInformation = (
  publicClient: PublicClient,
  tokenAddress: `0x${string}`,
): Promise<[string, number]> => {
  if (tokenAddress === zeroAddress) {
    return new Promise((resolve) => {
      resolve(["ETH", 18]);
    });
  } else if (
    // FIXME: Cannot symbol/decimal functions from contract for test chains.
    publicClient.chain?.id === hardhat.id ||
    publicClient.chain?.id === sepolia.id
  ) {
    return new Promise((resolve) => {
      resolve(["USDC", 6]);
    });
  }
  const symbol = publicClient.readContract({
    address: tokenAddress,
    abi: abi.ERC20,
    functionName: "symbol",
    args: [],
  }) as Promise<string>;
  const decimal = publicClient.readContract({
    address: tokenAddress,
    abi: abi.ERC20,
    functionName: "decimals",
    args: [],
  }) as Promise<number>;

  return Promise.all([symbol, decimal]);
};
export const getTokenAddress = async (symbol: string, chainId: number) => {
  const testChains = chainId === 31337 || chainId === 11155111;
  // Token list from uniswap does not carry test chain token data, so directly return token addresses for ETH/USDC if selected chain is sepolia/hardhat.
  if (symbol === "ETH" && (testChains || chainId === 1)) return zeroAddress;
  if (symbol === "USDC" && testChains)
    return "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

  const response = await fetch("https://tokens.uniswap.org/");
  const tokenList = await response.json();

  const token = tokenList.tokens.find(
    (t: { symbol: string; chainId: number }) =>
      t.symbol === symbol && t.chainId === chainId,
  );
  return token ? token.address : null;
};

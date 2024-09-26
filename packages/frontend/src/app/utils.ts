// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Metadata } from "@/types";
import { ReadonlyURLSearchParams } from "next/navigation";
import { useChains } from "wagmi";
import { createPublicClient, http, PublicClient } from "viem";
import { zeroAddress } from "@massmarket/utils";
import * as abi from "@massmarket/contracts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatEthAdd(walletAdd: string) {
  return `${walletAdd.slice(0, 6)}...${walletAdd.slice(-4)}`;
}

export function formatPK(pk: `0x${string}`) {
  return `${pk.slice(0, 3)}...${pk.slice(-3)}`;
}

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
export const getChainById = (chainId: number) => {
  const chains = useChains();
  return chains.find((chain) => chainId === chain.id);
};
export const getPublicClient = (chainId: number) => {
  return createPublicClient({
    chain: getChainById(chainId),
    transport: http(),
  });
};
export const getTokenInformation = async (
  publicClient: PublicClient,
  tokenAddress: `0x${string}`,
) => {
  if (tokenAddress === zeroAddress) {
    return { symbol: "ETH", decimal: 18 };
  }
  const symbol = (await publicClient.readContract({
    address: tokenAddress,
    abi: abi.ERC20,
    functionName: "symbol",
    args: [],
  })) as string;
  const decimal = (await publicClient.readContract({
    address: tokenAddress,
    abi: abi.ERC20,
    functionName: "decimals",
    args: [],
  })) as number;
  return { symbol, decimal };
};

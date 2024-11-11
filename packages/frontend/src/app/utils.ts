// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  Address,
  type Chain,
  createPublicClient,
  createWalletClient,
  http,
  PublicClient,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat, sepolia } from "wagmi/chains";

import { assert, random32BytesHex, zeroAddress } from "@massmarket/utils";
import * as abi from "@massmarket/contracts";

import { Metadata } from "@/types";

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

export const createQueryString = (name: string, value: string) => {
  const params = new URLSearchParams();
  params.set(name, value);

  return params.toString();
};

export const isValidHex = (hex: string) => {
  return Boolean(hex.match(/^0x[0-9a-f]+$/i));
};

const defaultRPC =
  (process && process.env && process.env.NEXT_PUBLIC_ETH_RPC_URL) ||
  "http://localhost:8545";

export function createPublicClientForChain(chain: Chain) {
  return createPublicClient({
    chain,
    transport: http(defaultRPC),
  });
}

export function createGuestWalletClientForChain(chain: Chain) {
  return createWalletClient({
    account: privateKeyToAccount(random32BytesHex()),
    chain,
    transport: http(defaultRPC),
  });
}

export const getTokenInformation = (
  publicClient: PublicClient,
  tokenAddress: `0x${string}`,
): Promise<[string, number]> => {
  assert(publicClient.chain, "publicClient.chain is undefined");
  const chainId = publicClient.chain.id;
  if (tokenAddress === zeroAddress) {
    return new Promise((resolve) => {
      resolve(["ETH", 18]);
    });
  } else if (chainId === hardhat.id) {
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

export const getTokenAddress = (symbol: string, chainId: string): Address => {
  if (symbol === "ETH") return zeroAddress;
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

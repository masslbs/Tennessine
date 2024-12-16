import * as Chains from "viem/chains";
import { createPublicClient, http } from "viem";
import process from "node:process";

const defaultRPC =
  (process && process.env && process.env.NEXT_PUBLIC_ETH_RPC_URL) ||
  "http://localhost:8545";

type ChainModuleType = typeof Chains;
export function getUsedChain<
  K extends keyof ChainModuleType,
>(): ChainModuleType[K] {
  const chainName = process.env.NEXT_PUBLIC_CHAIN_NAME! as K;
  return Chains[chainName];
}

export function createPublicClientForChain() {
  const chain = getUsedChain();
  return createPublicClient({
    chain,
    transport: http(defaultRPC),
  });
}

import { hardhat, mainnet, sepolia } from "npm:viem/chains";
import { createPublicClient, http } from "npm:viem";
import process from "node:process";

const defaultRPC =
  (process && process.env && process.env.NEXT_PUBLIC_ETH_RPC_URL) ||
  "http://localhost:8545";

export function getUsedChain() {
  const chainName = process.env.NEXT_PUBLIC_CHAIN_NAME!;
  switch (chainName) {
    case "hardhat":
      return hardhat;
    case "sepolia":
      return sepolia;
    case "mainnet":
      return mainnet;
    default:
      throw new Error(`unhandled chain name ${chainName}`);
  }
}

export function createPublicClientForChain() {
  const chain = getUsedChain();
  return createPublicClient({
    chain,
    transport: http(defaultRPC),
  });
}

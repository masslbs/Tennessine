import { type Chain, hardhat, mainnet, sepolia } from "viem/chains";
import { env } from "../utils/env.ts";

export function useChain() {
  let chain: Chain;
  switch (env.chainName) {
    case "sepolia":
      chain = sepolia;
      break;
    case "mainnet":
      chain = mainnet;
      break;
    case "hardhat":
      chain = hardhat;
      break;
    default:
      throw new Error(`Unknown chain: ${env.chainName}`);
  }
  return { chain };
}

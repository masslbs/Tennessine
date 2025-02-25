import { type Chain, hardhat, mainnet, sepolia } from "viem/chains";
import { env } from "../utils/env.ts";

export function useChain() {
  const chainName = env?.VITE_CHAIN_NAME;
  let chain: Chain;
  switch (chainName) {
    case "sepolia":
      chain = sepolia;
      break;
    case "mainnet":
      chain = mainnet;
      break;
    default:
      chain = hardhat;
  }
  return { chain };
}

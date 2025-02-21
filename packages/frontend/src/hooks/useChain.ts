import { type Chain, hardhat, mainnet, sepolia } from "viem/chains";
import { logger } from "@massmarket/utils";

const namespace = "frontend: useChain";
const debug = logger(namespace);

export function useChain() {
  const chainName = import.meta.env?.VITE_CHAIN_NAME;
  let chain: Chain;
  switch (chainName) {
    case "sepolia":
      chain = sepolia;
      break;
    case "mainnet":
      chain = mainnet;
      break;
    default:
      debug("Chain name not set, defaulting to hardhat");
      chain = hardhat;
  }
  return { chain };
}

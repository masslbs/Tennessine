import { useMassMarketContext } from "./useMassMarketContext.ts";
import { type Chain, hardhat, mainnet, sepolia } from "viem/chains";

export function useShopChain() {
  const context = useMassMarketContext();
  let chain: Chain;
  switch (context.config.chainName) {
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
      throw new Error(`Unknown chain: ${context.config.chainName}`);
  }
  return { chain };
}

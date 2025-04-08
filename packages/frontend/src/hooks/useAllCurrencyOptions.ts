import { useChains } from "wagmi";
import { hexToBytes, zeroAddress } from "viem";
import { hardhat } from "viem/chains";

import { getTokenAddress } from "../utils/mod.ts";

export function useAllCurrencyOptions() {
  const chains = useChains();

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

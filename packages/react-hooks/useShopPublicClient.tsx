import * as chains from "viem/chains";
import type { Chain } from "viem";
import { usePublicClient } from "wagmi";

import { useMassMarketContext } from "./useMassMarketContext.ts";

/**
 * This hook takes the shop chain from the config, and returns a public client with the provided chain.
 */

export function useShopPublicClient() {
  const context = useMassMarketContext();
  const chain =
    chains[context.config.chainName as keyof typeof chains] as Chain;
  const shopPublicClient = usePublicClient({ chainId: chain.id });

  return { shopPublicClient };
}

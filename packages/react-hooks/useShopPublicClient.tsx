import * as chains from "viem/chains";
import type { Chain } from "viem";
import { usePublicClient } from "wagmi";

import { useMassMarketContext } from "./useMassMarketContext.ts";

export function useShopPublicClient() {
  const context = useMassMarketContext();
  const chain =
    chains[context.config.chainName as keyof typeof chains] as Chain;
  const shopPublicClient = usePublicClient({ chainId: chain.id });

  return { shopPublicClient };
}

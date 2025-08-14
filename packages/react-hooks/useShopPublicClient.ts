import * as chains from "viem/chains";
import type { Chain, PublicClient } from "viem";
import { usePublicClient } from "wagmi";

import { useMassMarketContext } from "./useMassMarketContext.ts";
import type { HookParams } from "./types.ts";

/**
 * Return type for useShopPublicClient hook
 */
export interface UseShopPublicClientReturn {
  /** Public client for the shop's chain */
  shopPublicClient: PublicClient | undefined;
}

/**
 * This hook takes the shop chain from the config, and returns a public client with the provided chain.
 */
export function useShopPublicClient(
  params?: HookParams,
): UseShopPublicClientReturn {
  const config = params?.config ?? useMassMarketContext().config;
  const chain = chains[config.chainName as keyof typeof chains] as Chain;
  const shopPublicClient = usePublicClient({ chainId: chain.id });

  return { shopPublicClient };
}

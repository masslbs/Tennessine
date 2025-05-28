import { useSearch } from "@tanstack/react-router";
import { hexToBigInt } from "viem";
import { useMassMarketContext } from "./useMassMarketContext.ts";
import type { MassMarketConfig } from "./MassMarketContext.ts";

/**
 * Returns the shopId from the search params or the shopId from the config.
 */
export function useShopId(params?: { config?: MassMarketConfig }) {
  const config = params?.config ?? useMassMarketContext().config;
  // This is for prod builds so we can have a clean url without having to include shopId in the param.
  if (config?.shopId) {
    return {
      shopId: BigInt(config.shopId),
    };
  } else {
    const search = useSearch({ strict: false });
    return {
      shopId: search?.shopId ? hexToBigInt(search.shopId, { size: 32 }) : null,
    };
  }
}

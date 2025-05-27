import { useSearch } from "@tanstack/react-router";
import { hexToBigInt } from "viem";
import { useMassMarketContext } from "./useMassMarketContext.ts";

export function useShopId() {
  const context = useMassMarketContext();
  // This is for prod builds so we can have a clean url without having to include shopId in the param.
  if (context?.config?.shopTokenId) {
    return {
      shopId: BigInt(context.config.shopTokenId),
    };
  }
  const search = useSearch({ strict: false });

  return {
    shopId: search?.shopId ? hexToBigInt(search.shopId, { size: 32 }) : null,
  };
}

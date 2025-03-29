import { useSearch } from "@tanstack/react-router";
import { env } from "../utils/env.ts";

export function useShopId() {
  if (env?.["VITE_SHOP_TOKEN_ID"]) {
    return {
      shopId: BigInt(env?.["VITE_SHOP_TOKEN_ID"] as `0x${string}`),
    };
  }
  const search = useSearch({ strict: false });
  return {
    shopId: search?.shopId ? BigInt(search.shopId) : null,
  };
}

import { useSearch } from "@tanstack/react-router";

export function useShopId() {
  const search = useSearch({ strict: false });
  return { shopId: search?.shopId ? BigInt(search.shopId) : null };
}

import { useSearch } from "@tanstack/react-router";
import { usePathname } from "./usePathname.ts";

export function useShopId() {
  const { pathname } = usePathname();
  const search = useSearch({
    from: pathname,
  });
  return {
    // Since we attach n to the shopId param string to prevent tanstack router from converting bigint to floating point.
    // We remove the n to convert it back to bigint.
    shopId: search?.shopId ? BigInt(search.shopId.replace(/n$/, "")) : null,
  };
}

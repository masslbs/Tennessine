import { useSearch } from "@tanstack/react-router";
import { usePathname } from "./usePathname.ts";

export function useShopId() {
  const { pathname } = usePathname();
  const { shopId } = useSearch({
    from: pathname,
  });

  if (typeof shopId !== "string") {
    throw new Error("shopId must be a string");
  }
  return {
    shopId: shopId ? BigInt(shopId) : null,
  };
}

import { useSearch } from "@tanstack/react-router";

export function useShopId() {
  const { shopId } = useSearch({
    strict: false,
  });

  if (shopId && typeof shopId !== "string") {
    throw new Error("shopId must be a string");
  }
  return {
    shopId: shopId ? BigInt(shopId) : null,
  };
}

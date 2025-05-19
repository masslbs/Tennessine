import { useSearch } from "@tanstack/react-router";
import { hexToBigInt } from "viem";
import { env } from "../utils/env.ts";

export function useShopId() {
  // This is for prod builds so we can have a clean url without having to include shopId in the param.
  if (env.shopTokenId) {
    return {
      shopId: BigInt(env.shopTokenId),
    };
  }
  const search = useSearch({ strict: false });

  return {
    shopId: search?.shopId ? hexToBigInt(search.shopId, { size: 32 }) : null,
  };
}

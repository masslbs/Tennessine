import { useSearch } from "@tanstack/react-router";
import { hexToBigInt } from "viem";
import { env } from "../utils/env.ts";

export function useShopId() {
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

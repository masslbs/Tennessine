import { useReadContract } from "wagmi";
import {
  skipToken,
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query";

import { abi } from "@massmarket/contracts";

import { useShopId } from "./useShopId.ts";
import type { HookParams } from "./types.ts";

export type ShopDetails = {
  name: string;
  profilePictureUrl: string;
};

/**
 * Return type for the useShopDetails hook.
 * Extends UseQueryResult with additional shop details-specific properties.
 */
export type UseShopDetailsReturn = UseQueryResult<ShopDetails> & {
  shopDetails: ShopDetails | undefined;
};

/**
 * This hook fetches the shop's metadata including name and profile picture
 * from the shop registry contract.
 */
export function useShopDetails(params?: HookParams): UseShopDetailsReturn {
  const { shopId } = useShopId(params);
  const result = useReadContract(
    {
      address: abi.shopRegAddress,
      abi: abi.shopRegAbi,
      functionName: "tokenURI",
      args: [shopId!],
    },
  );
  const enabled = !!result.data && !!shopId;
  const qResult = useQuery({
    queryKey: ["shopDetails", String(shopId), result.data],
    queryFn: enabled
      ? async () => {
        const res = await fetch(result.data);
        const data = await res.json();
        return {
          name: data.name,
          profilePictureUrl: data.image,
        };
      }
      : skipToken,
    // This ensures that the contract data is not discarded during the browser session.
    gcTime: Infinity,
    staleTime: Infinity,
  });

  return { shopDetails: qResult.data, ...qResult };
}

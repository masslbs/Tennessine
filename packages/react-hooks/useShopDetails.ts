import { useReadContract } from "wagmi";
import { skipToken, useQuery } from "@tanstack/react-query";

import { abi } from "@massmarket/contracts";

import { useShopChain } from "./useShopChain.tsx";
import { useShopId } from "./useShopId.ts";

/**
 *  This hook returns the meta data of the shop from the contract.
 */
export function useShopDetails() {
  const { chain } = useShopChain();
  const { shopId } = useShopId();
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
    queryKey: ["shopDetails", String(shopId), chain.id, result.data],
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

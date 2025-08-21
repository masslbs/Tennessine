import { useAccount, useReadContract } from "wagmi";
import type { UseQueryResult } from "@tanstack/react-query";
import { abi } from "@massmarket/contracts";
import { useShopId } from "./useShopId.ts";

export type IsOwnerResult = {
  isOwner: boolean;
} & UseQueryResult;
/**
 * Returns whether or not the connected wallet is the owner of the shop.
 */
export function useIsOwner(): IsOwnerResult {
  const { shopId } = useShopId();
  const { address: connectedAddress } = useAccount();

  const result = useReadContract({
    address: abi.shopRegAddress,
    abi: abi.shopRegAbi,
    functionName: "ownerOf",
    args: [shopId!],
  });

  return { isOwner: result.data === connectedAddress, ...result };
}

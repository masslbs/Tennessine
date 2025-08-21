import { useAccount, useReadContract } from "wagmi";
import { abi } from "@massmarket/contracts";
import { useShopId } from "./useShopId.ts";

export function useIsOwner() {
  const { shopId } = useShopId();
  const { address: connectedAddress } = useAccount();

  const result = useReadContract({
    address: abi.shopRegAddress,
    abi: abi.shopRegAbi,
    functionName: "ownerOf",
    args: [shopId!],
  });
  return { isPending: !result.data, isOwner: result.data === connectedAddress };
}

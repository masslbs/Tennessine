import { useAccount, useReadContract } from "wagmi";
import { toHex } from "viem";
import { getLogger } from "@logtape/logtape";
import {
  skipToken,
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query";

import { abi, getTokenURI, tokenOfOwnerByIndex } from "@massmarket/contracts";

import { useShopPublicClient } from "./useShopPublicClient.ts";
import type { HookParams } from "./types.ts";

type ShopMetadata = {
  id: bigint;
  name: string;
  image: string;
  description: string;
};
const logger = getLogger(["mass-market", "frontend", "useMyShops"]);

/**
 * This hook returns all the shops owned by the current account
 */

export function useMyShops(
  params?: HookParams,
): UseQueryResult<ShopMetadata[]> & { shops: ShopMetadata[] | undefined } {
  const { address } = useAccount();
  const { shopPublicClient } = useShopPublicClient(params);

  const { data: balance } = useReadContract({
    address: abi.shopRegAddress,
    abi: abi.shopRegAbi,
    functionName: "balanceOf",
    args: [address!],
  });

  async function getShopData(shopId: bigint) {
    const uri = await getTokenURI(shopPublicClient!, [shopId]);
    const res = await fetch(uri);
    const data = await res.json();
    return data;
  }

  const qResult = useQuery({
    queryKey: ["shops", address, String(balance)],
    queryFn: balance
      ? async () => {
        const allShops: ShopMetadata[] = [];
        let i = 0n;

        logger.info`Fetching ${balance} shops.`;

        while (i < balance) {
          const token = await tokenOfOwnerByIndex(shopPublicClient!, [
            address!,
            i,
          ]);
          const data = await getShopData(token);
          allShops.push({ ...data, id: toHex(token) });
          i++;
        }
        return allShops;
      }
      : skipToken,
  });

  if (qResult.error) {
    logger.error`Failed to get shops: ${qResult.error}`;
  }

  return { shops: qResult.data, ...qResult };
}

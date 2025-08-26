import { useAccount } from "wagmi";
import { getLogger } from "@logtape/logtape";
import {
  skipToken,
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query";

import { abi, getTokenURI, tokenOfOwnerByIndex } from "@massmarket/contracts";

import { useShopPublicClient } from "./useShopPublicClient.ts";
import type { HookParams } from "./types.ts";

/**
 * Shop metadata received from the contract to display merchant's shops.
 */
export type ShopMetadata = {
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
  const { data: balance } = abi.useReadShopRegBalanceOf({
    args: address ? [address] : undefined,
  });

  async function getShopData(shopId: bigint) {
    const uri = await getTokenURI(shopPublicClient!, [shopId]);
    const res = await fetch(uri);
    const data = await res.json();
    return {
      ...data,
      id: shopId,
    };
  }

  const qResult = useQuery({
    queryKey: ["shops", address, String(balance)],
    queryFn: balance
      ? () => {
        const ShopDataPromises: Promise<ShopMetadata>[] = [];
        let i = 0n;
        while (i < balance) {
          const dataPromise = tokenOfOwnerByIndex(shopPublicClient!, [
            address!,
            i,
          ]).then((tokenId) => getShopData(tokenId)).catch((err) => {
            logger.warn`incomplete shop? ${err}`;
          });
          ShopDataPromises.push(dataPromise);
          i++;
        }
        return Promise.all(ShopDataPromises);
      }
      : skipToken,
  });

  if (qResult.error) {
    logger.error`Failed to get shops: ${qResult.error.message}`;
  }
  let shops = undefined;
  if (qResult.data) {
    // we might have incomplete shops, so we filter
    shops = qResult.data.filter((data) => !!data);
  }
  return { shops, ...qResult };
}

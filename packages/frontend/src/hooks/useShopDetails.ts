import { useContext } from "react";
import { usePublicClient } from "wagmi";

import * as abi from "@massmarket/contracts";

import { useShopId } from "./useShopId.ts";
import { useQuery } from "./useQuery.ts";
import { MassMarketContext } from "../MassMarketContext.tsx";
import { useChain } from "./useChain.ts";

export function useShopDetails() {
  const { shopDetails, setShopDetails } = useContext(MassMarketContext);
  const { chain } = useChain();
  const shopPublicClient = usePublicClient(
    { chainId: chain.id },
  );
  const { shopId } = useShopId();

  const { result } = useQuery(async () => {
    if (!shopId || !shopPublicClient) return;
    const uri = await shopPublicClient.readContract({
      address: abi.addresses.ShopReg,
      abi: abi.shopRegAbi,
      functionName: "tokenURI",
      args: [shopId],
    });
    const url = uri as string;
    if (url.length) {
      const res = await fetch(url);
      const data = await res.json();
      setShopDetails({
        name: data.name,
        profilePictureUrl: data.image,
      });
    }
  }, [String(shopId), shopPublicClient]);

  return { shopDetails, setShopDetails, result };
}

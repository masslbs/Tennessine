import { useContext } from "react";
import * as abi from "@massmarket/contracts";

import { useShopId } from "./useShopId.js";
import { usePublicClient } from "./usePublicClient.js";
import { useQuery } from "./useQuery.js";
import { MassMarketContext } from "../MassMarketContext.jsx";

export function useShopDetails() {
  const { shopDetails, setShopDetails } = useContext(MassMarketContext);
  const { shopPublicClient } = usePublicClient();
  const { shopId } = useShopId();

  const { result } = useQuery(async () => {
    if (!shopId) return;
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
  }, [String(shopId)]);

  return { shopDetails, setShopDetails, result };
}

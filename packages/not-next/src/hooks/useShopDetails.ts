import { useContext, useEffect } from "react";
import * as abi from "@massmarket/contracts";
import { useShopId } from "./useShopId.ts";
import { usePublicClient } from "./usePublicClient.ts";
import { MassMarketContext } from "../MassMarketContext.tsx";

export function useShopDetails() {
  const { shopDetails, setShopDetails } = useContext(MassMarketContext);
  const { shopPublicClient } = usePublicClient();
  const { shopId } = useShopId();

  useEffect(() => {
    if (!shopId) return;
    (async () => {
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
    })();
  }, [shopId]);

  return { shopDetails, setShopDetails };
}

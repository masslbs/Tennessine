import { useEffect, useState } from "react";

import { useClientWithStateManager } from "./useClientWithStateManager.ts";
import { usePublicClient } from "./usePublicClient.ts";
import { getTokenInformation } from "../utils/token.ts";
import { ShopCurrencies, ShopManifest } from "../types.ts";
import { useQuery } from "./useQuery.ts";

export function useBaseToken() {
  const [pricingCurrency, setPricingCurrency] = useState<ShopCurrencies | null>(
    null,
  );
  const { clientStateManager } = useClientWithStateManager();
  const { shopPublicClient } = usePublicClient(pricingCurrency?.chainId);

  function getManifest() {
    clientStateManager!.stateManager.manifest.get().then(
      (manifest: ShopManifest) => {
        manifest && setPricingCurrency(manifest.pricingCurrency);
      },
    );
  }

  useEffect(() => {
    function onCreateEvent() {
      getManifest();
    }
    function onUpdateEvent() {
      getManifest();
    }
    clientStateManager!.stateManager.manifest.on("create", onCreateEvent);
    clientStateManager!.stateManager.manifest.on("update", onUpdateEvent);
    getManifest();
  }, []);

  const { result: baseToken } = useQuery(async () => {
    if (!pricingCurrency || !shopPublicClient) return;
    const { address } = pricingCurrency;
    const [symbol, decimals] = await getTokenInformation(
      shopPublicClient!,
      address!,
    );
    return { symbol, decimals };
  }, [pricingCurrency, shopPublicClient?.chain.id]);

  return { baseToken: baseToken ?? { symbol: "", decimals: 0 } };
}

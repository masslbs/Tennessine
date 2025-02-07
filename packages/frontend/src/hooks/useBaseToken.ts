import { useEffect, useState } from "react";

import { useClientWithStateManager } from "./useClientWithStateManager.js";
import { usePublicClient } from "./usePublicClient.js";
import { getTokenInformation } from "../utils/token.js";
import { ShopCurrencies, ShopManifest } from "../types.js";
import { useQuery } from "./useQuery.js";

export function useBaseToken() {
  const [pricingCurrency, setPricingCurrency] = useState<ShopCurrencies | null>(
    null,
  );
  const { clientStateManager } = useClientWithStateManager();
  const { shopPublicClient } = usePublicClient(pricingCurrency?.chainId);
  const manifestManager = clientStateManager?.stateManager?.manifest;

  function getManifest() {
    manifestManager.get().then(
      (manifest: ShopManifest) => {
        manifest && setPricingCurrency(manifest.pricingCurrency);
      },
    );
  }

  useEffect(() => {
    if (!manifestManager) return;
    function onCreateEvent() {
      getManifest();
    }
    function onUpdateEvent() {
      getManifest();
    }
    manifestManager.on("create", onCreateEvent);
    manifestManager.on("update", onUpdateEvent);
    getManifest();
    return () => {
      manifestManager.removeListener("create", onCreateEvent);
      manifestManager.removeListener("update", onUpdateEvent);
    };
  }, [manifestManager]);

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

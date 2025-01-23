import { useEffect, useState } from "react";

import { logger } from "@massmarket/utils";

import { useClientWithStateManager } from "./useClientWithStateManager.ts";
import { usePublicClient } from "./usePublicClient.ts";
import { getTokenInformation } from "../utils/token.ts";
import { ShopCurrencies, ShopManifest, Token } from "../types.ts";
import { useQuery } from "./useQuery.ts";

const namespace = "frontend:useBaseToken";
const debug = logger(namespace);

export function useBaseToken() {
  const [baseToken, setBaseToken] = useState<Token | null>(null);
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

  const { result } = useQuery(async () => {
    if (!pricingCurrency || !shopPublicClient) return;
    const { address } = pricingCurrency;
    const [symbol, decimals] = await getTokenInformation(
      shopPublicClient!,
      address!,
    );
    setBaseToken({
      symbol,
      decimals,
    });
    debug("Base token set.");
  }, [pricingCurrency?.chainId, shopPublicClient?.chain.id]);

  return { baseToken, result };
}

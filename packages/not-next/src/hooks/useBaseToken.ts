import { useEffect, useState } from "react";

import { logger } from "@massmarket/utils";

import { useClientWithStateManager } from "./useClientWithStateManager.ts";
import { usePublicClient } from "./usePublicClient.ts";
import { getTokenInformation } from "../utils/token.ts";
import { ShopCurrencies, ShopManifest, Token } from "../types.ts";

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

  useEffect(() => {
    if (pricingCurrency && shopPublicClient) {
      const { address } = pricingCurrency;
      getTokenInformation(shopPublicClient!, address!).then((res) => {
        debug(`getBaseTokenInfo: name: ${res[0]} | decimals:${res[1]}`);
        setBaseToken({
          symbol: res[0],
          decimals: res[1],
        });
      });
    }
  }, [pricingCurrency, shopPublicClient]);

  return { baseToken };
}
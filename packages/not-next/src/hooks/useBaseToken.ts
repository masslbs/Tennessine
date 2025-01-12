import { useEffect, useState } from "react";

import { logger } from "@massmarket/utils";

import { useClientWithStateManager } from "./useClientWithStateManager.ts";
import { usePublicClient } from "./usePublicClient.ts";
import { getTokenInformation } from "../utils/token.ts";
import { ShopCurrencies } from "../types.ts";

interface BaseToken {
  symbol: string;
  decimals: number;
}
const namespace = "frontend:useBaseToken";
const debug = logger(namespace);

export function useBaseToken() {
  const [baseToken, setBaseToken] = useState<BaseToken | null>(null);
  const [pricingCurrency, setPricingCurrency] = useState<ShopCurrencies | null>(
    null,
  );
  const { clientStateManager } = useClientWithStateManager();
  const { shopPublicClient } = usePublicClient(pricingCurrency?.chainId);

  useEffect(() => {
    (async () => {
      const manifest = await clientStateManager!.stateManager.manifest.get();
      setPricingCurrency(manifest.pricingCurrency);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (pricingCurrency && shopPublicClient) {
        const { address } = pricingCurrency;
        const res = await getTokenInformation(shopPublicClient!, address!);
        debug(`getBaseTokenInfo: name: ${res[0]} | decimals:${res[1]}`);
        setBaseToken({
          symbol: res[0],
          decimals: res[1],
        });
      }
    })();
  }, [pricingCurrency, shopPublicClient]);

  return { baseToken };
}

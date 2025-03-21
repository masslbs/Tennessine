import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";

import { ChainAddress, Manifest } from "@massmarket/schema";

import { useClientWithStateManager } from "./useClientWithStateManager.ts";
import { getTokenInformation } from "../utils/token.ts";
import { useQuery } from "./useQuery.ts";

export function useBaseToken() {
  const [pricingCurrency, setChainAddress] = useState<
    ChainAddress
  >(
    new ChainAddress(),
  );
  const { clientStateManager } = useClientWithStateManager();
  const shopPublicClient = usePublicClient({
    chainId: pricingCurrency?.chainId,
  });
  const sm = clientStateManager?.stateManager;

  useEffect(() => {
    if (!sm) return;

    function onUpdateEvent(m: Map<string, unknown>) {
      const manifest = new Manifest(m);
      setChainAddress(manifest.PricingCurrency);
    }

    sm.events.on(onUpdateEvent, ["Manifest"]);

    sm.get(["Manifest"]).then((m: Map<string, unknown>) => {
      const manifest = new Manifest(m);
      setChainAddress(manifest.PricingCurrency);
    });

    return () => {
      sm.events.off(onUpdateEvent, ["Manifest"]);
    };
  }, [sm]);

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

import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";

import { ChainAddress, Manifest } from "@massmarket/schema";

import { useClientWithStateManager } from "./useClientWithStateManager.ts";
import { getTokenInformation } from "../utils/token.ts";
import { useQuery } from "./useQuery.ts";

export function useBaseToken() {
  const [pricingCurrency, seTChainAddress] = useState<
    ChainAddress
  >(
    new ChainAddress(),
  );
  const { clientStateManager } = useClientWithStateManager();
  const shopPublicClient = usePublicClient({
    chainId: pricingCurrency?.chainId,
  });
  const manifestManager = clientStateManager?.stateManager?.manifest;

  function getManifest() {
    manifestManager.get().then(
      (res: Map<string, unknown>) => {
        const manifest = new Manifest(res);
        seTChainAddress(manifest.PricingCurrency);
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

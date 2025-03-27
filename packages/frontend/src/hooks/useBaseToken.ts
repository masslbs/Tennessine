import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";

import { ChainAddress } from "@massmarket/schema";

import { useClientWithStateManager } from "./useClientWithStateManager.ts";
import { getTokenInformation } from "../utils/token.ts";
import { useQuery } from "./useQuery.ts";
import { bytesToHex } from "viem";

export function useBaseToken() {
  const [pricingCurrency, setChainAddress] = useState<
    ChainAddress
  >(
    new ChainAddress(0, new Uint8Array(20)),
  );
  const { clientStateManager } = useClientWithStateManager();
  const shopPublicClient = usePublicClient({
    chainId: pricingCurrency?.chainID,
  });
  const sm = clientStateManager?.stateManager;

  useEffect(() => {
    if (!sm) return;

    const setCurrency = (currency: Map<string, unknown>) => {
      setChainAddress(ChainAddress.fromCBOR(currency));
    };
    const path = ["Manifest", "PricingCurrency"];
    sm.get(path).then((currency: Map<string, unknown>) => {
      setChainAddress(ChainAddress.fromCBOR(currency));
    });
    sm.events.on(setCurrency, path);
    return () => {
      sm.events.off(setCurrency, path);
    };
  }, [sm]);

  const { result: baseToken } = useQuery(async () => {
    if (!pricingCurrency || !shopPublicClient) return;
    const [symbol, decimals] = await getTokenInformation(
      shopPublicClient!,
      bytesToHex(pricingCurrency.Address),
    );
    return { symbol, decimals };
  }, [pricingCurrency, shopPublicClient?.chain.id]);

  return { baseToken: baseToken ?? { symbol: "", decimals: 0 } };
}

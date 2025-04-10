import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";

import { ChainAddress } from "@massmarket/schema";
import type { CodecValue } from "@massmarket/utils/codec";

import { useStateManager } from "./useStateManager.ts";
import { getTokenInformation } from "../utils/token.ts";
import { useQuery } from "./useQuery.ts";
import { bytesToHex } from "viem";
import { logger } from "@massmarket/utils";
const namespace = "frontend:useBaseToken";
const warn = logger(namespace, "warn");

export function useBaseToken() {
  const [pricingCurrency, setChainAddress] = useState<
    ChainAddress
  >(
    new ChainAddress(0, new Uint8Array(20)),
  );
  const { stateManager } = useStateManager();
  const shopPublicClient = usePublicClient({
    chainId: pricingCurrency?.ChainID,
  });

  useEffect(() => {
    if (!stateManager) return;

    const setCurrency = (currency: CodecValue) => {
      setChainAddress(ChainAddress.fromCBOR(currency));
    };
    const path = ["Manifest", "PricingCurrency"];
    stateManager.get(path).then((currency: CodecValue | undefined) => {
      if (!currency) {
        warn("No PricingCurrency found");
        return;
      }
      setChainAddress(ChainAddress.fromCBOR(currency));
    });
    stateManager.events.on(setCurrency, path);
    return () => {
      stateManager.events.off(setCurrency, path);
    };
  }, [stateManager]);

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

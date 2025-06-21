import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { skipToken, useQuery } from "@tanstack/react-query";
import { getLogger } from "@logtape/logtape";
import { bytesToHex } from "viem";

import { ChainAddress } from "@massmarket/schema";
import type { CodecValue } from "@massmarket/utils/codec";
import { getTokenInformation } from "@massmarket/contracts";

import { useStateManager } from "./useStateManager.ts";

const logger = getLogger(["mass-market", "frontend", "useBaseToken"]);

// This hook 1. retrieves the pricing currency from the shop manifest,
// 2. creates a public client with the chain ID of the pricing currency,
// 3. then retrieves the currency symbol and decimals from the contract and returns them.

export function usePricingCurrency() {
  const { stateManager } = useStateManager();
  const [pricingCurrency, setChainAddress] = useState<
    ChainAddress | null
  >(
    null,
  );
  const publicClient = usePublicClient({
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
        logger.debug("No PricingCurrency found");
        return;
      }
      setChainAddress(ChainAddress.fromCBOR(currency));
    });
    stateManager.events.on(setCurrency, path);
    return () => {
      stateManager.events.off(setCurrency, path);
    };
  }, [stateManager]);

  const enabled = !!pricingCurrency && !!publicClient;

  const query = useQuery({
    queryKey: ["pricingCurrency", pricingCurrency],
    queryFn: enabled
      ? async () => {
        const [symbol, decimals] = await getTokenInformation(
          publicClient!,
          bytesToHex(pricingCurrency.Address),
        );
        return { symbol, decimals };
      }
      : skipToken,
  });

  return { pricingCurrency: query.data };
}

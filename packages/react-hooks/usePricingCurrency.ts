import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import {
  skipToken,
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query";
import { getLogger } from "@logtape/logtape";
import { bytesToHex } from "viem";

import { ChainAddress } from "@massmarket/schema";
import type { CodecValue } from "@massmarket/utils/codec";
import { getTokenInformation } from "@massmarket/contracts";

import { useStateManager } from "./useStateManager.ts";
import type { HookParams } from "./types.ts";

export type CurrencyInfo = {
  symbol: string;
  decimals: number;
};

/**
 * Return type for the usePricingCurrency hook.
 */
export type UsePricingCurrencyReturn =
  & UseQueryResult<CurrencyInfo>
  & {
    pricingCurrency: CurrencyInfo | undefined;
  };

const logger = getLogger(["mass-market", "frontend", "useBaseToken"]);
/**
 * Hook to retrieve pricing currency information from the shop manifest.
 * This hook:
 * 1. Retrieves the pricing currency from the shop manifest
 * 2. Creates a public client with the chain ID of the pricing currency
 * 3. Retrieves the currency symbol and decimals from the contract
 */
export function usePricingCurrency(
  params?: HookParams,
): UsePricingCurrencyReturn {
  const { stateManager } = useStateManager(params);
  const [pricingCurrency, setPricingCurrency] = useState<
    ChainAddress | null
  >(
    null,
  );
  const publicClient = usePublicClient({
    chainId: pricingCurrency?.ChainID,
  });

  function setCurrency(currency: CodecValue) {
    setPricingCurrency(ChainAddress.fromCBOR(currency));
  }

  useEffect(() => {
    if (!stateManager) return;

    const path = ["Manifest", "PricingCurrency"];
    stateManager.get(path).then((c: CodecValue | undefined) => {
      if (!c) {
        logger.debug("No PricingCurrency found");
        return;
      }
      setCurrency(c);
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
        const { symbol, decimal } = await getTokenInformation(
          publicClient!,
          bytesToHex(pricingCurrency.Address),
        );
        return { symbol, decimals: decimal };
      }
      : skipToken,
  });

  return { pricingCurrency: query.data, ...query };
}

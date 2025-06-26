import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { getLogger } from "@logtape/logtape";

import { ChainAddress } from "@massmarket/schema";
import type { CodecValue } from "@massmarket/utils/codec";
import { getTokenInformation } from "@massmarket/contracts";

import { useStateManager } from "./useStateManager.ts";
import { useQuery } from "./useQuery.ts";
import { bytesToHex } from "viem";

const logger = getLogger(["mass-market", "frontend", "useBaseToken"]);

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

  const { result: baseToken } = useQuery(async () => {
    if (!pricingCurrency || !shopPublicClient) return;
    const { symbol, decimal } = await getTokenInformation(
      shopPublicClient!,
      bytesToHex(pricingCurrency.Address),
    );
    return { symbol, decimals: decimal };
  }, [pricingCurrency, shopPublicClient?.chain.id]);

  return { baseToken: baseToken ?? { symbol: "", decimals: 0 } };
}

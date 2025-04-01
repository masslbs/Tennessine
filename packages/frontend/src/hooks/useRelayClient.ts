import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { useEffect } from "react";

import { RelayClient } from "@massmarket/client";

import { useMassMarketContext } from "../MassMarketContext.ts";
import { useKeycard } from "./useKeycard.ts";
import { useChain } from "./useChain.ts";
import { useRelayEndpoint } from "./useRelayEndpoint.ts";
import { useShopId } from "./useShopId.ts";

import { defaultRPC } from "../utils/mod.ts";

export function useRelayClient() {
  const { relayClient, setRelayClient } = useMassMarketContext();
  const [keycard] = useKeycard();
  const { chain } = useChain();
  const { relayEndpoint } = useRelayEndpoint();
  const { shopId } = useShopId();

  useEffect(() => {
    if (relayClient) {
      return;
    }
    const account = privateKeyToAccount(keycard.privateKey);
    const keycardWallet = createWalletClient({
      account,
      chain,
      transport: http(
        defaultRPC,
      ),
    });
    if (!relayEndpoint) {
      console.warn("Relay endpoint is required");
      return;
    }
    if (!shopId) {
      console.warn("Shop ID is required");
      return;
    }
    const rc = new RelayClient({
      relayEndpoint,
      walletClient: keycardWallet,
      keycard: account,
      shopId,
    });

    setRelayClient(rc);
  }, [
    String(shopId),
    relayClient,
    relayEndpoint !== undefined,
    keycard.privateKey,
  ]);

  return { relayClient };
}

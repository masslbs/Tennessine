import { http } from "wagmi";
import { privateKeyToAccount } from "viem/accounts";
import { getLogger } from "@logtape/logtape";
import { skipToken, useQuery } from "@tanstack/react-query";

import { RelayClient } from "@massmarket/client";

import type { MassMarketConfig } from "./MassMarketContext.ts";
import { useKeycard } from "./useKeycard.ts";
import { useRelayEndpoint } from "./useRelayEndpoint.ts";
import { useShopId } from "./useShopId.ts";
import { hardhat } from "viem/chains";
import { createWalletClient } from "viem";

const logger = getLogger(["mass-market", "frontend", "useRelayClient"]);

/**
 * This hook instantiates a RelayClient class and connects and authenticates the relay.
 * This query will run on every app session.
 * Since useQuery caches data in memory during a single app session, it will return the RelayClient class.
 * However, during refreshes (or when the app unmounts), data is cached in the configured persister (localStorage), and since the class cannot be serialized the query is not cached.
 */
export function useRelayClient(params?: { config?: MassMarketConfig }) {
  const { data: keycard } = useKeycard(params);
  const { relayEndpoint } = useRelayEndpoint(params);
  const { shopId } = useShopId(params);

  const enabled = !!shopId && !!relayEndpoint && !!keycard;
  const qResult = useQuery({
    queryKey: ["relayClient", keycard, String(shopId)],
    queryFn: enabled
      ? async () => {
        const account = privateKeyToAccount(keycard.privateKey);
        const walletClient = createWalletClient({
          account,
          chain: hardhat,
          transport: http(),
        });
        const rc = new RelayClient({
          relayEndpoint,
          walletClient,
          keycard: account,
          shopId,
        });
        await rc.connect();
        await rc.authenticate();
        logger.debug`RelayClient connected and authenticated.`;
        return rc;
      }
      : skipToken,
    // This ensures that the query will only run once during the app session.
    gcTime: Infinity,
    //TODO: May need to reconfigure refetchOnReconnect to ensure the query runs when app regains access to the network.
    staleTime: Infinity,
    meta: { doNotPersist: true },
  });
  if (qResult.error) {
    throw qResult.error;
  }
  return { relayClient: qResult.data, ...qResult };
}

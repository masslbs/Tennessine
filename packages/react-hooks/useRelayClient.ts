import { useWalletClient } from "wagmi";
import { privateKeyToAccount } from "viem/accounts";
import { getLogger } from "@logtape/logtape";
import { useQuery } from "@tanstack/react-query";

import { RelayClient } from "@massmarket/client";

import { useKeycard } from "./useKeycard.ts";
import { useRelayEndpoint } from "./useRelayEndpoint.ts";
import { useShopId } from "./useShopId.ts";

const logger = getLogger(["mass-market", "frontend", "useRelayClient"]);

/**
 * This hook instantiates a RelayClient class and connects and authenticates the relay.
 * This query will run on every app session.
 * Since useQuery caches data in memory during a single app session, it will return the RelayClient class.
 * However, during refreshes (or when the app unmounts), data is cached in the configured persister (localStorage), and since the class cannot be serialized the query is not cached.
 */
export function useRelayClient() {
  const { data: keycard } = useKeycard();
  const { relayEndpoint } = useRelayEndpoint();
  const { shopId } = useShopId();
  const { data: wallet } = useWalletClient();

  return useQuery({
    enabled: !!relayEndpoint && !!keycard && !!shopId && !!wallet,
    queryKey: ["relayClient", keycard, String(shopId)],
    queryFn: async () => {
      const rc = new RelayClient({
        relayEndpoint,
        walletClient: wallet,
        keycard: privateKeyToAccount(keycard!.privateKey),
        shopId,
      });
      await rc.connect();
      await rc.authenticate();
      logger.debug`RelayClient connected and authenticated.`;
      return rc;
    },
    // This ensures that the query will only run once during the app session.
    gcTime: Infinity,
    staleTime: Infinity,
  });
}

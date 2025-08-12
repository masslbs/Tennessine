import { useWalletClient } from "wagmi";
import { privateKeyToAccount } from "viem/accounts";
import { getLogger } from "@logtape/logtape";
import { skipToken, useQuery } from "@tanstack/react-query";

import { RelayClient } from "@massmarket/client";
import { getBurnerWallet } from "@massmarket/utils";

import type { MassMarketConfig } from "./MassMarketContext.ts";
import { useKeycard } from "./useKeycard.ts";
import { useRelayEndpoint } from "./useRelayEndpoint.ts";
import { useShopId } from "./useShopId.ts";
import { useShopPublicClient } from "./useShopPublicClient.ts";

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
  const { shopPublicClient } = useShopPublicClient();
  const { shopId } = useShopId(params);
  const { data: connectedWallet } = useWalletClient();

  const enabled = !!shopId && !!relayEndpoint && !!keycard &&
    (keycard.role === "guest" ? true : !!connectedWallet);

  const qResult = useQuery({
    queryKey: ["relayClient", keycard, String(shopId)],
    queryFn: enabled
      ? async () => {
        console.log({ keycard });
        const { burnerWallet } = getBurnerWallet(shopPublicClient!.chain);
        const wallet = connectedWallet ?? burnerWallet;
        const rc = new RelayClient({
          relayEndpoint,
          walletClient: wallet,
          keycard: privateKeyToAccount(keycard.privateKey),
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

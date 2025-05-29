import { useWalletClient } from "wagmi";
import { privateKeyToAccount } from "viem/accounts";
import { getLogger } from "@logtape/logtape";
import { useQuery } from "@tanstack/react-query";

import { RelayClient } from "@massmarket/client";

import { useKeycard } from "./useKeycard.ts";
import { useRelayEndpoint } from "./useRelayEndpoint.ts";
import { useShopId } from "./useShopId.ts";

const logger = getLogger(["mass-market", "frontend", "useRelayClient"]);

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
    gcTime: Infinity,
    staleTime: Infinity,
  });
}

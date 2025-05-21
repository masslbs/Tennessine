import { useWalletClient } from "wagmi";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { getLogger } from "@logtape/logtape";
import { useQuery } from "@tanstack/react-query";

import { RelayClient } from "@massmarket/client";

import { useMassMarketContext } from "../MassMarketContext.ts";
import { useKeycard } from "./useKeycard.ts";
import { useChain } from "./useChain.ts";
import { useRelayEndpoint } from "./useRelayEndpoint.ts";
import { useShopId } from "./useShopId.ts";
import { env } from "../utils/mod.ts";
import { isTesting } from "../utils/env.ts";

const logger = getLogger(["mass-market", "frontend", "useRelayClient"]);

export function useRelayClient() {
  const { relayClient, setRelayClient } = useMassMarketContext();
  const { data: keycard } = useKeycard();
  const { relayEndpoint } = useRelayEndpoint();
  const { shopId } = useShopId();
  const { data: wallet } = useWalletClient();

  useQuery({
    queryKey: ["relayClient"],
    queryFn: async () => {
      const rc = new RelayClient({
        relayEndpoint,
        walletClient: wallet,
        keycard: privateKeyToAccount(keycard!.privateKey),
        shopId,
      });
      await rc.connect();
      await rc.authenticate();
      setRelayClient(rc);
      logger.debug`RelayClient connected and authenticated.`;
      return rc;
    },
    enabled: !!relayEndpoint && !!keycard && !!shopId && !!wallet,
    //do we want to connect and authenticate every time the browser is refreshed?
    refetchOnWindowFocus: "always",
  });

  return { relayClient };
}

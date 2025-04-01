import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

import { RelayClient } from "@massmarket/client";
import { logger } from "@massmarket/utils";

import { useMassMarketContext } from "../MassMarketContext.ts";
import { useKeycard } from "./useKeycard.ts";
import { useChain } from "./useChain.ts";
import { useRelayEndpoint } from "./useRelayEndpoint.ts";
import { useShopId } from "./useShopId.ts";

import { defaultRPC } from "../utils/mod.ts";
import { useQuery } from "./useQuery.ts";

const namespace = "frontend:useRelayClient";
const debug = logger(namespace);

export function useRelayClient() {
  const { relayClient, setRelayClient } = useMassMarketContext();
  const [keycard] = useKeycard();
  const { chain } = useChain();
  const { relayEndpoint } = useRelayEndpoint();
  const { shopId } = useShopId();

  useQuery(async () => {
    const account = privateKeyToAccount(keycard.privateKey);
    const keycardWallet = createWalletClient({
      account,
      chain,
      transport: http(
        defaultRPC,
      ),
    });
    if (!relayEndpoint) {
      debug("Relay endpoint is required");
      return;
    }
    if (!shopId) {
      debug("Shop ID is required");
      return;
    }
    debug(`Setting RelayClient with keycard: ${keycard.privateKey}`);
    const rc = new RelayClient({
      relayEndpoint,
      walletClient: keycardWallet,
      keycard: account,
      shopId,
    });

    setRelayClient(rc);
  }, [
    String(shopId),
    relayEndpoint,
  ]);

  return { relayClient };
}

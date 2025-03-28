import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

import { RelayClient } from "@massmarket/client";

import { useMassMarketContext } from "../MassMarketContext.ts";
import { useKeycard } from "./useKeycard.ts";
import { useChain } from "./useChain.ts";
import { useRelayEndpoint } from "./useRelayEndpoint.ts";
import { useShopId } from "./useShopId.ts";
import { useQuery } from "./useQuery.ts";
import { defaultRPC } from "../utils/mod.ts";

export function useRelayClient() {
  const { relayClient, setRelayClient } = useMassMarketContext();
  const [keycard] = useKeycard();
  const { chain } = useChain();
  const { relayEndpoint } = useRelayEndpoint();
  const { shopId } = useShopId();

  const account = privateKeyToAccount(keycard.privateKey);
  const keycardWallet = createWalletClient({
    account,
    chain,
    transport: http(
      defaultRPC,
    ),
  });

  useQuery(async () => {
    const rc = new RelayClient({
      relayEndpoint,
      walletClient: keycardWallet,
      keycard: account,
      shopId,
    });

    setRelayClient(rc);
  }, [relayEndpoint, keycard.privateKey, String(shopId)]);

  return { relayClient };
}

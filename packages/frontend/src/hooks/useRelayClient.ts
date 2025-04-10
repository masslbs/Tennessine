import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { useEffect } from "react";
import { RelayClient } from "@massmarket/client";
import { assert, logger } from "@massmarket/utils";

import { useMassMarketContext } from "../MassMarketContext.ts";
import { useKeycard } from "./useKeycard.ts";
import { useChain } from "./useChain.ts";
import { useRelayEndpoint } from "./useRelayEndpoint.ts";
import { useShopId } from "./useShopId.ts";
import { env } from "../utils/mod.ts";
import { isTesting } from "../utils/env.ts";

const namespace = "frontend:useRelayClient";
const debug = logger(namespace);

export function useRelayClient() {
  const { relayClient, setRelayClient } = useMassMarketContext();
  const [keycard] = useKeycard();
  const { chain } = useChain();
  const { relayEndpoint } = useRelayEndpoint();
  const { shopId } = useShopId();

  useEffect(() => {
    // TODO: this is a bit annoying.. in testing we are already supplying a relayClient,
    // so we don't want to create another one.
    // but, there are features in the app that want to un/reset the relayClient,
    // so we need to be careful about this.
    if (isTesting && relayClient) {
      return;
    }
    const hasRelayClient = relayClient !== undefined;
    const getKeyCardAddress = () => {
      assert(relayClient, "relayClient is undefined");
      return typeof relayClient?.keycard == "string"
        ? relayClient.keycard
        : relayClient.keycard.address;
    };
    if (hasRelayClient && getKeyCardAddress() === keycard.address) {
      debug(`RelayClient already set ${getKeyCardAddress()}`);
      return;
    }
    const account = privateKeyToAccount(keycard.privateKey);
    const keycardWallet = createWalletClient({
      account,
      chain,
      transport: http(env.ethRPCUrl),
    });
    if (!relayEndpoint) {
      debug("Relay endpoint is required");
      return;
    }
    if (!shopId) {
      debug("Shop ID is required");
      return;
    }
    debug(`Setting RelayClient with keycard: ${account.address}`);
    const rc = new RelayClient({
      relayEndpoint,
      walletClient: keycardWallet,
      keycard: account,
      shopId,
    });

    setRelayClient(rc);
  }, [
    keycard !== undefined,
    String(shopId),
    relayEndpoint,
    keycard.privateKey,
  ]);

  return { relayClient };
}

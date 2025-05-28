import { getLogger } from "@logtape/logtape";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { useEffect } from "react";
import { assert } from "@std/assert";
import { RelayClient } from "@massmarket/client";
import {
  useMassMarketContext,
  useRelayEndpoint,
  useShopId,
} from "@massmarket/react-hooks";
import { useKeycard } from "./useKeycard.ts";
import { useChain } from "./useChain.ts";
import { env } from "../utils/mod.ts";
import { isTesting } from "../utils/env.ts";

const logger = getLogger(["mass-market", "frontend", "useRelayClient"]);

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
      logger.debug`RelayClient already set ${getKeyCardAddress()}`;
      return;
    }
    const account = privateKeyToAccount(keycard.privateKey);
    const keycardWallet = createWalletClient({
      account,
      chain,
      transport: http(env.ethRPCUrl),
    });
    if (!relayEndpoint) {
      logger.debug("Relay endpoint is required");
      return;
    }
    if (!shopId) {
      logger.debug("Shop ID is required");
      return;
    }
    logger.debug`Setting RelayClient with keycard: ${account.address}`;
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

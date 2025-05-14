import { useRef } from "react";

import { useWalletClient } from "wagmi";
import { privateKeyToAccount } from "viem/accounts";
import { useEffect } from "react";
import { assert } from "@std/assert";

import { RelayClient } from "@massmarket/client";
import { logger } from "@massmarket/utils";

import { useMassMarketContext } from "../MassMarketContext.ts";
import { useKeycard } from "./useKeycard.ts";
import { useRelayEndpoint } from "./useRelayEndpoint.ts";
import { useShopId } from "./useShopId.ts";

const namespace = "frontend:useRelayClient";
const debug = logger(namespace);

export function useRelayClient() {
  const { relayClient, setRelayClient } = useMassMarketContext();
  const { keycard } = useKeycard();
  const { relayEndpoint } = useRelayEndpoint();
  const { shopId } = useShopId();
  const { data: wallet } = useWalletClient();
  const connected = useRef(false);

  const getKeyCardAddress = () => {
    assert(relayClient, "relayClient is undefined");
    return typeof relayClient?.keycard == "string"
      ? relayClient.keycard
      : relayClient.keycard.address;
  };


  useEffect(() => {
    if (!relayEndpoint || !keycard || !shopId || !wallet || connected.current) return;
    if (
      relayClient && ( getKeyCardAddress() === keycard.address) &&
      relayClient.shopId === shopId
    ) {
      debug(`RelayClient already set ${getKeyCardAddress()}`);
      return;
    }
    console.log({relayClient})
    connected.current = true
    const account = privateKeyToAccount(keycard.privateKey);

    debug(`Setting RelayClient with keycard: ${account.address}`);
    const rc = new RelayClient({
      relayEndpoint,
      walletClient: wallet,
      keycard: account,
      shopId,
    });
    setRelayClient(rc);

    rc.connect().then(() => {
      rc.authenticate().then(() => {
      });
    });
  }, [
    keycard,
    shopId,
    relayEndpoint,
    wallet,
  ]);



  return { relayClient };
}

import { useContext, useEffect } from "react";
import { usePublicClient } from "wagmi";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

import { logger, random32BytesHex } from "@massmarket/utils";

import { MassMarketContext } from "../MassMarketContext.tsx";
import { useShopId } from "./useShopId.ts";
import { useQuery } from "./useQuery.ts";
import { useKeycard } from "./useKeycard.ts";
import { useRelayEndpoint } from "./useRelayEndpoint.ts";
import { useChain } from "./useChain.ts";
import { ClientWithStateManager } from "../ClientWithStateManager.ts";
import { defaultRPC } from "../utils/mod.ts";

const namespace = "frontend:useClientWithStateManager";
const debug = logger(namespace);

export function useClientWithStateManager(skipConnect: boolean = false) {
  const { clientStateManager, setClientStateManager } = useContext(
    MassMarketContext,
  );
  const [keycard, setKeycard] = useKeycard();
  const { relayEndpoint } = useRelayEndpoint();
  const { shopId } = useShopId();
  const { chain } = useChain();
  const shopPublicClient = usePublicClient({ chainId: chain.id });

  useEffect(() => {
    if (
      shopId &&
      relayEndpoint &&
      shopPublicClient &&
      // This check is so that we don't reset the clientStateManager everytime this hook is called.
      (clientStateManager?.shopId !== shopId ||
        // If a new keycard is set, i.e. when there is a duplicate keycard error, also reset the clientStateManager
        clientStateManager?.keycard !== keycard.privateKey)
    ) {
      debug("Setting ClientWithStateManager");
      const csm = new ClientWithStateManager(
        keycard.privateKey,
        shopPublicClient,
        shopId,
        relayEndpoint,
      );
      setClientStateManager(csm);
    }
  }, [shopId, relayEndpoint, shopPublicClient, keycard.privateKey]);

  const { result } = useQuery(async () => {
    if (
      !clientStateManager
    ) return;
    await clientStateManager.createNewRelayClient();
    // skipConnect will be true if we are on a merchant page. We don't want to try connecting and authenticating before enrolling the keycard.
    if (skipConnect) return;
    if (keycard?.role === "merchant") {
      await clientStateManager.connectAndAuthenticate();
      await clientStateManager.sendMerchantSubscriptionRequest();
      debug("Success: Connected with merchant keycard");
    } else if (keycard?.role === "guest-returning") {
      await clientStateManager.connectAndAuthenticate();
      await clientStateManager.sendGuestCheckoutSubscriptionRequest();
      debug("Success: Connected with guest keycard");
    } else if (keycard?.role === "guest-new") {
      const guestWallet = createWalletClient({
        account: privateKeyToAccount(random32BytesHex()),
        chain,
        transport: http(
          defaultRPC,
        ),
      });
      const res = await clientStateManager.relayClient.enrollKeycard(
        guestWallet,
        true,
        clientStateManager.shopId,
        new URL(globalThis.location.href),
      );
      if (res.status === 409) {
        debug("Duplicate keycard. Setting new keycard and trying again.");
        setKeycard({ privateKey: random32BytesHex(), role: "guest-new" });
        return;
      }
      if (!res.ok) {
        throw new Error(`Failed to enroll keycard: ${res.error}`);
      }
      debug("Success: Enrolled new guest keycard");
      await clientStateManager.connectAndAuthenticate();
      await clientStateManager.sendGuestCheckoutSubscriptionRequest();
      //Set keycard role to guest-returning so we don't try enrolling again on refresh
      setKeycard({ ...keycard, role: "guest-returning" });
      debug("Success: sendGuestCheckoutSubscriptionRequest");
    }
    return { clientConnected: true };
  }, [
    clientStateManager?.keycard,
    String(clientStateManager?.shopId),
  ]);

  return { clientStateManager, result };
}

import { useContext, useEffect } from "react";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

import { logger, random32BytesHex } from "@massmarket/utils";

import { MassMarketContext } from "../MassMarketContext.tsx";
import { usePublicClient } from "./usePublicClient.ts";
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
  const { shopPublicClient } = usePublicClient();
  const { chain } = useChain();

  useEffect(() => {
    if (
      shopId &&
      relayEndpoint &&
      shopPublicClient &&
      clientStateManager?.shopId !== shopId
    ) {
      const csm = new ClientWithStateManager(
        keycard.privateKey,
        shopPublicClient,
        shopId,
        relayEndpoint,
      );
      setClientStateManager(csm);
    }
  }, [shopId, relayEndpoint, shopPublicClient]);
  const { result } = useQuery(async () => {
    if (
      !clientStateManager 
    ) return;
    await clientStateManager.createNewRelayClient();

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
    } else if (keycard?.role === "guest-returning") {
      await clientStateManager.connectAndAuthenticate();
      await clientStateManager.sendGuestCheckoutSubscriptionRequest();
    } else if (keycard?.role === "guest-new" ) {
      debug("Success: Enrolling new guest keycard");
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
        shopId!,
        new URL(globalThis.location.href),
      );
      if (!res.ok) {
        throw new Error(`Failed to enroll keycard: ${res.error}`);
      }
      debug("Success: Enrolled new guest keycard");
      await clientStateManager.connectAndAuthenticate();
      //Set keycard role to guest-returning so we don't try enrolling again on refresh
      await clientStateManager.sendGuestCheckoutSubscriptionRequest();
      setKeycard({ ...keycard, role: "guest-returning" });

      debug("Success: sendGuestCheckoutSubscriptionRequest");
    }
    return { clientConnected: true };
  }, [
    clientStateManager?.keycard,
    String(clientStateManager?.shopId),
    skipConnect,
  ]);

  return { clientStateManager, result };
}

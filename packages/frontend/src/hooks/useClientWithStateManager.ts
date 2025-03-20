import { useEffect } from "react";
import { usePublicClient } from "wagmi";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

import { logger, random32BytesHex } from "@massmarket/utils";

import { useMassMarketContext } from "../MassMarketContext.ts";
import { useShopId } from "./useShopId.ts";
import { useQuery } from "./useQuery.ts";
import { useKeycard } from "./useKeycard.ts";
import { useRelayEndpoint } from "./useRelayEndpoint.ts";
import { useChain } from "./useChain.ts";
import { usePathname } from "./usePathname.ts";
import { ClientStateManager } from "../ClientWithStateManager.ts";
import { defaultRPC } from "../utils/mod.ts";

const namespace = "frontend:useClientWithStateManager";
const debug = logger(namespace);

export function useClientWithStateManager() {
  const { clientStateManager, setClientStateManager } = useMassMarketContext();
  const [keycard, setKeycard] = useKeycard();
  const { relayEndpoint } = useRelayEndpoint();
  const { shopId } = useShopId();
  const { chain } = useChain();
  const shopPublicClient = usePublicClient({ chainId: chain.id });
  const { isMerchantPath } = usePathname();
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
      const csm = new ClientStateManager(
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
    clientStateManager.createNewRelayClient();
    // If current screen is /create-shop or /merchant-connect page, we don't want to try connecting and authenticating before enrolling the keycard.
    if (isMerchantPath) return;
    if (keycard?.role === "guest-new") {
      const account = privateKeyToAccount(random32BytesHex());
      const guestWallet = createWalletClient({
        account,
        chain,
        transport: http(
          defaultRPC,
        ),
      });
      const res = await clientStateManager.enrollKeycard(
        guestWallet,
        account,
        true,
      );
      if (res.status === 409) {
        debug("Duplicate keycard. Setting new keycard and trying again.");
        setKeycard({ privateKey: random32BytesHex(), role: "guest-new" });
        return;
      }
      if (!res.ok) {
        throw new Error(`Failed to enroll keycard: ${res}`);
      }
      debug("Success: Enrolled new guest keycard");

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

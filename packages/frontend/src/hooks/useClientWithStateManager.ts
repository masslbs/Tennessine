import { useEffect } from "react";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

import { logger } from "@massmarket/utils";

import { useMassMarketContext } from "../MassMarketContext.ts";
import { useShopId } from "./useShopId.ts";
import { useQuery } from "./useQuery.ts";
import { useKeycard } from "./useKeycard.ts";
import { useRelayEndpoint } from "./useRelayEndpoint.ts";
import { useChain } from "./useChain.ts";
import { usePathname } from "./usePathname.ts";
import { ClientWithStateManager } from "../ClientWithStateManager.ts";
import { defaultRPC } from "../utils/mod.ts";
import { KeycardRole } from "../types.ts";

const namespace = "frontend:useClientWithStateManager";
const debug = logger(namespace);

export function useClientWithStateManager() {
  const { clientStateManager, setClientStateManager } = useMassMarketContext();
  const [keycard, setKeycard] = useKeycard();
  const { relayEndpoint } = useRelayEndpoint();
  const { shopId } = useShopId();
  const { chain } = useChain();
  const { isMerchantPath } = usePathname();

  const account = privateKeyToAccount(keycard.privateKey);
  const keycardWallet = createWalletClient({
    account,
    chain,
    transport: http(
      defaultRPC,
    ),
  });

  useEffect(() => {
    if (!shopId || !keycard.privateKey || !relayEndpoint) return;
    const csm = new ClientWithStateManager(
      relayEndpoint,
      keycardWallet,
      account,
      shopId,
    );
    setClientStateManager(csm);
  }, [shopId, keycard.privateKey, relayEndpoint]);

  useQuery(async () => {
    if (
      !clientStateManager ||
      clientStateManager?.relayClient?.connection?.readyState ||
      isMerchantPath
    ) return;
    if (keycard?.role === KeycardRole.NEW_GUEST) {
      debug("Enrolling guest keycard");
      const res = await clientStateManager.relayClient.enrollKeycard(
        keycardWallet,
        account,
        true,
      );
      if (!res.ok) {
        throw new Error(`Failed to enroll keycard: ${res}`);
      }
      debug("Success: Enrolled new guest keycard");
      await clientStateManager.addConnection();
      //Set keycard role to guest-returning so we don't try enrolling again on refresh
      setKeycard({ ...keycard, role: KeycardRole.RETURNING_GUEST });
    } else {
      debug("Adding connection");
      await clientStateManager.addConnection();
    }
  }, [
    String(shopId),
    relayEndpoint,
    keycard.privateKey,
    String(clientStateManager),
  ]);
  return { clientStateManager };
}

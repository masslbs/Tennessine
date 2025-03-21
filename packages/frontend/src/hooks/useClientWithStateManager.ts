import { useWalletClient } from "wagmi";
import { createWalletClient, http, toHex } from "viem";
import { privateKeyToAccount } from "viem/accounts";

import { logger, random32BytesHex } from "@massmarket/utils";

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
  const { data: wallet } = useWalletClient();

  const account = privateKeyToAccount(random32BytesHex());
  const usedWallet = keycard.role === KeycardRole.NEW_GUEST
    ? createWalletClient({
      account,
      chain,
      transport: http(
        defaultRPC,
      ),
    })
    : wallet;
  const hexId = shopId ? toHex(shopId) : null;

  const { result } = useQuery(async () => {
    if (!shopId || !usedWallet) return;

    if (keycard?.role === KeycardRole.NEW_GUEST) {
      const csm = new ClientWithStateManager(
        relayEndpoint,
        usedWallet,
        account.address,
        shopId,
      );
      const res = await csm.relayClient.enrollKeycard(
        usedWallet,
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
      await csm.connect();
      setClientStateManager(csm);
      //Set keycard role to guest-returning so we don't try enrolling again on refresh
      setKeycard({ ...keycard, role: KeycardRole.RETURNING_GUEST });
    } else {
      const csm = new ClientWithStateManager(
        relayEndpoint,
        usedWallet,
        usedWallet.account.address,
        shopId,
      );
      //If /create-shop or /merchant-connect, we don't want to connect to the client before we enroll keycard.
      if (!isMerchantPath) {
        await csm.connect();
      }
      setClientStateManager(csm);
    }
    return { clientConnected: true };
  }, [
    hexId,
    relayEndpoint,
    keycard.privateKey,
    usedWallet,
  ]);

  return { clientStateManager, result };
}

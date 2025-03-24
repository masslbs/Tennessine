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

  const account = privateKeyToAccount(keycard.privateKey);
  const keycardWallet = createWalletClient({
    account,
    chain,
    transport: http(
      defaultRPC,
    ),
  });

  const hexId = shopId ? toHex(shopId) : null;

  const { result } = useQuery(async () => {
    if (!shopId || !keycardWallet || !relayEndpoint) return;

    const csm = new ClientWithStateManager(
      relayEndpoint,
      keycardWallet,
      account,
      shopId,
    );
    setClientStateManager(csm);

    if (keycard?.role === KeycardRole.NEW_GUEST) {
      const res = await csm.relayClient.enrollKeycard(
        keycardWallet,
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
      //Set keycard role to guest-returning so we don't try enrolling again on refresh
      setKeycard({ ...keycard, role: KeycardRole.RETURNING_GUEST });
    } else {
      await csm.connect();
    }
    return { clientConnected: true };
  }, [
    hexId,
    relayEndpoint,
    keycard.privateKey,
  ]);

  return { clientStateManager, result };
}

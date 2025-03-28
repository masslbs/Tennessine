import { privateKeyToAccount } from "viem/accounts";
import { createWalletClient, http } from "viem";

import { logger } from "@massmarket/utils";
import { LevelStore } from "@massmarket/store/level";
import StateManager from "@massmarket/stateManager";

import { KeycardRole } from "../types.ts";
import { defaultRPC } from "../utils/env.ts";
import { useMassMarketContext } from "../MassMarketContext.ts";
import { useShopId } from "./useShopId.ts";
import { useQuery } from "./useQuery.ts";
import { useKeycard } from "./useKeycard.ts";
import { useRelayClient } from "./useRelayClient.ts";
import { usePathname } from "./usePathname.ts";
import { useChain } from "./useChain.ts";

const namespace = "frontend:useStateManager";
const debug = logger(namespace);

export function useStateManager() {
  const { stateManager, setStateManager } = useMassMarketContext();
  const { relayClient } = useRelayClient();
  const { shopId } = useShopId();
  const [keycard, setKeycard] = useKeycard();
  const { chain } = useChain();
  const { isMerchantPath } = usePathname();

  useQuery(async () => {
    debug("Creating state manager");
    const root = new Map(Object.entries({
      Tags: new Map(),
      Orders: new Map(),
      Accounts: new Map(),
      Inventory: new Map(),
      Listings: new Map(),
      Manifest: new Map(),
      SchemeVersion: 1,
    }));

    const db = new StateManager({
      store: new LevelStore(),
      objectId: shopId,
      root,
    });

    await db.open();

    // Skip this logic if /create-shop or /merchant-connect, since we need to enroll merchant keycard before we call addConnection in those cases.
    if (!isMerchantPath && relayClient) {
      if (keycard?.role === KeycardRole.NEW_GUEST) {
        debug("Enrolling guest keycard");
        const account = privateKeyToAccount(keycard.privateKey);
        const keycardWallet = createWalletClient({
          account,
          chain,
          transport: http(
            defaultRPC,
          ),
        });
        const res = await relayClient.enrollKeycard(
          keycardWallet,
          account,
          true,
        );
        if (!res.ok) {
          throw new Error(`Failed to enroll keycard: ${res}`);
        }
        debug("Success: Enrolled new guest keycard");
        await db.addConnection();
        //Set keycard role to guest-returning so we don't try enrolling again on refresh
        setKeycard({ ...keycard, role: KeycardRole.RETURNING_GUEST });
      } else {
        debug("Adding connection");
        await db.addConnection(relayClient);
      }
    }
    setStateManager(db);

    if (window) {
      globalThis.addEventListener("beforeunload", () => {
        db.close().then(() => {
          debug(`DB closed. Keycard nonce: ${relayClient?.keyCardNonce}`);
        });
      });
    }
    // Since we are calling addConnection in this query with the relayClient, if the relayClient changes, we need to re-run this query
  }, [String(shopId), relayClient?.keycard?.address]);

  return { stateManager };
}

import { privateKeyToAccount } from "viem/accounts";
import { createWalletClient, type Hex, http } from "viem";
import { BrowserLevel } from "browser-level";

import { getLogger } from "@logtape/logtape";
import { getWindowLocation } from "@massmarket/utils";
import { LevelStore } from "@massmarket/store/level";
import StateManager from "@massmarket/stateManager";
import { useRouter } from "@tanstack/react-router";
import { useMassMarketContext, useShopId } from "@massmarket/react-hooks";

import { KeycardRole } from "../types.ts";
import { useQuery } from "./useQuery.ts";
import { useKeycard } from "./useKeycard.ts";
import { useRelayClient } from "./useRelayClient.ts";
import { useChain } from "./useChain.ts";

const logger = getLogger(["mass-market", "frontend", "useStateManager"]);

function usePathname() {
  const router = useRouter();
  const isMerchantPath = ["/create-shop", "/merchant-connect"].includes(
    router?.state?.location?.pathname,
  );
  return { pathname: router?.state?.location?.pathname, isMerchantPath };
}

async function createStateManager(shopId: bigint, pk: Hex) {
  logger.debug`Creating state manager`;
  const startingState = new Map(Object.entries({
    Tags: new Map(),
    Orders: new Map(),
    Accounts: new Map(),
    Inventory: new Map(),
    Listings: new Map(),
    Manifest: new Map(),
    SchemeVersion: 1,
  }));
  const dbName = `${pk}-${shopId}`;
  const db = new StateManager({
    store: new LevelStore(
      new BrowserLevel(dbName, {
        valueEncoding: "view",
        keyEncoding: "view",
      }),
    ),
    id: shopId,
    defaultState: startingState,
  });
  await db.open();

  return db;
}

export function useStateManager() {
  const { stateManager, setStateManager } = useMassMarketContext();
  const { relayClient } = useRelayClient();
  const { shopId } = useShopId();
  const [keycard, setKeycard] = useKeycard();
  const { chain } = useChain();
  const { isMerchantPath } = usePathname();

  // Since we are calling addConnection in this query with the relayClient, if the relayClient changes, we need to re-run this query
  const accountDep = typeof relayClient?.keycard === "string"
    ? relayClient.keycard
    : relayClient?.keycard?.address;
  const deps = [String(shopId), accountDep];

  useQuery(async () => {
    if (!shopId) {
      throw new Error("Shop ID is required");
    }
    const db = stateManager ??
      await createStateManager(shopId, keycard.privateKey);

    // Skip this logic if /create-shop or /merchant-connect, since we need to enroll merchant keycard before we call addConnection in those cases.
    if (!isMerchantPath && relayClient) {
      if (keycard?.role === KeycardRole.NEW_GUEST) {
        logger.debug`Enrolling guest keycard`;
        const account = privateKeyToAccount(keycard.privateKey);
        const keycardWallet = createWalletClient({
          account,
          chain,
          transport: http(),
        });
        const res = await relayClient.enrollKeycard(
          keycardWallet,
          account,
          true,
          getWindowLocation(),
        );
        if (!res.ok) {
          throw new Error(`Failed to enroll keycard: ${res}`);
        }
        logger.debug`Success: Enrolled new guest keycard`;

        //Set keycard role to guest-returning so we don't try enrolling again on refresh
        setKeycard({ ...keycard, role: KeycardRole.RETURNING_GUEST });
      }
      logger.debug`Adding connection`;
      await relayClient.connect();
      await relayClient.authenticate();
      db.addConnection(relayClient);
    }
    logger.debug`StateManager set`;
    setStateManager(db);

    if (window && relayClient) {
      globalThis.addEventListener("beforeunload", () => {
        db.close().then(() => {
          logger
            .debug`DB closed. Keycard nonce saved: ${relayClient.keyCardNonce}`;
        });
      });
    }
  }, deps);

  return { stateManager };
}

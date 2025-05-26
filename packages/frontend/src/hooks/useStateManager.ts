import { type Hex } from "viem";
import { BrowserLevel } from "browser-level";

import { getLogger } from "@logtape/logtape";
import { LevelStore } from "@massmarket/store/level";
import StateManager from "@massmarket/stateManager";
import { useRouter } from "@tanstack/react-router";

import { useMassMarketContext } from "../MassMarketContext.ts";
import { useShopId } from "./useShopId.ts";
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
  const { data: keycard } = useKeycard();
  const { isMerchantPath } = usePathname();

  // Since we are calling addConnection in this query with the relayClient, if the relayClient changes, we need to re-run this query
  const accountDep = typeof relayClient?.keycard === "string"
    ? relayClient.keycard
    : relayClient?.keycard?.address;
  const deps = [String(shopId), accountDep];

  useQuery(async () => {
    assert(keycard);
    if (!shopId) {
      throw new Error("Shop ID is required");
    }
    const db = stateManager ??
      await createStateManager(shopId, keycard.privateKey);

    // Skip this logic if /create-shop or /merchant-connect, since we need to enroll merchant keycard before we call addConnection in those cases.
    if (!isMerchantPath && relayClient) {
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

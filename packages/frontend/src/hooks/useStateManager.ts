import { useWalletClient } from "wagmi";
import { type Hex } from "viem";
import { BrowserLevel } from "browser-level";

import { getWindowLocation, logger } from "@massmarket/utils";
import { LevelStore } from "@massmarket/store/level";
import StateManager from "@massmarket/stateManager";

import { KeycardRole } from "../types.ts";
import { env } from "../utils/env.ts";
import { useMassMarketContext } from "../MassMarketContext.ts";
import { useShopId } from "./useShopId.ts";
import { useQuery } from "./useQuery.ts";
import { useKeycard } from "./useKeycard.ts";
import { useRelayClient } from "./useRelayClient.ts";
import { usePathname } from "./usePathname.ts";
import { useChain } from "./useChain.ts";
import { useEffect } from "react";
import { useRelayEndpoint } from "./useRelayEndpoint.ts";
const namespace = "frontend:useStateManager";
const debug = logger(namespace);

async function createStateManager(shopId: bigint, pk: Hex) {
  debug("Creating state manager");
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
  const { keycard, addKeycard } = useKeycard();
  const { relayEndpoint } = useRelayEndpoint();
  const { data: wallet } = useWalletClient();

  useEffect(() => {
    if (!relayEndpoint || !shopId || !wallet) return;
    if (!keycard) {
      debug("Enrolling guest keycard");
      addKeycard("guest").then();
    }

    // if (window && relayClient) {
    //   globalThis.addEventListener("beforeunload", () => {
    //     db.close().then(() => {
    //       debug(`DB closed. Keycard nonce saved: ${relayClient.keyCardNonce}`);
    //     });
    //   });
    // }
  }, [keycard, relayEndpoint, shopId, wallet]);

  // useEffect(() => {
  //   if (!shopId || !keycard || !relayClient) {
  //     return;
  //   }

  //   // If stateManager is already set with the shopId, we don't need to addConnection again.
  //   if (stateManager?.id !== shopId) return;
  //   createStateManager(shopId, keycard.privateKey).then((db) => {
  //     db.addConnection(relayClient);
  //     setStateManager(db);
  //     debug("StateManager set");
  //   });
  // }, [relayClient, keycard, shopId]);

  return { stateManager };
}

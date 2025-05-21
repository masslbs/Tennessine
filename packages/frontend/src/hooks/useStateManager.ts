import { privateKeyToAccount } from "viem/accounts";
import { createWalletClient, type Hex, http } from "viem";
import { BrowserLevel } from "browser-level";
import { useQuery } from "@tanstack/react-query";

import { getLogger } from "@logtape/logtape";
import { getWindowLocation } from "@massmarket/utils";
import { LevelStore } from "@massmarket/store/level";
import StateManager from "@massmarket/stateManager";
import { MemStore } from "@massmarket/store";

import { KeycardRole } from "../types.ts";
import { env } from "../utils/env.ts";
import { useMassMarketContext } from "../MassMarketContext.ts";
import { useShopId } from "./useShopId.ts";
import { useKeycard } from "./useKeycard.ts";
import { useRelayClient } from "./useRelayClient.ts";
import { usePathname } from "./usePathname.ts";
import { useChain } from "./useChain.ts";
import { useEffect } from "react";
import { StatementSync } from "node:sqlite";

const logger = getLogger(["mass-market", "frontend", "useStateManager"]);

async function createStateManager(shopId: bigint, pk: Hex) {
  logger.debug`Creating state manager`;
  console.log("CREATING STATE MANAGER", shopId, pk)
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
    // store: new LevelStore(
    //   new BrowserLevel(dbName, {
    //     valueEncoding: "view",
    //     keyEncoding: "view",
    //   }),
    // ),
    store: new MemStore(),
    id: shopId,
    defaultState: startingState,
  });
  await db.open();
  console.log("STATE MANAGER OPENED", db)
  return db;
}

export function useStateManager() {
  const { stateManager, setStateManager } = useMassMarketContext();
  const { relayClient } = useRelayClient();
  const { data: keycard } = useKeycard();
  useQuery({
    queryKey: ["stateManager", String(relayClient?.shopId), keycard?.privateKey],
    queryFn: async () => {
      console.log("queryFn", relayClient.shopId, keycard)
      const db = await createStateManager(relayClient!.shopId, keycard!.privateKey);
      console.log("DB CREATED", db)
      db.addConnection(relayClient!);
      console.log("CONNECTION ADDED")
      logger.debug`Connection added.`;
      setStateManager(db);
      return db;
    },
    enabled: !!relayClient && !!keycard,
    refetchOnWindowFocus: "always",
  });

  //need to add db.close() to the beforeunload event

  return { stateManager };
}

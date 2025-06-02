import { skipToken, useQuery } from "@tanstack/react-query";
import { BrowserLevel } from "browser-level";
import type { AbstractLevel } from "abstract-level";

import StateManager from "@massmarket/stateManager";
import { LevelStore } from "@massmarket/store/level";

import { useRelayClient } from "./useRelayClient.ts";
import { useShopId } from "./useShopId.ts";
import { useKeycard } from "./useKeycard.ts";

/**
 * This hook instantiates the StateManager and adds relay connection.
 * The query will run once for every app session.
 * Subscription to the relay is requested with the subscription sequence number, to only receive events beginning with the event the state has not already been updated with.
 * db.close() is called on beforeunload to save the keycard nonce for any writes.
 */

export function useStateManager(params?: {
  db?: Pick<
    AbstractLevel<Uint8Array, Uint8Array, Uint8Array>,
    "get" | "put"
  >;
}) {
  const { data: relayClient } = useRelayClient();
  const { shopId } = useShopId();
  const { data: keycard } = useKeycard();

  const enabled = !!relayClient && !!keycard && !!shopId;

  return useQuery({
    queryKey: ["stateManager", String(shopId), keycard?.privateKey],
    queryFn: enabled
      ? async () => {
        const defaultState = new Map(Object.entries({
          Tags: new Map(),
          Orders: new Map(),
          Accounts: new Map(),
          Inventory: new Map(),
          Listings: new Map(),
          Manifest: new Map(),
          SchemeVersion: 1,
        }));
        const dbName = `${keycard.privateKey}-${shopId}`;
        const db = new StateManager({
          store: new LevelStore(
            params?.db ?? new BrowserLevel(dbName, {
              valueEncoding: "view",
              keyEncoding: "view",
            }),
          ),
          id: shopId,
          defaultState,
        });
        await db.open();
        db.addConnection(relayClient);
        return db;
      }
      : skipToken,
  });
}

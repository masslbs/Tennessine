import { skipToken, useQuery } from "@tanstack/react-query";
import { getLogger } from "@logtape/logtape";

import StateManager from "@massmarket/stateManager";
import { type AbstractStore, BrowserLevelStore } from "@massmarket/store";
import { defaultState } from "@massmarket/schema";

import { useRelayClient } from "./useRelayClient.ts";
import { useShopId } from "./useShopId.ts";
import { useKeycard } from "./useKeycard.ts";

const logger = getLogger(["mass-market", "frontend", "useStateManager"]);

/**
 * This hook instantiates the StateManager and adds relay connection.
 * The query will run once for every app session.
 * Subscription to the relay is requested with the subscription sequence number, to only receive events beginning with the event the state has not already been updated with.
 * db.close() is called on beforeunload to save the keycard nonce for any writes.
 */

export function useStateManager(params?: {
  db?: AbstractStore;
}) {
  const { data: relayClient } = useRelayClient();
  const { shopId } = useShopId();
  const { data: keycard } = useKeycard();

  const enabled = !!relayClient && !!keycard && !!shopId;

  return useQuery({
    queryKey: ["stateManager", String(shopId), keycard?.address],
    queryFn: enabled
      ? async () => {
        const dbName = `${keycard.address}-${shopId}`;
        const db = new StateManager({
          store: params?.db ?? BrowserLevelStore(dbName),
          id: shopId,
          defaultState,
        });
        await db.open();
        db.addConnection(relayClient);

        globalThis.addEventListener("beforeunload", () => {
          db.close().then(() => {
            logger
              .debug`DB closed. Keycard nonce saved: ${relayClient.keyCardNonce}`;
          });
        });

        return db;
      }
      : skipToken,
  });
}

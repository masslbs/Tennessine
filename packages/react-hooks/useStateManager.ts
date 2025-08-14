import {
  skipToken,
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query";
import { getLogger } from "@logtape/logtape";
import { BrowserLevel } from "browser-level";

import StateManager from "@massmarket/stateManager";
import { LevelStore } from "@massmarket/store";
import { defaultState } from "@massmarket/schema";

import { useRelayClient } from "./useRelayClient.ts";
import { useShopId } from "./useShopId.ts";
import { useKeycard } from "./useKeycard.ts";
import { useMassMarketContext } from "./useMassMarketContext.ts";
import type { HookParams } from "./types.ts";

const logger = getLogger(["mass-market", "frontend", "useStateManager"]);

const BrowserLevelStore = (dbName: string) =>
  new LevelStore(
    new BrowserLevel(dbName, {
      valueEncoding: "view",
      keyEncoding: "view",
    }),
  );

export type UseStateManagerReturn = UseQueryResult<StateManager> & {
  relayClient: StateManager | undefined;
};

/**
 * This hook instantiates the StateManager and adds relay connection.
 * The query will run once for every app session.
 * Subscription to the relay is requested with the subscription sequence number, to only receive events beginning with the event the state has not already been updated with.
 * db.close() is called on beforeunload to save the keycard nonce for any writes.
 */
export function useStateManager(params?: HookParams) {
  const config = params?.config ?? useMassMarketContext().config;
  const { relayClient } = useRelayClient(params);
  const { shopId } = useShopId(params);
  const { keycard } = useKeycard(params);

  const enabled = !!relayClient && !!keycard && !!shopId;

  const query = useQuery({
    queryKey: ["stateManager", String(shopId), keycard?.address],
    queryFn: enabled
      ? async () => {
        const dbName = `${keycard.address}-${shopId}`;
        const db = new StateManager({
          store: config?.db ?? BrowserLevelStore(dbName),
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
    gcTime: Infinity,
    staleTime: Infinity,
    meta: { doNotPersist: true },
  });
  return { stateManager: query.data, ...query };
}

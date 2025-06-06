import { skipToken, useQuery } from "@tanstack/react-query";
import { getLogger } from "@logtape/logtape";
import { BrowserLevel } from "browser-level";

import StateManager from "@massmarket/stateManager";
import { type AbstractStore, LevelStore } from "@massmarket/store";
import { defaultState } from "@massmarket/schema";

import { useRelayClient } from "./useRelayClient.ts";
import { useShopId } from "./useShopId.ts";
import { useKeycard } from "./useKeycard.ts";
import { useMassMarketContext } from "./useMassMarketContext.ts";
import type { MassMarketConfig } from "./MassMarketContext.ts";

const logger = getLogger(["mass-market", "frontend", "useStateManager"]);

const BrowserLevelStore = (dbName: string) =>
  new LevelStore(
    new BrowserLevel(dbName, {
      valueEncoding: "view",
      keyEncoding: "view",
    }),
  );

/**
 * This hook instantiates the StateManager and adds relay connection.
 * The query will run once for every app session.
 * Subscription to the relay is requested with the subscription sequence number, to only receive events beginning with the event the state has not already been updated with.
 * db.close() is called on beforeunload to save the keycard nonce for any writes.
 */
export function useStateManager(params?: {
  db?: AbstractStore;
  config?: MassMarketConfig;
}) {
  const config = params?.config ?? useMassMarketContext().config;
  const { data: relayClient } = useRelayClient();
  const { shopId } = useShopId({ config });
  const { data: keycard } = useKeycard();

  const enabled = !!relayClient && !!keycard && !!shopId;

  const query = useQuery({
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
  return { stateManager: query.data, ...query };
}

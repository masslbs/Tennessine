import { privateKeyToAccount } from "viem/accounts";
import { createWalletClient, type Hex, http } from "viem";
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
    globalThis.stateManager = db;
    // Skip this logic if /create-shop or /merchant-connect, since we need to enroll merchant keycard before we call addConnection in those cases.
    if (!isMerchantPath && relayClient) {
      if (keycard?.role === KeycardRole.NEW_GUEST) {
        debug("Enrolling guest keycard");
        const account = privateKeyToAccount(keycard.privateKey);
        const keycardWallet = createWalletClient({
          account,
          chain,
          transport: http(
            env.ethRPCUrl,
          ),
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
        debug("Success: Enrolled new guest keycard");
        await relayClient.connect();
        await relayClient.authenticate();
        db.addConnection(relayClient);
        //Set keycard role to guest-returning so we don't try enrolling again on refresh
        setKeycard({ ...keycard, role: KeycardRole.RETURNING_GUEST });
      } else {
        debug("Adding connection");
        await relayClient.connect();
        await relayClient.authenticate();
        db.addConnection(relayClient);
      }
    }
    debug("StateManager set");
    setStateManager(db);

    if (window && relayClient) {
      globalThis.addEventListener("beforeunload", () => {
        db.close().then(() => {
          debug(`DB closed. Keycard nonce saved: ${relayClient.keyCardNonce}`);
        });
      });
    }
  }, deps);

  return { stateManager };
}

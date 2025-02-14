import { MemoryLevel } from "npm:memory-level";
import type { PublicClient } from "viem";
import { random256BigInt } from "@massmarket/utils";
import type {
  KeyCard,
  Listing,
  Order,
  OrdersByStatus,
  ShopManifest,
  Tag,
} from "./types.ts";
import { MockClient } from "./mockClient.ts";
import { StateManager } from "./mod.ts";

const mockPublicClient = {
  readContract: () => 0n,
} as unknown as PublicClient;

export async function setupTestManager() {
  const opts = {
    valueEncoding: "json",
  };
  const db = new MemoryLevel(opts);

  const listingStore = db.sublevel<string, Listing>("listingStore", opts);
  const tagStore = db.sublevel<string, Tag>("tagStore", opts);
  const shopManifestStore = db.sublevel<string, ShopManifest>(
    "shopManifestStore",
    opts,
  );
  const orderStore = db.sublevel<string, Order | OrdersByStatus>(
    "orderStore",
    opts,
  );
  const keycardStore = db.sublevel<string, KeyCard>("keycardStore", opts);
  const keycardNonceStore = db.sublevel<string, number>("keycardNonceStore", {
    valueEncoding: "json",
  });
  await db.clear();
  const client = new MockClient();
  const stateManager = new StateManager(
    client,
    listingStore,
    tagStore,
    shopManifestStore,
    orderStore,
    keycardStore,
    keycardNonceStore,
    random256BigInt(),
    mockPublicClient,
  );

  return {
    client,
    stateManager,
    close: async () => {
      await db.close();
      await listingStore.close();
      await tagStore.close();
      await shopManifestStore.close();
      await orderStore.close();
      await keycardStore.close();
      await keycardNonceStore.close();
    },
  };
}

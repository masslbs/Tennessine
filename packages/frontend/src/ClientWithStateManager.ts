import { privateKeyToAccount } from "viem/accounts";
import type { Account, PublicClient, WalletClient } from "viem";
import { BrowserLevel } from "npm:browser-level";
import { RelayClient, type RelayEndpoint } from "@massmarket/client";
import { Database } from "@massmarket/stateManager";
import { logger } from "@massmarket/utils";
import { ShopSchema } from "@massmarket/schema/cbor";

import { ShopId } from "./types.ts";

const namespace = "frontend:ClientWithStateManager";
const debug = logger(namespace);

export class ClientWithStateManager {
  public stateManager: Database | null = null;
  public relayClient: RelayClient | null = null;

  constructor(
    public keycard: `0x${string}`,
    public readonly publicClient: PublicClient,
    public readonly shopId: ShopId,
    public readonly relayEndpoint: RelayEndpoint,
  ) {}

  async createStateManager() {
    if (!this.relayClient) throw new Error("RelayClient not set");
    const dbName = `${String(this.shopId).slice(0, 5)}-${
      this.keycard.slice(0, 5)
    }`;
    debug(`using level db: ${dbName}`);
    const encOption = { valueEncoding: "json" };
    const store = new BrowserLevel(`./${dbName}`, encOption);

    this.stateManager = new Database(
      {
        store,
        schema: ShopSchema,
        objectId: this.shopId,
      },
    );

    await this.stateManager.addConnection(this.relayClient);

    if (window && store) {
      globalThis.addEventListener("beforeunload", () => {
        store.close().then(() => {
          debug("level db closed");
        });
      });
    }
    return this.stateManager;
  }

  createNewRelayClient() {
    if (this.relayClient) return;
    if (!this.relayEndpoint?.url) throw new Error("Relay endpoint URL not set");
    if (!this.relayEndpoint?.tokenId) {
      throw new Error("Relay endpoint tokenId not set");
    }
    this.relayClient = new RelayClient({
      relayEndpoint: this.relayEndpoint,
      walletClient: privateKeyToAccount(this.keycard),
      keyCard: this.keycard,
      shopId: this.shopId,
    });
    debug("RelayClient created");
    return this.relayClient;
  }

  enrollKeycard(
    wallet: WalletClient,
    account: Account,
    isGuest: Boolean = true,
  ) {
    if (!this.relayClient) throw new Error("RelayClient not set");
    return this.relayClient.enrollKeycard(
      wallet,
      account,
      isGuest,
    );
  }
}

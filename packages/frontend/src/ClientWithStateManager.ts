import type { Account, WalletClient } from "viem";

import Database from "@massmarket/stateManager";
import { type IRelayEndpoint, RelayClient } from "@massmarket/client";
import { LevelStore } from "@massmarket/store/level";

export class ClientWithStateManager {
  #stateManager?: Database;
  #relayClient?: RelayClient;

  constructor(
    private readonly relayEndpoint: IRelayEndpoint,
    private readonly walletClient: WalletClient,
    private readonly account: Account,
    public readonly shopId: bigint,
  ) {}

  async open() {
    const root = new Map(Object.entries({
      Tags: new Map(),
      Orders: new Map(),
      Accounts: new Map(),
      Inventory: new Map(),
      Listings: new Map(),
      Manifest: new Map(),
      SchemeVersion: 1,
    }));
    this.#stateManager = new Database({
      store: new LevelStore(),
      objectId: this.shopId,
      root,
    });

    await this.#stateManager.open();

    this.#relayClient = new RelayClient({
      relayEndpoint: this.relayEndpoint,
      walletClient: this.walletClient,
      keycard: this.account,
      shopId: this.shopId,
    });
  }

  get stateManager() {
    if (!this.#stateManager) {
      throw new Error("state manager not open");
    }
    return this.#stateManager;
  }

  get relayClient() {
    if (!this.#relayClient) {
      throw new Error("relay client not open");
    }
    return this.#relayClient;
  }

  addConnection() {
    if (!this.#relayClient) {
      throw new Error("No relay client");
    }
    if (!this.#stateManager) {
      throw new Error("state manager not open");
    }

    return this.#stateManager.addConnection(this.#relayClient);
  }
}

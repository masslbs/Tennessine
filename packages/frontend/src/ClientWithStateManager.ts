import type { Account, WalletClient } from "viem";

import Database from "@massmarket/stateManager";
import { type IRelayEndpoint, RelayClient } from "@massmarket/client";
import { LevelStore } from "@massmarket/store/level";

export class ClientWithStateManager {
  public stateManager;
  public relayClient;

  constructor(
    public readonly relayEndpoint: IRelayEndpoint,
    walletClient: WalletClient,
    account: Account,
    shopId: bigint,
  ) {
    const store = new LevelStore();
    this.stateManager = new Database(
      {
        store,
        objectId: shopId,
      },
    );

    this.relayClient = new RelayClient({
      relayEndpoint: this.relayEndpoint,
      walletClient: walletClient,
      keycard: account,
      shopId: shopId,
    });
  }

  connect() {
    return this.stateManager.addConnection(this.relayClient);
  }
}

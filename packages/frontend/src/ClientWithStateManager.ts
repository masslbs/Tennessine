import { type WalletClient } from "viem";

import Database from "@massmarket/stateManager";
import { type IRelayEndpoint, RelayClient } from "@massmarket/client";
import { LevelStore } from "@massmarket/merkle-dag-builder/levelstore";

export class ClientStateManager {
  public stateManager;
  public relayClient;

  constructor(
    public readonly relayEndpoint: IRelayEndpoint,
    walletClient: WalletClient,
    account: `0x${string}`,
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

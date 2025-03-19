import { privateKeyToAccount } from "viem/accounts";
import { MemoryLevel } from "npm:memory-level";

import Database from "@massmarket/stateManager";
import { RelayClient, type RelayEndpoint } from "@massmarket/client";

export class MockClientStateManager {
  public stateManager: null = null;
  public relayClient: null = null;
  public keycard: `0x${string}` | null = null;
  public readonly relayEndpoint: RelayEndpoint

  constructor(
    public shopId: bigint | null,
  ) {}
  async createStateManager() {
    const store = new MemoryLevel({
        valueEncoding: "json",
      });

    this.stateManager = new Database(
        {
          store,
          objectId: this.shopId,
        },
      );
  
      await this.stateManager!.addConnection(this.relayClient);
      return this.stateManager;
  }

   createRelayClient() {
    this.relayClient = new RelayClient({
        relayEndpoint: this.relayEndpoint,
        walletClient: privateKeyToAccount(this.keycard!),
        keyCard: this.keycard,
        shopId: this.shopId,
      });
    return this.relayClient;
  }

}

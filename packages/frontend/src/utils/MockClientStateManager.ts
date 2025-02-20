import { StateManager } from "@massmarket/stateManager";
import { setupTestManager } from "@massmarket/stateManager/testUtils";
import { MockClient } from "@massmarket/stateManager/mockClient";

export class MockClientStateManager {
  public stateManager: StateManager | null = null;
  public relayClient: MockClient | null = null;

  constructor(
    public readonly shopId: string,
  ) {}
  async createStateManager() {
    const { client, stateManager } = await setupTestManager();

    this.relayClient = client;
    this.stateManager = stateManager;
  }
}

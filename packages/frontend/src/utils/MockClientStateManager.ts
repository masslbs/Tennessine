import { StateManager } from "@massmarket/stateManager";
import { setupTestManager } from "@massmarket/stateManager/testUtils";
import { MockClient } from "@massmarket/stateManager/mockClient";

export class MockClientStateManager {
  public stateManager: StateManager | null = null;
  public relayClient: MockClient | null = null;
  public keycard: string;
  constructor(
    public shopId: bigint,
  ) {
  }
  async createStateManager() {
    const { client, stateManager } = await setupTestManager();

    this.relayClient = client;
    this.stateManager = stateManager;
  }
  async connectAndAuthenticate() {
    return;
  }
  async sendMerchantSubscriptionRequest() {
    return;
  }
}

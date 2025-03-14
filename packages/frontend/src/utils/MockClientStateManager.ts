// import { StateManager } from "@massmarket/stateManager";
// import { setupTestManager } from "@massmarket/stateManager/testUtils";
// import { MockClient } from "@massmarket/stateManager/mockClient";

// export class MockClientStateManager {
//   public stateManager: StateManager | null = null;
//   public relayClient: MockClient | null = null;
//   public keycard: string | null = null;

//   constructor(
//     public shopId: bigint | null,
//   ) {}
//   async createStateManager() {
//     const { client, stateManager } = await setupTestManager();

//     this.relayClient = client;
//     this.stateManager = stateManager;
//   }
//   connectAndAuthenticate() {
//     return;
//   }
//   sendMerchantSubscriptionRequest() {
//     return;
//   }
// }

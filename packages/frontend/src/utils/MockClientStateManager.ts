export class MockClientStateManager {
  public stateManager: null = null;
  public relayClient: null = null;
  public keycard: string | null = null;

  constructor(
    public shopId: bigint | null,
  ) {}
  async createStateManager() {
    return;
  }
  connectAndAuthenticate() {
    return;
  }
  sendMerchantSubscriptionRequest() {
    return;
  }
}

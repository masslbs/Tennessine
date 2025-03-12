import { privateKeyToAccount } from "viem/accounts";
import type { PublicClient } from "viem";
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

  createStateManager() {
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
    const keyCardWallet = privateKeyToAccount(this.keycard);
    this.relayClient = new RelayClient({
      relayEndpoint: this.relayEndpoint,
      keyCardWallet,
    });
    debug("RelayClient created");
    return this.relayClient;
  }

  async connectAndAuthenticate() {
    if (!this.relayClient) throw new Error("RelayClient not set");

    const keyCardWallet = privateKeyToAccount(this.keycard);
    this.createStateManager();
    const eventNonceCounter = await this.stateManager!.keycardNonce.get(
      keyCardWallet.address,
    ) || 0;
    debug(`Setting nonce counter to: ${eventNonceCounter + 1}`);
    this.relayClient.nonce = eventNonceCounter + 1;
    await this.relayClient.connect();
    await this.relayClient.authenticate();
    debug("Success: Connected and authenticated Relay Client");
  }

  async sendMerchantSubscriptionRequest() {
    const seqNo = await this.stateManager!.manifest.getSeqNo();
    return this.relayClient!.sendMerchantSubscriptionRequest(
      this.shopId,
      seqNo,
    );
  }

  async sendGuestCheckoutSubscriptionRequest() {
    const seqNo = await this.stateManager!.manifest.getSeqNo();
    return this.relayClient!.sendGuestCheckoutSubscriptionRequest(
      this.shopId,
      seqNo,
    );
  }
}

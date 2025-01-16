import { privateKeyToAccount } from "viem/accounts";
import type { PublicClient } from "viem";
import { BrowserLevel } from "npm:browser-level";
import { RelayClient, type RelayEndpoint } from "@massmarket/client";
import { StateManager } from "@massmarket/stateManager";
import { logger } from "@massmarket/utils";

import { KeyCard, Listing, Order, ShopId, ShopManifest, Tag } from "./types.ts";

const namespace = "frontend:ClientWithStateManager";
const debug = logger(namespace);
const logerr = logger(namespace, "error");

export class ClientWithStateManager {
  public stateManager: StateManager | null = null;
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
    const db = new BrowserLevel(`./${dbName}`, encOption);
    // Set up all the stores via sublevel
    const listingStore = db.sublevel<string, Listing>(
      "listingStore",
      encOption,
    );
    const tagStore = db.sublevel<string, Tag>("tagStore", encOption);
    const shopManifestStore = db.sublevel<string, ShopManifest>(
      "shopManifestStore",
      encOption,
    );
    const orderStore = db.sublevel<string, Order>("orderStore", encOption);
    const keycardStore = db.sublevel<string, KeyCard>(
      "keycardStore",
      encOption,
    );
    const keycardNonceStore = db.sublevel<string, number>(
      "keycardNonceStore",
      encOption,
    );

    this.stateManager = new StateManager(
      this.relayClient!,
      listingStore,
      tagStore,
      shopManifestStore,
      orderStore,
      keycardStore,
      keycardNonceStore,
      this.shopId,
      this.publicClient,
    );

    // Only start the stream once relay address is added
    this.stateManager.eventStreamProcessing.catch((err: Error) => {
      logerr("Error something bad happened in the stream", err);
    });

    if (window && db) {
      globalThis.addEventListener("beforeunload", () => {
        db.close().then(() => {
          debug("level db closed");
        });
      });
    }

    return this.stateManager;
  }

  createNewRelayClient() {
    if (!this.relayEndpoint?.url) throw new Error("Relay endpoint URL not set");
    if (!this.relayEndpoint?.tokenId) {
      throw new Error("Relay endpoint tokenId not set");
    }
    const keyCardWallet = privateKeyToAccount(this.keycard);
    this.relayClient = new RelayClient({
      relayEndpoint: this.relayEndpoint,
      keyCardWallet,
    });
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

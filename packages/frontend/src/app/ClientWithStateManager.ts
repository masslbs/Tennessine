"use client";
import { PublicClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";

// conditional import to avoid problemsn during next pre-prendering
import type { Level } from "level";
let LevelDB: Promise<typeof Level> = Promise.reject(new Error("Level not available in node"));
if (typeof window !== "undefined") {
  LevelDB = import("level").then((m) => m.Level as typeof Level);
}

import { RelayClient, type RelayEndpoint } from "@massmarket/client";
import { StateManager } from "@massmarket/stateManager";
import { random32BytesHex, logger } from "@massmarket/utils";

import { Item, Order, KeyCard, ShopManifest, Tag, ShopId } from "@/types";

const namespace = "frontend:ClientWithStateManager";
const debug = logger(namespace);
const logerr = logger(namespace, "error");

export class ClientWithStateManager {
  readonly publicClient: PublicClient;
  readonly shopId: ShopId;
  public stateManager: StateManager | null;
  public relayClient: RelayClient | null;

  constructor(
    publicClient: PublicClient,
    shopId: ShopId,
    public relayEndpoint: RelayEndpoint,
  ) {
    this.stateManager = null;
    this.relayClient = null;
    this.publicClient = publicClient;
    this.shopId = shopId;
    this.relayEndpoint = relayEndpoint;
  }

  async createStateManager() {
    const merchantKC = localStorage.getItem("merchantKC");
    const dbName = `${this.shopId.slice(0, 7)}${merchantKC ? merchantKC.slice(0, 5) : "-guest"}`;
    debug(`using level db: ${dbName}`);
    const encOption = { valueEncoding: "json" };
    const ldb = await LevelDB;
    const db = new ldb(`./${dbName}`, encOption);
    // Set up all the stores via sublevel
    const listingStore = db.sublevel<string, Item>("listingStore", encOption);
    const tagStore = db.sublevel<string, Tag>("tagStore", encOption);
    const shopManifestStore = db.sublevel<string, ShopManifest>(
      "shopManifestStore",
      encOption,
    );
    const orderStore = db.sublevel<string, Order>("orderStore", encOption);
    const keycardStore = db.sublevel<string, KeyCard>("keycardStore", encOption);
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

    // Wait for relay address to be added to verified addresses before we return stateManager
    await this.stateManager.addRelaysToKeycards();

    // Only start the stream once relay address is added
    this.stateManager
      .eventStreamProcessing()
      .then(/* infinite loop*/)
      .catch((err: Error) => {
        logerr("Error something bad happened in the stream", err);
      });

    if (window && db) {
      window.addEventListener("beforeunload", () => {
        db.close().then(() => {
          debug("level db closed");
        });
      });
    }

    return this.stateManager;
  }

  createNewRelayClient() {
    if (!this.relayEndpoint?.url) throw new Error("Relay endpoint URL not set");
    if (!this.relayEndpoint?.tokenId)
      throw new Error("Relay endpoint tokenId not set");
    const keyCard = random32BytesHex();
    const keyCardWallet = privateKeyToAccount(keyCard);
    localStorage.setItem("keyCardToEnroll", keyCard);
    this.relayClient = new RelayClient({
      relayEndpoint: this.relayEndpoint,
      keyCardWallet,
    });
    return this.relayClient;
  }

  async setClientAndConnect(kc: `0x${string}`) {
    if (!this.relayEndpoint?.url) throw new Error("Relay endpoint URL not set");
    if (!this.relayEndpoint?.tokenId) {
      throw new Error("Relay endpoint tokenId not set");
    }
    const keyCardWallet = privateKeyToAccount(kc);
    this.relayClient = new RelayClient({
      relayEndpoint: this.relayEndpoint!,
      keyCardWallet,
    });
    await this.createStateManager();
    const eventNonceCounter = await this.stateManager!.keycardNonce.get(
      keyCardWallet.address,
    );
    debug(`Setting nonce counter to: ${eventNonceCounter + 1}`);
    this.relayClient.nonce = eventNonceCounter + 1;
    await this.relayClient.connect();
    await this.relayClient.authenticate();
    return this.relayClient;
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

  async sendGuestSubscriptionRequest() {
    this.createNewRelayClient();
    await this.createStateManager();
    await this.relayClient!.connect();
    const seqNo = await this.stateManager!.manifest.getSeqNo();
    return this.relayClient!.sendGuestSubscriptionRequest(this.shopId, seqNo);
  }
}

"use client";
import { PublicClient } from "npm:viem";
import { privateKeyToAccount } from "npm:viem/accounts";
import { BrowserLevel } from "npm:browser-level";
import { RelayClient, type RelayEndpoint } from "@massmarket/client";
import { StateManager } from "@massmarket/stateManager";
import { logger, random32BytesHex } from "@massmarket/utils";

import { KeyCard, Listing, Order, ShopId, ShopManifest, Tag } from "./types.ts";

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
    const dbName = `${String(this.shopId).slice(0, 7)}${
      merchantKC ? merchantKC.slice(0, 5) : "-guest"
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

    // Wait for relay address to be added to verified addresses before we return stateManager
    await this.stateManager.addRelaysToKeycards();

    // Only start the stream once relay address is added
    this.stateManager
      .eventStreamProcessing()
      .then()
      /* infinite loop*/
      .catch((err: Error) => {
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

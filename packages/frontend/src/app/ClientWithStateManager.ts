import { PublicClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { Level } from "level";

import { RelayClient, type RelayEndpoint } from "@massmarket/client";
import { StateManager } from "@massmarket/stateManager";
import { random32BytesHex } from "@massmarket/utils";
import { Item, Order, KeyCard, ShopManifest, Tag, ShopId } from "@/types";

export class ClientWithStateManager {
  readonly publicClient: PublicClient;
  readonly shopId: ShopId;
  public stateManager: StateManager;
  public relayClient: RelayClient;

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
    const merchantKC = localStorage.getItem("merchantKeyCard");
    const guestKC = localStorage.getItem("guestCheckoutKC");
    const dbName = `${this.shopId.slice(0, 7)}${merchantKC ? merchantKC.slice(0, 5) : guestKC ? guestKC.slice(0, 5) : "-guest"}`;
    console.log("using level db:", { dbName });
    const db = new Level(`./${dbName}`, {
      valueEncoding: "json",
    });
    // Set up all the stores via sublevel
    const listingStore = db.sublevel<string, Item>("listingStore", {
      valueEncoding: "json",
    });
    const tagStore = db.sublevel<string, Tag>("tagStore", {
      valueEncoding: "json",
    });
    const shopManifestStore = db.sublevel<string, ShopManifest>(
      "shopManifestStore",
      {
        valueEncoding: "json",
      },
    );
    const orderStore = db.sublevel<string, Order>("orderStore", {
      valueEncoding: "json",
    });

    const keycardStore = db.sublevel<string, KeyCard>("keycardStore", {
      valueEncoding: "json",
    });

    this.stateManager = new StateManager(
      this.relayClient,
      listingStore,
      tagStore,
      shopManifestStore,
      orderStore,
      keycardStore,
      this.shopId,
      this.publicClient,
    );
    return this.stateManager;
  }
  async createNewRelayClient() {
    if (!this.relayEndpoint) throw new Error("Relay endpoint not set");
    if (!this.relayEndpoint.url) throw new Error("Relay endpoint URL not set");
    if (!this.relayEndpoint.tokenId)
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
  async sendMerchantSubscriptionRequest() {
    const seqNo = await this.stateManager.manifest.getSeqNo();
    return this.relayClient.sendMerchantSubscriptionRequest(this.shopId, seqNo);
  }
}

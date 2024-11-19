// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { hexToBytes, numberToBytes, type PublicClient } from "viem";
import { type PrivateKeyAccount, privateKeyToAccount } from "viem/accounts";
import Long from "long";
import { MemoryLevel } from "memory-level";

import type { EventId } from "@massmarket/client";
import { ReadableEventStream } from "@massmarket/client/stream";
import schema, { testVectors } from "@massmarket/schema";
import { StateManager } from "./mod.ts";
import type {
  IRelayClient,
  KeyCard,
  Listing,
  Order,
  ShopManifest,
  Tag,
} from "./types.ts";

export type IncomingEvent = {
  request: schema.SubscriptionPushRequest;
  done: () => void;
};
// this is not a mock Client, move to a different file
export class MockClientStateManager {
  readonly publicClient;
  readonly shopId;
  public stateManager: StateManager | null;
  public relayClient: IRelayClient | null;

  constructor(publicClient: PublicClient, shopId: bigint) {
    this.stateManager = null;
    this.relayClient = null;
    this.publicClient = publicClient;
    this.shopId = shopId;
  }
  createStateManager() {
    const db = new MemoryLevel({
      valueEncoding: "json",
    });
    // Set up all the stores via sublevel
    const listingStore = db.sublevel<string, Listing>("listingStore", {
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

    const keycardNonceStore = db.sublevel<string, number>("keycardNonceStore", {
      valueEncoding: "json",
    });

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

    return this.stateManager;
  }

  setClientAndConnect() {
    this.relayClient = new MockClient();
    return this.relayClient;
  }
}

export class MockClient implements IRelayClient {
  vectors;
  private eventStream: ReadableEventStream;
  keyCardWallet: PrivateKeyAccount;
  private requestCounter;
  private lastSeqNo: number;
  constructor() {
    this.vectors = testVectors;
    this.eventStream = new ReadableEventStream(this);
    this.keyCardWallet = privateKeyToAccount(
      this.vectors.signatures.signer.key as `0x${string}`,
    );
    this.requestCounter = 1;
    this.lastSeqNo = 0;
  }
  encodeAndSendNoWait(_envelope: schema.IEnvelope = {}): schema.RequestId {
    const requestId = { raw: this.requestCounter };
    this.requestCounter++;
    return schema.RequestId.create(requestId);
  }

  connect(): Promise<Event | string> {
    return new Promise((resolve, reject) => {
      if (this.lastSeqNo > 0) {
        reject("already connected");
      }
      const events: schema.SubscriptionPushRequest.SequencedEvent[] = [];

      for (let index = 0; index < this.vectors.events.length; index++) {
        const evt = this.vectors.events[index];
        events.push(
          schema.SubscriptionPushRequest.SequencedEvent.create({
            seqNo: Long.fromNumber(index),
            event: {
              signature: { raw: hexToBytes(evt.signature as `0x${string}`) },
              event: {
                type_url: "type.googleapis.com/market.mass.ShopEvent",
                value: hexToBytes(evt.encoded as `0x${string}`),
              },
            },
          }),
        );
        this.lastSeqNo = index;
      }

      this.eventStream.enqueue({
        requestId: schema.RequestId.create({ raw: this.requestCounter++ }),
        events,
      });

      resolve("done");
    });
  }

  authenticate(): Promise<schema.Envelope> {
    throw new Error("not implemented");
  }

  async sendShopEvent(props: schema.IShopEvent): Promise<EventId> {
    props.nonce = this.lastSeqNo; // reusing seqNo as nonce since this is just a single-writer implementation
    const requestId = this.encodeAndSendNoWait();
    const shopEventBytes = schema.ShopEvent.encode(props).finish();
    const sig = await this.keyCardWallet.signMessage({
      message: { raw: shopEventBytes },
    });
    const sequencedEvent = schema.SubscriptionPushRequest.SequencedEvent.create(
      {
        seqNo: Long.fromNumber(this.lastSeqNo),
        event: {
          signature: { raw: hexToBytes(sig) },
          event: {
            type_url: "type.googleapis.com/market.mass.ShopEvent",
            value: shopEventBytes,
          },
        },
      },
    );

    this.eventStream.enqueue({
      requestId,
      events: [sequencedEvent],
    });
    this.lastSeqNo++;
    return {
      signer: this.keyCardWallet.address,
      nonce: Number(props.nonce),
    };
  }

  listing(item: schema.IListing) {
    return this.sendShopEvent({
      listing: item,
    });
  }
  updateListing(item: schema.IUpdateListing) {
    return this.sendShopEvent({
      updateListing: item,
    });
  }
  tag(tag: schema.ITag) {
    return this.sendShopEvent({
      tag: tag,
    });
  }
  updateTag(tag: schema.IUpdateTag) {
    return this.sendShopEvent({
      updateTag: tag,
    });
  }
  shopManifest(manifest: schema.IManifest, shopId: bigint) {
    manifest.tokenId = { raw: numberToBytes(shopId) };
    return this.sendShopEvent({
      manifest: manifest,
    });
  }
  updateShopManifest(update: schema.IUpdateManifest) {
    return this.sendShopEvent({
      updateManifest: update,
    });
  }

  changeInventory(stock: schema.IChangeInventory) {
    return this.sendShopEvent({
      changeInventory: stock,
    });
  }

  createOrder(order: schema.ICreateOrder) {
    return this.sendShopEvent({
      createOrder: order,
    });
  }

  updateOrder(order: schema.IUpdateOrder) {
    return this.sendShopEvent({
      updateOrder: order,
    });
  }
  uploadBlob(blob: FormData) {
    const file = blob.get(`file`) as { name: string };
    return { url: file.name };
  }
  async sendGuestSubscriptionRequest(_shopId: bigint, _seqNo = 0) {}
  async sendGuestCheckoutSubscriptionRequest(
    _shopId: bigint,
    _seqNo = 0,
  ) {}
  async sendMerchantSubscriptionRequest(_shopId: bigint, _seqNo = 0) {}
  //Mimics client-fired event paymentDetails after commit event - for testing paymentDetails gets stored correctly in stateManager.
  sendPaymentDetails(orderId: `0x${string}`) {
    return this.sendShopEvent({
      updateOrder: {
        id: { raw: hexToBytes(orderId) },
        // eventId: hexToBytes(
        //   "0x32b36377007de4ab0fcc3eabb1ef3a7096c42004c14babc3638f81b9d0982625",
        // ),
        setPaymentDetails: {
          paymentId: {
            raw: hexToBytes(
              "0xb99eb05b47157e6c952120861036e65b471aa97badc3f3379f0b904f3c4c11ee",
            ),
          },
          total: {
            raw: hexToBytes(
              "0x00000000000000000000000000000000000000000000000000000000004f1550",
            ),
          },
          listingHashes: [
            {
              cid: "/ipfs/foobar",
            },
          ],
          ttl: "1",
          shopSignature: {
            raw: hexToBytes(
              "0xa69c2c3e98a986d83d307af9d72f4703cfd2535794a6d2c246b5cd04f8b2d96b41556cb280b63ac3e863d226c14c603b09bb9507d4d74349744aef39b20039bc",
            ),
          },
        },
      },
    });
  }
  createEventStream() {
    return this.eventStream.stream;
  }
}

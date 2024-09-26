// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { hexToBytes } from "viem";
import schema, {
  type PBObject,
  testVectors,
  type TestVectors,
} from "@massmarket/schema";
import { ReadableEventStream } from "@massmarket/client/stream";
import { IRelayClient } from "../types";

export type IncomingEvent = {
  request: schema.EventPushRequest;
  done: () => void;
};

export class MockClient implements IRelayClient {
  vectors: TestVectors;
  private eventStream: ReadableEventStream;
  keyCardWallet: { address: `0x${string}` };
  private requestCounter;

  constructor() {
    this.vectors = testVectors;
    this.eventStream = new ReadableEventStream(this);
    this.keyCardWallet = {
      address: this.vectors.signatures.signer_address as `0x${string}`,
    };

    this.requestCounter = 1;
  }
  encodeAndSendNoWait(object: PBObject = {}) {
    object.requestId = { raw: this.requestCounter };
    this.requestCounter++;
    return object.requestId.raw;
  }

  connect() {
    const events: schema.EventPushRequest = [];

    for (let index = 0; index < this.vectors.events.length; index++) {
      const evt = this.vectors.events[index];
      events.push({
        event: {
          signature: { raw: hexToBytes(evt.signature as `0x${string}`) },
          event: {
            type_url: "type.googleapis.com/market.mass.ShopEvent",
            value: hexToBytes(evt.encoded as `0x${string}`),
          },
        },
      });
    }

    const pushReq = new schema.SubscriptionPushRequest({
      events,
    });
    this.eventStream.enqueue(pushReq);
    return new Promise((resolve) => {
      resolve;
    });
  }
  authenticate() {
    return new Promise((resolve) => {
      resolve;
    });
  }
  sendShopEvent(shopEvent: schema.IShopEvent) {
    const requestId = this.encodeAndSendNoWait();
    this.eventStream.outgoingEnqueue(
      shopEvent,
      //Pass in test signer address for event verification
      this.keyCardWallet.address,
      requestId,
    );
    return requestId;
  }

  async listing(item: schema.ICreateItem) {
    return this.sendShopEvent({
      listing: item,
    });
  }
  async updateListing(item: schema.IUpdateItem) {
    return this.sendShopEvent({
      updateListing: item,
    });
  }
  async tag(tag: schema.ICreateTag) {
    return this.sendShopEvent({
      tag: tag,
    });
  }
  async updateTag(tag: schema.IUpdateTag) {
    return this.sendShopEvent({
      updateTag: tag,
    });
  }
  async shopManifest(manifest: schema.IShopManifest, shopId: `0x${string}`) {
    manifest.tokenId = { raw: hexToBytes(shopId) };
    return this.sendShopEvent({
      manifest: manifest,
    });
  }
  async updateShopManifest(update: schema.IUpdateShopManifest) {
    return this.sendShopEvent({
      updateManifest: update,
    });
  }

  async changeInventory(stock: schema.IChangeStock) {
    return this.sendShopEvent({
      changeInventory: stock,
    });
  }

  async createOrder(order: schema.ICreateOrder) {
    return this.sendShopEvent({
      createOrder: order,
    });
  }

  async updateOrder(order: schema.IUpdateOrder) {
    return this.sendShopEvent({
      updateOrder: order,
    });
  }
  async uploadBlob(blob: FormData) {
    const file = blob.get(`file`) as { name: string };
    return { url: file.name };
  }
  async sendSubscriptionRequest(
    shopId: `0x${string}`,
    filters: schema.IFilter[],
    seqNo = 0,
  ) {}

  //Mimics client-fired event paymentDetails after commit event - for testing paymentDetails gets stored correctly in stateManager.
  async sendPaymentDetails(orderId: `0x${string}`) {
    return this.sendShopEvent({
      updateOrder: {
        id: { raw: hexToBytes(orderId) },
        eventId: hexToBytes(
          "0x32b36377007de4ab0fcc3eabb1ef3a7096c42004c14babc3638f81b9d0982625",
        ),
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

// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { hexToBytes } from "viem";
import schema, {
  type PBObject,
  type PBMessage,
  testVectors,
  type TestVectors,
} from "@massmarket/schema";
import { requestId, eventId } from "@massmarket/utils";
import { ReadableEventStream } from "@massmarket/client/stream";
import { IRelayClient } from "../types";

export type IncomingEvent = {
  request: schema.EventPushRequest;
  done: () => void;
};

export class MockClient implements IRelayClient {
  vectors: TestVectors;
  private eventStream: ReadableEventStream;
  private requestCounter;

  constructor() {
    this.vectors = testVectors;
    this.eventStream = new ReadableEventStream(this);
    this.requestCounter = 1;
  }
  encodeAndSendNoWait(object: PBObject = {}) {
    if (!object.requestId) {
      object.requestId = { raw: this.requestCounter };
    }
    this.requestCounter++;

    return Promise.resolve(object);
  }

  connect() {
    const events: schema.EventPushRequest = [];

    for (let index = 0; index < this.vectors.events.length; index++) {
      const evt = this.vectors.events[index];
      events.push({
        signature: hexToBytes(evt.signature as `0x${string}`),
        event: {
          type_url: "type.googleapis.com/market.mass.ShopEvent",
          value: hexToBytes(evt.encoded as `0x${string}`),
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

  sendShopEvent(shopEvent: schema.IShopEvent) {
    this.eventStream.outgoingEnqueue(
      shopEvent,
      this.vectors.signatures.signer_address as `0x${string}`,
    );
    return new Promise((resolve) => {
      resolve;
    });
  }

  async listing(item: schema.ICreateItem) {
    const id = (item.id = eventId());
    item.eventId = id;
    this.sendShopEvent({
      listing: item,
    });
    return id;
  }
  async updateListing(item: schema.IUpdateItem) {
    const id = (item.eventId = eventId());
    this.sendShopEvent({
      updateListing: item,
    });
    return id;
  }
  async tag(tag: schema.ICreateTag) {
    const id = (tag.id = eventId());
    tag.eventId = id;
    this.sendShopEvent({
      tag: tag,
    });
    return id;
  }
  async updateTag(tag: schema.IUpdateTag) {
    const id = (tag.eventId = eventId());
    this.sendShopEvent({
      updateTag: tag,
    });
    return id;
  }
  async shopManifest(manifest: schema.IShopManifest, shopId: `0x${string}`) {
    manifest.tokenId = { raw: hexToBytes(shopId) };
    const id = (manifest.eventId = eventId());
    this.sendShopEvent({
      manifest: manifest,
    });
    return id;
  }
  async updateShopManifest(update: schema.IUpdateShopManifest) {
    const id = (update.eventId = eventId());
    this.sendShopEvent({
      updateManifest: update,
    });
    return id;
  }

  async changeInventory(stock: schema.IChangeStock) {
    const id = (stock.eventId = eventId());
    this.sendShopEvent({
      changeInventory: stock,
    });
    return id;
  }

  async createOrder() {
    const id = eventId();
    this.sendShopEvent({
      createOrder: {
        id,
        eventId: id,
      },
    });
    return id;
  }

  async updateOrder(order: schema.IUpdateOrder) {
    const id = (order.eventId = eventId());
    this.sendShopEvent({
      updateOrder: order,
    });
    return id;
  }
  async uploadBlob(blob: FormData) {
    const file = blob.get(`file`) as { name: string };
    return { url: file.name };
  }

  async commitOrder(order: schema.CommitItemsToOrderRequest, orderId) {
    this.sendShopEvent({
      updateOrder: {
        id: orderId,
        eventId: hexToBytes(
          "0x32b36377007de4ab0fcc3eabb1ef3a7096c42004c14babc3638f81b9d0982625",
        ),
        paymentDetails: {
          paymentId: hexToBytes(
            "0xb99eb05b47157e6c952120861036e65b471aa97badc3f3379f0b904f3c4c11ee",
          ),
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
    return;
  }

  createEventStream() {
    return this.eventStream.stream;
  }
}

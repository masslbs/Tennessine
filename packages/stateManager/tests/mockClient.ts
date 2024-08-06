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
import { IRelayClient } from "../";

export type IncomingEvent = {
  request: schema.EventPushRequest;
  done: () => void;
};

export class MockClient implements IRelayClient {
  vectors: TestVectors;
  private eventStream: ReadableEventStream;

  constructor() {
    this.vectors = testVectors;
    this.eventStream = new ReadableEventStream(this);
  }
  encodeAndSendNoWait(encoder: PBMessage, object: PBObject = {}) {
    return Promise.resolve(encoder.encode(object).finish());
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

    const pushReq = new schema.EventPushRequest({
      requestId: requestId(),
      events,
    });
    this.eventStream.enqueue(pushReq);
    return new Promise((resolve) => {
      resolve;
    });
  }

  sendShopEvent(shopEvent: schema.IShopEvent) {
    const shopEventBytes = schema.ShopEvent.encode(shopEvent).finish();
    const signedEvent = {
      //TODO:Grabbing first vector event signature for now since we don't have actual validation
      signature: hexToBytes(this.vectors.events[0].signature as `0x${string}`),
      event: {
        type_url: "type.googleapis.com/market.mass.ShopEvent",
        value: shopEventBytes,
      },
    };
    this.eventStream.outgoingEnqueue(shopEvent);
    return new Promise((resolve) => {
      resolve;
    });
  }

  async createItem(item: schema.ICreateItem) {
    const id = (item.eventId = eventId());
    this.sendShopEvent({
      createItem: item,
    });
    return id;
  }
  async updateItem(item: schema.IUpdateItem) {
    const id = (item.eventId = eventId());
    this.sendShopEvent({
      updateItem: item,
    });
    return id;
  }
  async createTag(tag: schema.ICreateTag) {
    const id = (tag.eventId = eventId());
    this.sendShopEvent({
      createTag: tag,
    });
    return id;
  }
  async shopManifest(manifest: schema.IShopManifest, shopId: `0x${string}`) {
    const id = (manifest.eventId = eventId());
    manifest.shopTokenId = hexToBytes(shopId);
    this.sendShopEvent({
      shopManifest: manifest,
    });
    return id;
  }
  async updateShopManifest(update: schema.IUpdateShopManifest) {
    const id = (update.eventId = eventId());
    this.sendShopEvent({
      updateShopManifest: update,
    });
    return id;
  }

  async changeStock(stock: schema.IChangeStock) {
    const id = (stock.eventId = eventId());
    this.sendShopEvent({
      changeStock: stock,
    });
    return id;
  }

  async createOrder() {
    const id = eventId();
    this.sendShopEvent({
      createOrder: {
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

  async commitOrder(order: schema.IUpdateOrder) {
    const id = (order.eventId = eventId());
    this.sendShopEvent({
      updateOrder: order,
    });
    return id;
  }

  createEventStream() {
    return this.eventStream.stream;
  }
}

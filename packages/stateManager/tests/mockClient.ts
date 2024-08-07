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
  async updateTag(tag: schema.IUpdateTag) {
    const id = (tag.eventId = eventId());
    this.sendShopEvent({
      updateTag: tag,
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

  async commitOrder(order: schema.CommitItemsToOrderRequest) {
    this.sendShopEvent({
      updateOrder: {
        orderId: order.orderId,
        eventId: hexToBytes(
          "0x32b36377007de4ab0fcc3eabb1ef3a7096c42004c14babc3638f81b9d0982625",
        ),
        itemsFinalized: {
          orderHash: hexToBytes(
            "0xb99eb05b47157e6c952120861036e65b471aa97badc3f3379f0b904f3c4c11ee",
          ),
          currencyAddr: hexToBytes(
            "0x88dcf92582223fd469df2263ade6e8020166808f",
          ),
          totalInCrypto: hexToBytes(
            "0x000000000000000000000000000000000000000000000000000000000002d384",
          ),
          ttl: "1",
          payeeAddr: hexToBytes("0x8412ebe8ca946066c6db6ae5031ffeb13e703309"),
          shopSignature: hexToBytes(
            "0xa69c2c3e98a986d83d307af9d72f4703cfd2535794a6d2c246b5cd04f8b2d96b41556cb280b63ac3e863d226c14c603b09bb9507d4d74349744aef39b20039bc",
          ),
          total: "1852.20",
        },
      },
    });
    return;
  }

  createEventStream() {
    return this.eventStream.stream;
  }
}

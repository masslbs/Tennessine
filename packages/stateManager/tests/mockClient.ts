// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { hexToBytes } from "viem";
import { RelayClient } from "@massmarket/client";
import schema, { testVectors } from "@massmarket/schema";
import { requestId, eventId } from "@massmarket/utils";
import { ReadableEventStream } from "@massmarket/client/stream";

type VectorEvent = {
  type: string;
  // actually all combinations are known but depends on 'type', not sure how to map this.
  // Might not be necessary to access these for these tests, tho.
  object: any;
  signature: string;
  hash: string;
  encoded: string;
};

export type VectorItems = {
  [key: string]: {
    price: string;
    metadata: string;
    tag_id: string[];
    stock_qty: number;
  };
};

export type VectorOrderDetails = {
  payment_id: string;

  // which items and how many of them
  items: { [key: string]: number };

  // decimal string of the total price to be payed
  total: string;
};

export type TestVectors = {
  signatures: {
    signer_address: string;
  };
  events: VectorEvent[];
  reduced: {
    manifest: {
      shop_token_id: string;
      domain: string;
      published_tag: string;
    };
    // keycard_id -> user_wallet
    keycards: { [key: string]: string };

    // item_id -> { price, metadata }
    items: VectorItems;

    // tag_id > { name }
    tags: { [key: string]: { name: string } };

    // items assigned to the published tag
    published_items: string[];

    // item_id -> quantity
    inventory: { [key: string]: number };

    orders: {
      // order_id -> item_id -> quantity
      open: { [key: string]: { [key: string]: number } };

      // order_id -> order details
      items_finalized: { [key: string]: VectorOrderDetails };

      payed: {
        order_id: string;
        tx_hash: string;
      }[];

      // array of order_id
      abandoned: string[];
    };
  };
};

export type IncomingEvent = {
  request: schema.EventPushRequest;
  done: () => void;
};
export class MockClient implements RelayClient {
  vectors: TestVectors;
  private eventStream;

  constructor() {
    this.vectors = testVectors;
    this.eventStream = new ReadableEventStream(this);
  }
  encodeAndSendNoWait(encoder, object) {
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
    const pushReq = new schema.EventPushRequest({
      requestId: requestId(),
      events: [signedEvent],
    });
    this.eventStream.enqueue(pushReq);
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
  createEventStream() {
    return this.eventStream.stream;
  }
}

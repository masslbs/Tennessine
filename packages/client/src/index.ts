// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: MIT

import { EventEmitter } from "events";

import { WebSocket } from "isows";
import { hexToBytes, hexToBigInt, toBytes, bytesToHex } from "viem";
import { PrivateKeyAccount } from "viem/accounts";
import { createSiweMessage } from "viem/siwe";

import schema, { PBObject, PBInstance } from "@massmarket/schema";
import { WalletClientWithAccount } from "@massmarket/blockchain";
import { eventId, hexToBase64, decodeBuffer } from "@massmarket/utils";

import { ReadableEventStream } from "./stream.js";

export type { WalletClientWithAccount };

export type RelayEndpoint = {
  url: URL; // the websocket URL to talk to
  tokenId: `0x${string}`;
};

export class RelayClient extends EventEmitter {
  connection!: WebSocket;
  private keyCardWallet;
  private relayEndpoint: RelayEndpoint;
  private useTLS;
  private eventStream;
  private requestCounter;
  private eventNonceCounter;
  constructor({
    relayEndpoint,
    keyCardWallet,
  }: {
    relayEndpoint: RelayEndpoint;
    keyCardWallet: PrivateKeyAccount;
  }) {
    super();
    this.keyCardWallet = keyCardWallet;
    this.relayEndpoint = relayEndpoint;
    this.useTLS = relayEndpoint.url.protocol == "wss";
    this.eventStream = new ReadableEventStream(this);
    this.requestCounter = 1;
    this.eventNonceCounter = 0;
  }

  createEventStream() {
    return this.eventStream.stream;
  }

  #handlePingRequest(ping: schema.PingRequest) {
    const pr = schema.PingResponse.encode({
      requestId: ping.requestId,
    }).finish();

    const typedPr = new Uint8Array(pr.length + 1);
    typedPr[0] = 2;
    typedPr.set(pr, 1);
    this.connection.send(typedPr);
  }

  // like encodeAndSend but doesn't wait for a response; EventPushResponse uses this
  encodeAndSendNoWait(object: PBObject = {}) {
    if (!object.requestId) {
      object.requestId = { raw: this.requestCounter };
    }
    const payload = schema.Envelope.encode(object).finish();
    this.connection.send(payload);
    this.requestCounter++;
    return object.requestId.raw;
  }

  // encode and send a message and then wait for a response
  encodeAndSend(object: PBObject = {}): Promise<PBInstance> {
    const id = this.encodeAndSendNoWait(object);
    return new Promise((resolve, reject) => {
      this.once(id, (result) => {
        if (result.response.error) {
          const { code, message } = result.response.error;
          console.error(`network error[${code}]: ${message}`);
          reject(result.error);
        } else {
          resolve(result);
        }
      });
    });
  }

  async sendShopEvent(
    shopEvent: schema.IShopEvent,
  ): Promise<schema.EventWriteResponse> {
    await this.connect();

    shopEvent.nonce = this.eventNonceCounter++;

    const shopEventBytes = schema.ShopEvent.encode(shopEvent).finish();
    const sig = await this.keyCardWallet.signMessage({
      message: { raw: shopEventBytes },
    });
    const signedEvent = {
      signature: { raw: hexToBytes(sig) },
      event: {
        type_url: "type.googleapis.com/market.mass.ShopEvent",
        value: shopEventBytes,
      },
    };
    const eventWriteRequest = {
      eventWriteRequest: {
        events: [signedEvent],
      },
    };
    await this.encodeAndSend(eventWriteRequest);
    this.eventStream.outgoingEnqueue(shopEvent);
  }

  async shopManifest(manifest: schema.IShopManifest, shopId: `0x${string}`) {
    manifest.tokenId = { raw: hexToBytes(shopId) };
    const id = (manifest.eventId = eventId());
    await this.sendShopEvent({
      manifest: manifest,
    });
    return id;
  }

  async updateShopManifest(update: schema.IUpdateShopManifest) {
    const id = (update.eventId = eventId());
    await this.sendShopEvent({
      updateManifest: update,
    });
    return id;
  }

  async listing(item: schema.ICreateItem) {
    const id = (item.id = eventId());
    item.eventId = id;
    await this.sendShopEvent({
      listing: item,
    });
    return id;
  }

  async updateListing(item: schema.IUpdateItem) {
    const id = (item.eventId = eventId());
    await this.sendShopEvent({
      updateListing: item,
    });
    return id;
  }

  async tag(tag: schema.ICreateTag) {
    const id = (tag.id = eventId());
    tag.eventId = id;
    await this.sendShopEvent({
      tag: tag,
    });
    return id;
  }

  async updateTag(tag: schema.IUpdateTag) {
    const id = (tag.eventId = eventId());
    await this.sendShopEvent({
      updateTag: tag,
    });
    return id;
  }

  async createOrder() {
    const id = eventId();
    await this.sendShopEvent({
      createOrder: {
        id,
        eventId: id,
      },
    });
    return id;
  }

  async updateOrder(order: schema.IUpdateOrder) {
    const id = (order.eventId = eventId());
    await this.sendShopEvent({
      updateOrder: order,
    });
    return id;
  }

  async changeInventory(stock: schema.IChangeInventory) {
    const id = (stock.eventId = eventId());
    await this.sendShopEvent({
      changeInventory: stock,
    });
    return id;
  }

  async #decodeMessage(me: MessageEvent) {
    const _data =
      me.data instanceof Blob
        ? await new Response(me.data).arrayBuffer()
        : me.data;
    const payload = new Uint8Array(_data);

    const message = schema.Envelope.decode(payload);
    const type = message.message;
    switch (type) {
      case "pingRequest":
        this.#handlePingRequest(message);
        break;
      case "subscriptionPushRequest":
        this.eventStream.enqueue({
          requestId: message.requestId,
          events: message.subscriptionPushRequest.events,
        });
        break;
      default:
        this.emit(`${parseInt(message.requestId.raw)}`, message);
    }
  }

  async #authenticate() {
    const { response } = await this.encodeAndSend({
      authRequest: {
        publicKey: {
          raw: toBytes(this.keyCardWallet.publicKey).slice(1),
        },
      },
    });
    const sig = await this.keyCardWallet.signMessage({
      message: {
        raw: response.payload,
      },
    });
    return this.encodeAndSend({
      challengeSolutionRequest: {
        signature: { raw: toBytes(sig) },
      },
    });
  }

  async connect(): Promise<
    void | Event | schema.ChallengeSolvedResponse | string
  > {
    if (
      !this.connection ||
      this.connection.readyState === WebSocket.CLOSING ||
      this.connection.readyState === WebSocket.CLOSED
    ) {
      this.connection = new WebSocket(this.relayEndpoint.url + "/sessions");
      this.connection.addEventListener("error", (error: Event) => {
        console.error("WebSocket error!");
        console.error(error);
      });
      this.connection.addEventListener(
        "message",
        this.#decodeMessage.bind(this),
      );
    }
    return new Promise((resolve, reject) => {
      if (this.connection.readyState === WebSocket.OPEN) {
        resolve("already open");
      } else {
        this.connection.addEventListener("open", async () => {
          const res = await this.#authenticate();
          if (res) {
            console.log("authentication success");
            resolve(res);
          } else {
            console.log("authentication failed");
            reject(res);
          }
        });
      }
    });
  }

  disconnect(): Promise<CloseEvent | string> {
    return new Promise((resolve) => {
      if (
        typeof this.connection === "undefined" ||
        this.connection.readyState === WebSocket.CLOSED
      ) {
        resolve("already closed");
        return;
      }
      this.connection.addEventListener("close", resolve);
      this.connection.close(1000);
    });
  }

  async enrollKeycard(
    wallet: WalletClientWithAccount,
    isGuest: boolean = true,
    shopId: `0x${string}`,
    location?: URL,
  ) {
    const publicKey = toBytes(this.keyCardWallet.publicKey).slice(1);
    const endpointURL = new URL(this.relayEndpoint.url);
    endpointURL.protocol = this.useTLS ? "https" : "http";
    endpointURL.pathname += `/enroll_key_card`;
    endpointURL.search = `guest=${isGuest ? 1 : 0}`;
    console.log(`posting to ${endpointURL.href}`);
    const signInURL: URL = location ?? endpointURL;

    const message = createSiweMessage({
      address: wallet.account.address,
      chainId: 1, // not really used
      domain: signInURL.host,
      nonce: "00000000",
      uri: signInURL.href,
      version: "1",
      resources: [
        `mass-relayid:${hexToBigInt(this.relayEndpoint.tokenId)}`,
        `mass-shopid:${hexToBigInt(shopId)}`,
        `mass-keycard:${Buffer.from(publicKey).toString("hex")}`,
      ],
    });

    const signature = await wallet.signMessage({
      message: { raw: Buffer.from(message) },
    });
    const body = JSON.stringify({
      message,
      signature: hexToBase64(signature),
    });
    const response = await fetch(endpointURL.href, {
      method: "POST",
      body,
    });
    return response;
  }

  async uploadBlob(blob: FormData) {
    await this.connect();
    const uploadURLResp = (await this.encodeAndSend({
      getBlobUploadUrlRequest: {},
    })) as schema.GetBlobUploadURLResponse;

    if (uploadURLResp.response.error !== null) {
      throw new Error(
        `Failed to get blob upload URL: ${uploadURLResp.error!.message}`,
      );
    }
    const url = decodeBuffer(uploadURLResp.response.payload);
    const uploadResp = await fetch(url, {
      method: "POST",
      body: blob,
    });
    if (uploadResp.status !== 201) {
      throw new Error(
        `unexpected status: ${uploadResp.statusText} (${uploadResp.status})`,
      );
    }
    return uploadResp.json();
  }

  // null erc20Addr means vanilla ethererum is used
  async commitOrder(
    order: schema.ICommitItemsToOrderRequest,
    orderId: Uint8Array,
  ): Promise<schema.CommitItemsToOrderResponse> {
    const eId = eventId();
    await this.sendShopEvent({
      updateOrder: { id: orderId, commit: order, eventId: eId },
    });
    return eId;
  }
}

// testing helper
export async function discoverRelay(url: string): Promise<RelayEndpoint> {
  const discoveryURL = url
    .replace("ws", "http")
    .replace("/v3", "/testing/discovery");
  const testingResponse = await fetch(discoveryURL);
  const testingData = await testingResponse.json();
  return {
    url: new URL(url),
    tokenId: testingData.relay_token_id,
  };
}

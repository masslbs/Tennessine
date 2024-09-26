// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: MIT

import { EventEmitter } from "events";

import { WebSocket } from "isows";
import { hexToBytes, hexToBigInt, toBytes } from "viem";
import { PrivateKeyAccount } from "viem/accounts";
import { createSiweMessage } from "viem/siwe";

import schema, { PBObject, PBInstance, PBMessage } from "@massmarket/schema";
import { WalletClientWithAccount } from "@massmarket/blockchain";
import { hexToBase64, decodeBufferToString } from "@massmarket/utils";

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
  private subscriptionId: number | null;
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
    this.eventNonceCounter = 1;
    this.subscriptionId = null;
  }

  createEventStream() {
    return this.eventStream.stream;
  }

  #handlePingRequest(ping: schema.PingRequest) {
    // relay ends connection if ping is not responded to 3 times.
    this.encodeAndSendNoWait({
      requestId: ping.requestId,
      response: {},
    });
  }

  // like encodeAndSend but doesn't wait for a response.
  encodeAndSendNoWait(object: PBObject = {}) {
    if (!object.requestId) {
      object.requestId = { raw: this.requestCounter };
    }
    // Turns json into binary
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
          reject(result.response.error);
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
    shopEvent.timestamp = { seconds: Date.now() / 1000 };
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
    const res = await this.encodeAndSend(eventWriteRequest);
    //Passing current KC address as signer for event verification.
    this.eventStream.outgoingEnqueue(
      shopEvent,
      this.keyCardWallet.address,
      res.requestId,
    );
    return res.requestId;
  }

  shopManifest(manifest: schema.IShopManifest, shopId: `0x${string}`) {
    manifest.tokenId = { raw: hexToBytes(shopId) };
    return this.sendShopEvent({
      manifest: manifest,
    });
  }

  updateShopManifest(update: schema.IUpdateShopManifest) {
    return this.sendShopEvent({
      updateManifest: update,
    });
  }

  listing(item: schema.ICreateItem) {
    return this.sendShopEvent({
      listing: item,
    });
  }

  updateListing(item: schema.IUpdateItem) {
    return this.sendShopEvent({
      updateListing: item,
    });
  }

  tag(tag: schema.ICreateTag) {
    return this.sendShopEvent({
      tag: tag,
    });
  }

  updateTag(tag: schema.IUpdateTag) {
    return this.sendShopEvent({
      updateTag: tag,
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

  changeInventory(stock: schema.IChangeInventory) {
    return this.sendShopEvent({
      changeInventory: stock,
    });
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
      case PBMessage.PingRequest:
        this.#handlePingRequest(message);
        break;
      case PBMessage.SubscriptionPushRequest:
        this.eventStream.enqueue({
          requestId: message.requestId,
          events: message.subscriptionPushRequest.events,
        });
        break;
      default:
        this.emit(`${parseInt(message.requestId.raw)}`, message);
    }
  }
  async sendMerchantSubscriptionRequest(shopId: `0x${string}`, seqNo = 0) {
    const filters = [
      { objectType: schema.ObjectType.OBJECT_TYPE_LISTING },
      { objectType: schema.ObjectType.OBJECT_TYPE_TAG },
      { objectType: schema.ObjectType.OBJECT_TYPE_ORDER },
      { objectType: schema.ObjectType.OBJECT_TYPE_ACCOUNT },
      { objectType: schema.ObjectType.OBJECT_TYPE_MANIFEST },
      { objectType: schema.ObjectType.OBJECT_TYPE_INVENTORY },
    ];
    const { response } = await this.encodeAndSend({
      subscriptionRequest: {
        startShopSeqNo: seqNo,
        shopId: { raw: hexToBytes(shopId) },
        filters,
      },
    });
    this.subscriptionId = response.payload;
  }
  async sendGuestCheckoutSubscriptionRequest(shopId: `0x${string}`, seqNo = 0) {
    const filters = [
      { objectType: schema.ObjectType.OBJECT_TYPE_LISTING },
      { objectType: schema.ObjectType.OBJECT_TYPE_TAG },
      { objectType: schema.ObjectType.OBJECT_TYPE_ORDER },
      { objectType: schema.ObjectType.OBJECT_TYPE_ACCOUNT },
      { objectType: schema.ObjectType.OBJECT_TYPE_MANIFEST },
    ];
    const { response } = await this.encodeAndSend({
      subscriptionRequest: {
        startShopSeqNo: seqNo,
        shopId: { raw: hexToBytes(shopId) },
        filters,
      },
    });
    this.subscriptionId = response.payload;
  }

  async sendGuestSubscriptionRequest(shopId: `0x${string}`, seqNo = 0) {
    const filters = [
      { objectType: schema.ObjectType.OBJECT_TYPE_LISTING },
      { objectType: schema.ObjectType.OBJECT_TYPE_TAG },
      { objectType: schema.ObjectType.OBJECT_TYPE_MANIFEST },
      { objectType: schema.ObjectType.OBJECT_TYPE_ACCOUNT },
    ];
    const { response } = await this.encodeAndSend({
      subscriptionRequest: {
        startShopSeqNo: seqNo,
        shopId: { raw: hexToBytes(shopId) },
        filters,
      },
    });
    this.subscriptionId = response.payload;
  }
  async cancelSubscriptionRequest() {
    this.encodeAndSend({
      subscriptionCancelRequest: {
        subscriptionId: this.subscriptionId,
      },
    });
  }

  async authenticate() {
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
    return new Promise((resolve) => {
      if (this.connection.readyState === WebSocket.OPEN) {
        resolve("already open");
      } else {
        this.connection.addEventListener("open", resolve);
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
    const url = decodeBufferToString(uploadURLResp.response.payload);
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

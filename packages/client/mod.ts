// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: MIT

import { EventEmitter } from "events";
import { Buffer } from "buffer";
import { WebSocket } from "isows";
import { hexToBytes, hexToBigInt, toBytes } from "viem";
import { PrivateKeyAccount } from "viem/accounts";
import { createSiweMessage } from "viem/siwe";
import assert from "assert";

import schema, { EnvelopMessageTypes } from "@massmarket/schema";
import { type ConcreteWalletClient } from "@massmarket/blockchain";
import { hexToBase64, decodeBufferToString } from "@massmarket/utils";

import { ReadableEventStream } from "./stream.ts";

export type RelayEndpoint = {
  url: URL; // the websocket URL to talk to
  tokenId: `0x${string}`;
};

export class RelayClient extends EventEmitter {
  connection!: WebSocket;
  private keyCardWallet: PrivateKeyAccount;
  public readonly relayEndpoint: RelayEndpoint;
  private subscriptionId: Uint8Array | null;
  // TODO: type these out? apparently not inferred? - maybe just two different LSPs in my editor?
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
    this.eventNonceCounter = 1;
    this.subscriptionId = null;
  }

  createEventStream() {
    return this.eventStream.stream;
  }


  // like encodeAndSend but doesn't wait for a response.
  encodeAndSendNoWait(envelope: schema.IEnvelope = {}): schema.RequestId {
    if (!envelope.requestId) {
      envelope.requestId = { raw: this.requestCounter };
    }
    const err = schema.Envelope.verify(envelope);
    if (err) {
      throw new Error(err);
    }
    // Turns json into binary
    const payload = schema.Envelope.encode(envelope).finish();
    this.connection.send(payload);
    this.requestCounter++;
    return schema.RequestId.create(envelope.requestId);
  }

  // encode and send a message and then wait for a response
  encodeAndSend(envelope: schema.IEnvelope = {}): Promise<schema.Envelope> {
    const id = this.encodeAndSendNoWait(envelope);
    return new Promise((resolve, reject) => {
      this.once(id.raw.toString(), (response: schema.Envelope) => {
        if (response.response?.error) {
          const { code, message } = response.response.error;
          console.error(`network error[${code}]: ${message}`);
          reject(response.response.error);
        } else {
          resolve(response);
        }
      });
    });
  }

  async sendShopEvent(shopEvent: schema.IShopEvent): Promise<schema.RequestId> {
    await this.connect();

    // prepare for signing
    shopEvent.nonce = this.eventNonceCounter++;
    shopEvent.timestamp = { seconds: Date.now() / 1000 };
    const shopEventBytes = schema.ShopEvent.encode(shopEvent).finish();

    // create signature for new event
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
    const envelope = {
      eventWriteRequest: {
        events: [signedEvent],
      },
    };
    const { requestId } = await this.encodeAndSend(envelope);
    assert(requestId, "requestId is required");
    return schema.RequestId.create(requestId);
  }

  shopManifest(manifest: schema.IManifest, shopId: `0x${string}`) {
    manifest.tokenId = { raw: hexToBytes(shopId) };
    return this.sendShopEvent({
      manifest: manifest,
    });
  }

  updateShopManifest(update: schema.IUpdateManifest) {
    return this.sendShopEvent({
      updateManifest: update,
    });
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

    const envelope = schema.Envelope.decode(payload);
    assert(envelope.requestId?.raw, "requestId is required");
    switch (envelope.message) {
      case EnvelopMessageTypes.PingRequest:
        this.#handlePingRequest(envelope);
        break;
      case EnvelopMessageTypes.SubscriptionPushRequest:
        assert(
          envelope.subscriptionPushRequest,
          "subscriptionPushRequest is required",
        );
        {
          const events = envelope.subscriptionPushRequest.events!.map((evt) =>
            schema.SubscriptionPushRequest.SequencedEvent.create(evt),
          );
          console.log(`pushing ${events.length} events to event stream`);
          this.eventStream.enqueue({
            requestId: schema.RequestId.create(envelope.requestId),
            events,
          });
        }
        break;
      default:
        this.emit(envelope.requestId.raw.toString(), envelope);
    }
  }

  #handlePingRequest(ping: schema.Envelope) {
    // relay ends connection if ping is not responded to 3 times.
    this.encodeAndSendNoWait({
      requestId: ping.requestId,
      response: {},
    });
  }


  async sendMerchantSubscriptionRequest(shopId: `0x${string}`, seqNo = 0) {
    assert(this.subscriptionId == null, "subscriptionId is already set. cancel first.");
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
    assert(response, "response is required");
    assert(response.payload, "response.payload is required");
    this.subscriptionId = response.payload;
  }
  async sendGuestCheckoutSubscriptionRequest(shopId: `0x${string}`, seqNo = 0) {
    assert(this.subscriptionId == null, "subscriptionId is already set. cancel first.");
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
    assert(response?.payload, "response.payload is required");
    this.subscriptionId = response.payload;
  }

  async sendGuestSubscriptionRequest(shopId: `0x${string}`, seqNo = 0) {
    assert(this.subscriptionId == null, "subscriptionId is already set. cancel first.");
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
    assert(response?.payload, "response.payload is required");
    this.subscriptionId = response.payload;
  }

  async cancelSubscriptionRequest() {
    await this.encodeAndSend({
      subscriptionCancelRequest: {
        subscriptionId: this.subscriptionId,
      },
    });
    this.subscriptionId = null;
  }

  async authenticate() {
    const { response } = await this.encodeAndSend({
      authRequest: {
        publicKey: {
          raw: toBytes(this.keyCardWallet.publicKey).slice(1),
        },
      },
    });
    assert(response?.payload, "response.payload is required");
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

  // TODO: make an enum of the possible events
  connect(): Promise<Event | string> {
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
        this.connection.addEventListener("open", (evt: Event) => {
          // TODO: unbox event to concrete values
          resolve(evt);
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
    wallet: ConcreteWalletClient,
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
    const envelope = await this.encodeAndSend({
      getBlobUploadUrlRequest: {},
    });
    assert(envelope.response, "envelope.response is required");

    if (envelope.response.error) {
      const { code, message } = envelope.response.error;
      throw new Error(
        `Failed to get blob upload URL - code: ${code} message: ${message}`,
      );
    }
    assert(envelope.response?.payload, "envelope.response.payload is required");

    const url = decodeBufferToString(envelope.response.payload);
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

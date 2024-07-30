// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: MIT

import { EventEmitter } from "events";

import { WebSocket } from "isows";
import { bytesToHex, hexToBytes, hexToBigInt, toBytes } from "viem";
import { PrivateKeyAccount } from "viem/accounts";
import { createSiweMessage } from "viem/siwe";

import schema, {
  PBObject,
  PBMessage,
  PBInstance,
  MESSAGE_TYPES,
  MESSAGE_PREFIXES,
} from "@massmarket/schema";
import { WalletClientWithAccount } from "@massmarket/blockchain";
import { requestId, eventId, hexToBase64 } from "@massmarket/utils";

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
  encodeAndSendNoWait(encoder: PBMessage, object: PBObject = {}) {
    if (!object.requestId) {
      object.requestId = requestId();
    }
    const id = object.requestId;
    const payload = encoder.encode(object).finish();
    const typed = new Uint8Array(payload.length + 1);
    typed[0] = MESSAGE_TYPES.get(encoder) as number;
    typed.set(payload, 1);
    console.log(`[send] reqId=${bytesToHex(id)} typeCode=${typed[0]}`);
    this.connection.send(typed);
    return id;
  }

  // encode and send a message and then wait for a response
  encodeAndSend(
    encoder: PBMessage,
    object: PBObject = {},
  ): Promise<PBInstance> {
    const id = this.encodeAndSendNoWait(encoder, object);
    return new Promise((resolve, reject) => {
      this.once(bytesToHex(id), (result) => {
        if (result.error) {
          const { code, message } = result.error;
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
    const shopEventBytes = schema.ShopEvent.encode(shopEvent).finish();
    const sig = await this.keyCardWallet.signMessage({
      message: { raw: shopEventBytes },
    });
    const signedEvent = {
      signature: hexToBytes(sig),
      event: {
        type_url: "type.googleapis.com/market.mass.ShopEvent",
        value: shopEventBytes,
      },
    };
    const eventWriteRequest = {
      event: signedEvent,
    };
    await this.encodeAndSend(schema.EventWriteRequest, eventWriteRequest);
    this.eventStream.outgoingEnqueue(shopEvent);
  }

  async shopManifest(manifest: schema.IShopManifest, shopId: `0x${string}`) {
    const id = (manifest.eventId = eventId());
    manifest.shopTokenId = hexToBytes(shopId);
    await this.sendShopEvent({
      shopManifest: manifest,
    });
    return id;
  }

  async updateShopManifest(update: schema.IUpdateShopManifest) {
    const id = (update.eventId = eventId());
    await this.sendShopEvent({
      updateShopManifest: update,
    });
    return id;
  }

  async createItem(item: schema.ICreateItem) {
    const id = (item.eventId = eventId());
    await this.sendShopEvent({
      createItem: item,
    });
    return id;
  }

  async updateItem(item: schema.IUpdateItem) {
    const id = (item.eventId = eventId());
    await this.sendShopEvent({
      updateItem: item,
    });
    return id;
  }

  async createTag(tag: schema.ICreateTag) {
    const id = (tag.eventId = eventId());
    await this.sendShopEvent({
      createTag: tag,
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

  async changeStock(stock: schema.IChangeStock) {
    const id = (stock.eventId = eventId());
    await this.sendShopEvent({
      changeStock: stock,
    });
    return id;
  }

  async #decodeMessage(me: MessageEvent) {
    const _data =
      me.data instanceof Blob
        ? await new Response(me.data).arrayBuffer()
        : me.data;
    const data = new Uint8Array(_data);
    const prefix = data[0];
    const pbMessage = MESSAGE_PREFIXES.get(prefix);
    if (!pbMessage) {
      console.warn("unkown message", prefix);
      return;
    }
    const payload = data.slice(1);
    const message = pbMessage.decode(payload);
    console.log(
      `[recv] reqId=${bytesToHex(message.requestId)} typeCode=${prefix}`,
    );
    switch (pbMessage) {
      case schema.PingRequest:
        this.#handlePingRequest(message);
        break;
      case schema.EventPushRequest:
        this.eventStream.enqueue(message);
        break;
      default:
        this.emit(bytesToHex(message.requestId), message);
    }
  }

  async #authenticate() {
    const response = await this.encodeAndSend(schema.AuthenticateRequest, {
      // slice(1) to remove 0x04 prefix
      publicKey: toBytes(this.keyCardWallet.publicKey).slice(1),
    });
    const sig = await this.keyCardWallet.signMessage({
      message: {
        raw: response.challenge,
      },
    });
    return this.encodeAndSend(schema.ChallengeSolvedRequest, {
      signature: toBytes(sig),
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
    const uploadURLResp = (await this.encodeAndSend(
      schema.GetBlobUploadURLRequest,
    )) as schema.GetBlobUploadURLResponse;
    if (uploadURLResp.error !== null) {
      throw new Error(
        `Failed to get blob upload URL: ${uploadURLResp.error!.message}`,
      );
    }
    const uploadResp = await fetch(uploadURLResp.url, {
      method: "POST",
      body: blob,
    });
    if (uploadResp.status !== 201) {
      console.log(uploadResp);
      throw new Error(
        `unexpected status: ${uploadResp.statusText} (${uploadResp.status})`,
      );
    }
    return uploadResp.json();
  }

  // null erc20Addr means vanilla ethererum is used
  async commitOrder(
    order: schema.ICommitItemsToOrderRequest,
  ): Promise<schema.CommitItemsToOrderResponse> {
    await this.connect();
    return this.encodeAndSend(schema.CommitItemsToOrderRequest, order);
  }
}

// testing helper
export async function discoverRelay(url: string): Promise<RelayEndpoint> {
  const discoveryURL = url
    .replace("ws", "http")
    .replace("/v2", "/testing/discovery");
  const testingResponse = await fetch(discoveryURL);
  const testingData = await testingResponse.json();
  return {
    url: new URL(url),
    tokenId: testingData.relay_token_id,
  };
}

// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: MIT
import { assert } from "@std/assert";
import { decodeCbor, encodeCbor } from "@std/cbor";
import {
  bytesToHex,
  hexToBigInt,
  hexToBytes,
  numberToBytes,
  recoverMessageAddress,
  stringToBytes,
} from "@wevm/viem";
import type { PrivateKeyAccount } from "@wevm/viem/accounts";
import { createSiweMessage } from "@wevm/viem/siwe";
import LockMap from "@nullradix/lockmap";
import * as v from "@valibot/valibot";
import type { ConcreteWalletClient } from "@massmarket/blockchain";
import schema, { EnvelopMessageTypes } from "@massmarket/schema";
import {
  SignedPatchSetSchema,
  type TPatchSet,
  type TRecoveredPatchSet,
  type TSignedPatchSet,
} from "@massmarket/schema/cbor";
import { decodeBufferToString, hexToBase64, logger } from "@massmarket/utils";

const debug = logger("relayClient");

export type RelayEndpoint = {
  url: URL; // the websocket URL to talk to
  tokenId: `0x${string}`;
};

export type EventId = {
  signer: `0x${string}`;
  nonce: number;
};

export function eventIdEqual(a: EventId, b: EventId) {
  return a.signer === b.signer && a.nonce === b.nonce;
}

export class RelayClient {
  connection!: WebSocket;
  private keyCardWallet: PrivateKeyAccount;
  public readonly relayEndpoint: RelayEndpoint;
  // TODO; we can use the subscription path for the id
  #subscriptions: Map<
    string,
    {
      id: Uint8Array;
      controllers: Set<ReadableStreamDefaultController<TRecoveredPatchSet>>;
    }
  > = new Map();
  private useTLS;
  private requestCounter;
  #waitingMessagesResponse: LockMap<string, schema.Envelope> = new LockMap();
  #isGuest: boolean = true;
  #shopId: bigint;

  constructor({
    relayEndpoint,
    keyCardWallet,
    isGuest,
    shopId,
  }: {
    relayEndpoint: RelayEndpoint;
    keyCardWallet: PrivateKeyAccount;
    //TODO: deprecate; the relay should know this
    isGuest: boolean;
    //TODO: move to the patchSet / stateManager
    shopId: bigint;
  }) {
    this.keyCardWallet = keyCardWallet;
    this.relayEndpoint = relayEndpoint;
    this.useTLS = relayEndpoint.url.protocol === "wss:" ||
      relayEndpoint.url.protocol === "https:";
    this.requestCounter = 1;
    this.#shopId = shopId;
    this.#isGuest = isGuest;
  }

  // TODO
  createSubscriptionStream(path: string, seqNum: number) {
    assert(path, "/");
    if (!this.#subscriptions.has(path)) {
      // TODO; promise returned here, handle
      this.createSubscription(path, seqNum);
    }
    let controller: ReadableStreamDefaultController<TRecoveredPatchSet>;
    return new ReadableStream({
      start: (c) => {
        controller = c;
        this.#subscriptions.get(path)?.controllers.add(controller);
      },
      cancel: () => {
        const cset = this.#subscriptions.get(path)!.controllers;
        cset.delete(controller);
        if (cset.size === 0) {
          this.#subscriptions.delete(path);
          this.cancelSubscriptionRequest(path);
        }
      },
    });
  }

  createWriteStream() {
    return new WritableStream<TPatchSet>({
      write: async (patch) => {
        // TODO: use embedded cbor, or COSE
        const payload = encodeCbor(patch.Header);
        const sig = await this.keyCardWallet.signMessage({
          message: { raw: payload },
        });
        const signedPatchSet: TSignedPatchSet = {
          Header: patch.Header,
          Patches: patch.Patches,
          Signature: hexToBytes(sig),
        };
        const encodedPatchSet = encodeCbor(signedPatchSet);
        const envelope = {
          patchSetWriteRequest: {
            patchSet: encodedPatchSet,
          },
        };
        await this.encodeAndSend(envelope);
      },
    });
  }

  // like encodeAndSend but doesn't wait for a response.
  encodeAndSendNoWait(envelope: schema.IEnvelope = {}): schema.RequestId {
    if (!envelope.requestId) {
      envelope.requestId = { raw: this.requestCounter };
    }
    const err = schema.Envelope.verify(envelope);
    if (err) {
      throw new Error(`unable to verify envelope: ${err}`);
    }
    // Turns json into binary
    const payload = schema.Envelope.encode(envelope).finish();
    this.connection.send(payload);
    const requestType =
      Object.keys(envelope).filter((k) => k !== "requestId")[0];
    debug(`network request ${requestType} sent id: ${envelope.requestId!.raw}`);
    this.requestCounter++;
    return schema.RequestId.create(envelope.requestId);
  }

  // encode and send a message and then wait for a response
  async encodeAndSend(
    envelope: schema.IEnvelope = {},
  ): Promise<schema.Envelope> {
    const id = this.encodeAndSendNoWait(envelope);
    const response = await this.#waitingMessagesResponse.get(
      id.raw.toString(),
    )!;
    const requestType =
      Object.keys(response).filter((k) => k !== "requestId")[0];

    if (response.response?.error) {
      const { code, message } = response.response.error;
      assert(code, "code is required");
      assert(message, "message is required");
      debug(
        `network request ${requestType} id: ${id.raw} failed with error[${code}]: ${message}`,
      );
      throw new Error(message);
    } else {
      debug(
        `network request ${requestType} id: ${id.raw} received response`,
      );
      return response;
    }
  }

  async #decodeMessage(me: MessageEvent) {
    const data = me.data instanceof Blob
      ? await new Response(me.data).arrayBuffer()
      : me.data;
    const payload = new Uint8Array(data);
    const envelope = schema.Envelope.decode(payload);
    assert(envelope.requestId?.raw, "requestId is required");
    const requestType =
      Object.keys(envelope).filter((k) => k !== "requestId")[0];
    debug(
      `network request ${requestType} id: ${envelope.requestId!.raw} received`,
    );
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
          envelope.subscriptionPushRequest.patches!.forEach(
            async (evt) => {
              const cborPatch = evt.patchData!;
              const patchSet = v.parse(
                SignedPatchSetSchema,
                decodeCbor(cborPatch),
              );
              const signer = await recoverMessageAddress({
                message: { raw: patchSet.Header.RootHash },
                signature: patchSet.Signature,
              });

              for (
                const controller of this.#subscriptions.get("/")!.controllers
              ) {
                controller.enqueue({
                  ...patchSet,
                  Signer: signer,
                });
              }
            },
          );
        }
        break;
      default:
        this.#waitingMessagesResponse.unlock(
          envelope.requestId.raw.toString(),
          envelope,
        );
    }
  }

  #handlePingRequest(ping: schema.Envelope) {
    // relay ends connection if ping is not responded to 3 times.
    this.encodeAndSendNoWait({
      requestId: ping.requestId,
      response: {},
    });
  }

  async createSubscription(path: string, seqNo = 0) {
    this.#subscriptions.set(path, {
      id: new Uint8Array(16),
      controllers: new Set(),
    });
    const filters = [
      { objectType: schema.ObjectType.OBJECT_TYPE_LISTING },
      { objectType: schema.ObjectType.OBJECT_TYPE_TAG },
      { objectType: schema.ObjectType.OBJECT_TYPE_ORDER },
      { objectType: schema.ObjectType.OBJECT_TYPE_ACCOUNT },
      { objectType: schema.ObjectType.OBJECT_TYPE_MANIFEST },
      ...this.#isGuest ? [] : [
        { objectType: schema.ObjectType.OBJECT_TYPE_INVENTORY },
      ],
    ];
    const { response } = await this.encodeAndSend({
      subscriptionRequest: {
        startShopSeqNo: seqNo,
        shopId: { raw: numberToBytes(this.#shopId) },
        filters,
      },
    });
    assert(response?.payload, "response.payload is required");
  }

  cancelSubscriptionRequest(path: string) {
    const subscriptionId = this.#subscriptions.get(path)?.id;
    this.#subscriptions.delete(path);
    return this.encodeAndSend({
      subscriptionCancelRequest: {
        subscriptionId,
      },
    });
  }

  async authenticate() {
    const { response } = await this.encodeAndSend({
      authRequest: {
        publicKey: {
          raw: hexToBytes(this.keyCardWallet.publicKey).slice(1),
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
        signature: { raw: hexToBytes(sig) },
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
    location?: URL,
  ) {
    const publicKey = hexToBytes(this.keyCardWallet.publicKey).slice(1);
    const endpointURL = new URL(this.relayEndpoint.url);
    endpointURL.protocol = this.useTLS ? "https" : "http";
    endpointURL.pathname += `/enroll_key_card`;
    endpointURL.search = `guest=${this.#isGuest ? 1 : 0}`;
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
        `mass-shopid:${this.#shopId}`,
        `mass-keycard:${bytesToHex(publicKey)}`,
      ],
    });
    const signature = await wallet.signMessage({
      message: { raw: stringToBytes(message) },
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

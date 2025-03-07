// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: MIT
import { assert } from "@std/assert";
import { decodeCbor, encodeCbor } from "@std/cbor";
import {
  type Account,
  type Hex,
  hexToBigInt,
  hexToBytes,
  numberToBytes,
  recoverMessageAddress,
  recoverPublicKey,
  type WalletClient,
} from "@wevm/viem";
import { parseAccount } from "@wevm/viem/accounts";
import { createSiweMessage } from "@wevm/viem/siwe";
import { hashMessage } from "@wevm/viem/utils";
import { ProjectivePoint } from "@noble/secp256k1";
import LockMap from "@nullradix/lockmap";
import * as v from "@valibot/valibot";
import schema, { EnvelopMessageTypes } from "@massmarket/schema";
import {
  SignedPatchSetSchema,
  type TPatchSet,
  type TRecoveredPatchSet,
  type TSignedPatchSet,
} from "@massmarket/schema/cbor";
import { decodeBufferToString, hexToBase64, logger } from "@massmarket/utils";

const debug = logger("relayClient");

export interface IRelayEndpoint {
  url: URL; // the websocket URL to talk to
  tokenId: `0x${string}`;
}

export interface IRelayClientOptions {
  relayEndpoint: IRelayEndpoint;
  walletClient: WalletClient;
  account: Hex | Account;
  //TODO: deprecate; the relay should know this
  isGuest: boolean;
  //TODO: move to the patchSet / stateManager
  shopId: bigint;
}

export class RelayClient {
  connection: WebSocket | null = null;
  walletClient: WalletClient;
  readonly account;
  readonly relayEndpoint;
  readonly ethAddress: Hex;
  readonly shopId;
  // TODO; we can use the subscription path for the id
  #subscriptions: Map<
    string,
    {
      id: Uint8Array;
      controllers: Set<ReadableStreamDefaultController<TRecoveredPatchSet>>;
    }
  > = new Map();
  #requestCounter;
  #waitingMessagesResponse: LockMap<string, schema.Envelope> = new LockMap();
  #isGuest: boolean = true;

  constructor(params: IRelayClientOptions) {
    this.walletClient = params.walletClient;
    this.relayEndpoint = params.relayEndpoint;
    this.shopId = params.shopId;
    this.#isGuest = params.isGuest;
    this.account = params.account;
    this.ethAddress = parseAccount(params.account).address;
    this.#requestCounter = 1;
  }

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
        const sig = await this.walletClient.signMessage({
          account: this.account,
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
      envelope.requestId = { raw: this.#requestCounter };
    }
    const err = schema.Envelope.verify(envelope);
    if (err) {
      throw new Error(`unable to verify envelope: ${err}`);
    }
    // Turns json into binary
    const payload = schema.Envelope.encode(envelope).finish();
    assert(this.connection);
    this.connection.send(payload);
    const requestType =
      Object.keys(envelope).filter((k) => k !== "requestId")[0];
    debug(`network request ${requestType} sent id: ${envelope.requestId!.raw}`);
    this.#requestCounter++;
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
                const controller of this.#subscriptions.get("/")?.controllers ??
                  []
              ) {
                controller.enqueue({
                  ...patchSet,
                  Signer: signer,
                });
              }
              // TODO: properly handle backpressure
              // we should implement `pull` for the read stream, in the pull we should request the next chunk
              this.encodeAndSendNoWait({
                requestId: envelope.requestId,
                response: {},
              });
            },
          );
        }
        break;
    }
    this.#waitingMessagesResponse.unlock(
      envelope.requestId!.raw!.toString(),
      envelope,
    );
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
    // TODO: remove
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
        shopId: { raw: numberToBytes(this.shopId) },
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
          // TODO: why are we slicing the bytes?
          raw: hexToBytes(this.ethAddress).slice(1),
        },
      },
    });
    assert(response?.payload, "response.payload is required");
    const sig = await this.walletClient.signMessage({
      account: this.account,
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
  connect(): Promise<Event> {
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
      if (this.connection!.readyState === WebSocket.OPEN) {
        resolve(new Event("already open"));
      } else {
        this.connection!.addEventListener("open", (evt: Event) => {
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
        this.connection!.readyState === WebSocket.CLOSED
      ) {
        resolve("already closed");
        return;
      }
      this.connection!.addEventListener("close", resolve);
      this.connection!.close(1000);
    });
  }

  async enrollKeycard(
    wallet: WalletClient,
    account: Hex | Account,
  ) {
    const parsedAccount = parseAccount(account);
    const address = parsedAccount.address;
    const publicKey = await getAccountPublicKey(
      this.walletClient,
      this.account,
    );
    const endpointURL = new URL(this.relayEndpoint.url);
    endpointURL.protocol = this.relayEndpoint.url.protocol === "wss"
      ? "https"
      : "http";
    endpointURL.pathname += `/enroll_key_card`;
    endpointURL.search = `guest=${this.#isGuest ? 1 : 0}`;

    const message = createSiweMessage({
      address,
      chainId: 1, // not really used
      domain: endpointURL.host,
      nonce: "00000000",
      uri: endpointURL.href,
      version: "1",
      resources: [
        `mass-relayid:${hexToBigInt(this.relayEndpoint.tokenId)}`,
        `mass-shopid:${this.shopId}`,
        // TODO: do we need to slice the bytes?
        `mass-keycard:${publicKey}`,
      ],
    });

    const signature = await wallet.signMessage({
      account: parsedAccount,
      message,
    });
    const body = JSON.stringify({
      message,
      signature: hexToBase64(signature),
    });
    return fetch(endpointURL.href, {
      method: "POST",
      body,
    });
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

async function getAccountPublicKey(
  wallet: WalletClient,
  account: Hex | Account,
): Promise<string> {
  const signature = await wallet.signMessage({
    account,
    message: "",
  });
  const hash = hashMessage("");
  const publicKey = await recoverPublicKey({ signature, hash });
  return ProjectivePoint.fromHex(publicKey.slice(2)).toHex();
}

// testing helper
export async function discoverRelay(url: string): Promise<IRelayEndpoint> {
  const discoveryURL = url
    .replace("ws", "http")
    .replace("/v4", "/testing/discovery");
  const testingResponse = await fetch(discoveryURL);
  const testingData = await testingResponse.json();
  return {
    url: new URL(url),
    tokenId: testingData.relay_token_id,
  };
}

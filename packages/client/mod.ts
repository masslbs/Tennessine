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
  PatchSchema,
  PatchSetHeaderSchema,
  type TPatch,
  type TPatchSetHeader,
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
  //TODO: make ID part of the path
  shopId: bigint;
  keyCardNonce?: number;
}

interface PushedPatchSet {
  signer: Hex;
  patches: TPatch[];
  header: TPatchSetHeader;
  sequence: number;
}

export class RelayClient {
  connection: WebSocket | null = null;
  walletClient: WalletClient;
  keyCardNonce: number;
  readonly account;
  readonly relayEndpoint;
  readonly ethAddress: Hex;
  readonly shopId;
  // TODO; we can use the subscription path for the id
  #subscriptions: Map<
    string,
    ReadableStreamDefaultController<PushedPatchSet>
  > = new Map();
  #requestCounter;
  #waitingMessagesResponse: LockMap<string, schema.Envelope> = new LockMap();
  #isGuest: boolean = true;

  constructor(params: IRelayClientOptions) {
    this.walletClient = params.walletClient;
    this.relayEndpoint = params.relayEndpoint;
    this.keyCardNonce = params.keyCardNonce ?? 0;
    this.shopId = params.shopId;
    this.#isGuest = params.isGuest;
    this.account = params.account;
    this.ethAddress = parseAccount(params.account).address;
    this.#requestCounter = 1;
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
    const { promise } = this.#waitingMessagesResponse.lock(
      id.raw.toString(),
    )!;
    const response = await promise;
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
          const subscriptionId = envelope
            .subscriptionPushRequest
            .subscriptionId!.toString();
          const controller = this.#subscriptions.get(subscriptionId);
          console.log("id", controller);
          assert(controller, "invalad subscription recv");

          try {
            for (const ppset of envelope.subscriptionPushRequest.sets!) {
              const dh = decodeCbor(ppset.header!);
              // @ts-ignore we will soon depracte pbjs
              const sequence = ppset!.shopSeqNo!.toNumber();
              const header = v.parse(PatchSetHeaderSchema, dh);
              const patches = ppset.patches!.map((patch) => {
                const decodedPatch = decodeCbor(patch);
                // console.log("patch", decodedPatch);
                return v.parse(PatchSchema, decodedPatch);
              });

              // This doesn't really need to be async
              // viem does an async import of @noble/secp256k1
              const signer = await recoverMessageAddress({
                message: { raw: ppset.header! },
                signature: ppset.signature!,
              });
              controller.enqueue({
                patches,
                header,
                signer,
                sequence,
              });
            }
          } catch (e) {
            controller.error(e);
          }
          // TODO: properly handle backpressure
          // we should implement `pull` for the read stream, in the pull we should request the next chunk
          this.encodeAndSendNoWait({
            requestId: envelope.requestId,
            response: {},
          });
        }
        break;
      default:
        this.#waitingMessagesResponse.unlock(
          envelope.requestId!.raw!.toString(),
          envelope,
        );
        break;
    }
  }

  #handlePingRequest(ping: schema.Envelope) {
    // relay ends connection if ping is not responded to 3 times.
    this.encodeAndSendNoWait({
      requestId: ping.requestId,
      response: {},
    });
  }

  async createSubscription(_path: string, seqNo = 0) {
    const { response } = await this.encodeAndSend({
      subscriptionRequest: {
        startShopSeqNo: seqNo,
        shopId: { raw: numberToBytes(this.shopId) },
      },
    });

    assert(response?.payload, "response.payload is required");
    return response;
  }

  // TODO implement sending reason
  cancelSubscriptionRequest(id: Uint8Array, _reason: unknown) {
    return this.encodeAndSend({
      subscriptionCancelRequest: {
        subscriptionId: id,
      },
    });
  }

  createSubscriptionStream(path: string, seqNum: number) {
    let id: Uint8Array;
    return new ReadableStream({
      start: async (c) => {
        const r = await this.createSubscription(path, seqNum);
        id = r.payload!;
        console.log("sub id", id);
        this.#subscriptions.set(id.toString(), c);
      },
      cancel: (reason) => {
        this.#subscriptions.delete(id.toString());
        this.cancelSubscriptionRequest(id, reason);
      },
    });
  }

  createWriteStream() {
    return new WritableStream<TPatch[]>({
      write: async (patches) => {
        const rootHash = await crypto.subtle.digest(
          "SHA-256",
          encodeCbor(patches),
        );
        const header: TPatchSetHeader = {
          KeyCardNonce: this.keyCardNonce++,
          Timestamp: new Date(),
          ShopID: this.shopId,
          RootHash: new Uint8Array(rootHash),
        };
        // TODO: use embedded cbor, or COSE
        const encodedHeader = encodeCbor(header);
        const sig = await this.walletClient.signMessage({
          account: this.account,
          message: { raw: encodedHeader },
        });
        const signedPatchSet: TSignedPatchSet = {
          Header: header,
          Patches: patches,
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

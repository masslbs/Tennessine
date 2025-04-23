// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: MIT
import { assert } from "@std/assert";
import {
  type Account,
  type Hex,
  hexToBigInt,
  hexToBytes,
  numberToBytes,
  pad,
  recoverMessageAddress,
  recoverPublicKey,
  type WalletClient,
} from "viem";
import { parseAccount } from "viem/accounts";
import { createSiweMessage } from "viem/siwe";
import { hashMessage } from "viem/utils";
import { ProjectivePoint } from "@noble/secp256k1";
import LockMap from "@nullradix/lockmap";
import schema, { EnvelopMessageTypes } from "@massmarket/schema";
import { decodeBufferToString, hexToBase64, logger } from "@massmarket/utils";
import {
  type CodecKey,
  type CodecValue,
  decode,
  encode,
  type Path,
} from "@massmarket/utils/codec";
import { ReadableStream, WritableStream } from "web-streams-polyfill";

const debug = logger("relayClient");
const errLog = logger("relayClient", "error");
const warnLog = logger("relayClient", "warn");

export interface IRelayEndpoint {
  url: URL; // the websocket URL to talk to
  tokenId: `0x${string}`;
}

export interface IRelayClientOptions {
  relayEndpoint: IRelayEndpoint;
  walletClient: WalletClient;
  keycard: Hex | Account;
  //TODO: make ID part of the path
  shopId: bigint;
  keyCardNonce?: number;
}

export type Patch =
  & {
    Path: CodecKey[];
  }
  & (
    | {
      Op: "add" | "replace" | "append";
      Value: CodecValue;
    }
    | {
      Op: "increment" | "decrement";
      Value: number;
    }
    | {
      Op: "remove";
    }
  );

export type PushedPatchSet = {
  signer: Hex;
  patches: Patch[];
  header: CodecValue;
  sequence: number;
};

export type SignedPatchSet = {
  Header: Map<string, CodecValue>;
  Patches: Map<string, CodecValue>[];
  Signature: Uint8Array;
};

export class RelayResponseError extends Error {
  constructor(
    cause: {
      message: string;
      id: unknown;
      requestType: string;
      code: number;
      additionalInfo?: {
        object_id: number | bigint;
      };
    },
  ) {
    super(
      `network request ${cause.requestType} id: ${cause.id} failed with error[${cause.code}]: ${cause.message}`,
    );
    Object.assign(this, cause);
  }
}

export class ClientWriteError extends Error {
  constructor(
    public originalError: Error,
    public patchSet: SignedPatchSet,
  ) {
    super(originalError.message);
  }
}

export class RelayClient {
  connection: WebSocket | null = null;
  keyCardNonce: number;
  private pingsReceived: number = 0;
  private lastPingReceived: Date = new Date(0);
  readonly walletClient: WalletClient;
  readonly keycard;
  readonly relayEndpoint;
  readonly shopId;
  // TODO; we can use the subscription path for the id
  #subscriptions: Map<string, ReadableStreamDefaultController<PushedPatchSet>> =
    new Map();
  #requestCounter;
  #waitingMessagesResponse: LockMap<string, schema.Envelope> = new LockMap();
  #initialAuthPromise = Promise.resolve(false);
  #authenticationPromise: Promise<boolean> = this.#initialAuthPromise;
  #isAuthenticated = false;

  constructor(params: IRelayClientOptions) {
    this.walletClient = params.walletClient;
    this.relayEndpoint = params.relayEndpoint;
    this.keyCardNonce = params.keyCardNonce ?? 0;
    this.shopId = params.shopId;
    this.keycard = params.keycard;
    this.#requestCounter = 1;
    this.#authenticationPromise = this.#initialAuthPromise;
    this.#isAuthenticated = false;
  }

  get stats() {
    return {
      pingsReceived: this.pingsReceived,
      lastPingReceived: this.lastPingReceived,
      subscriptions: this.#subscriptions.size,
      waitingMessagesResponse: this.#waitingMessagesResponse.size,
      requestCounter: this.#requestCounter,
    };
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
    assert(this.connection, "Connection is not established");
    this.connection.send(payload);
    const requestType =
      Object.keys(envelope).filter((k) => k !== "requestId")[0];
    const reqId = envelope.requestId!.raw;
    debug(` sent[${reqId}] ${requestType}`);
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
    debug(`recvt[${id.raw}] ${requestType}`);
    if (response.response?.error) {
      const { code, message, additionalInfo } = response.response.error;
      assert(code, "code is required");
      assert(message, "message is required");
      let unpackedExtraInfo: {
        object_id: number | bigint;
      } | undefined;
      if (additionalInfo && additionalInfo.objectId) {
        // TODO: pretty ugly Long > number conversion.
        unpackedExtraInfo = {
          object_id: Number(additionalInfo.objectId),
        };
      }
      throw new RelayResponseError(
        {
          id: id.raw,
          message,
          code,
          requestType,
          additionalInfo: unpackedExtraInfo,
        },
      );
    } else {
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
    const reqId = envelope.requestId!.raw;
    if (requestType === "response") {
      const isError = envelope.response?.error ? "error" : "okay";
      debug(`unbox[${reqId}] ${isError}`);
    } else if (requestType === "subscriptionPushRequest") {
      debug(`unbox[${reqId}] ${requestType}`);
    }

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
          if (!controller) {
            assert(
              controller,
              "invalid subscription recv. id: " + subscriptionId,
            );
            return;
          }
          const sets = envelope.subscriptionPushRequest.sets ?? [];
          debug(
            `unbox[${reqId}] subscriptionPushRequest[${subscriptionId}]. SetCount: ${sets.length}`,
          );
          try {
            for (const ppset of sets) {
              const header = decode(ppset.header!);
              const sequence = typeof ppset!.shopSeqNo! === "number"
                ? ppset!.shopSeqNo!
                : ppset!.shopSeqNo!.toNumber();
              const patches = ppset.patches!.map((patch) =>
                Object.fromEntries(
                  decode(patch) as Map<string, CodecValue>,
                ) as Patch
              );

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
    this.pingsReceived++;
    this.lastPingReceived = new Date();
  }

  async createSubscription(
    _path: Path,
    seqNo = 0,
    controller?: ReadableStreamDefaultController<PushedPatchSet>,
  ) {
    const { response } = await this.encodeAndSend({
      subscriptionRequest: {
        startShopSeqNo: seqNo,
        shopId: { raw: pad(numberToBytes(this.shopId)) },
      },
    });

    assert(response?.payload, "response.payload is required");
    if (controller) {
      const id = response.payload!;
      this.#subscriptions.set(id.toString(), controller);
      debug(`registered subscription[${id.toString()}]`);
    }
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

  createSubscriptionStream(path: Path, seqNum: number) {
    let id: Uint8Array;
    return new ReadableStream<PushedPatchSet>({
      start: async (c) => {
        await this.connect();
        const { payload } = await this.createSubscription(path, seqNum, c);
        id = payload!;
      },
      cancel: async (reason) => {
        this.#subscriptions.delete(id.toString());
        await this.cancelSubscriptionRequest(id, reason);
      },
    });
  }

  createWriteStream() {
    return new WritableStream<Patch[]>({
      // Why do we even need to authenticate here?
      start: async () => {
        await this.connect();
        await this.authenticate();
      },
      write: async (patches) => {
        const patch = new Map(Object.entries(patches[0]));
        // TODO: add MMR
        const rootHash = await crypto.subtle.digest(
          "SHA-256",
          encode(patch),
        );
        const header = new Map<string, CodecValue>([
          ["KeyCardNonce", ++this.keyCardNonce],
          ["Timestamp", new Date()],
          ["ShopID", this.shopId],
          ["RootHash", rootHash],
        ]);
        // TODO: use embedded cbor, or COSE
        const encodedHeader = encode(header);
        const sig = await this.walletClient.signMessage({
          account: this.keycard,
          message: { raw: encodedHeader },
        });
        const signedPatchSet = {
          Header: header,
          Patches: [patch],
          Signature: hexToBytes(sig),
        };
        const encodedPatchSet = encode(new Map(Object.entries(signedPatchSet)));
        const envelope = {
          patchSetWriteRequest: {
            patchSet: encodedPatchSet,
          },
        };
        try {
          await this.encodeAndSend(envelope);
        } catch (error: unknown) {
          if (error instanceof Error) {
            throw new ClientWriteError(error, signedPatchSet);
          } else {
            throw error;
          }
        }
      },
    });
  }

  // TODO: this is a bit of a mess.
  // What these promises are trying to achieve would usually be a mutex/lock,
  // to make sure we are not running multiple authentication attempts at the same time.
  async authenticate(): Promise<boolean> {
    // 1. Already authenticated? Return true.
    if (this.#isAuthenticated) {
      return true;
    }

    // 2. Authentication already in progress? Wait for it.
    // Grab the promise *before* potentially creating a new one.
    const currentAuthAttempt = this.#authenticationPromise;
    if (currentAuthAttempt !== this.#initialAuthPromise) {
      // An attempt is/was in progress. Wait for it.
      try {
        await currentAuthAttempt;
        // If it succeeded, #isAuthenticated should now be true.
        // If it failed, an error is thrown.
        return this.#isAuthenticated; // Return the final state
      } catch (_error) {
        // The ongoing attempt failed. The state should have been reset
        // by the catch block of that attempt. We fall through to retry.
        // Ensure state is reset if the original call didn't handle it properly.
        if (this.#authenticationPromise === currentAuthAttempt) {
          this.#authenticationPromise = this.#initialAuthPromise;
          this.#isAuthenticated = false;
        }
      }
    }
    // Check again if authentication succeeded while waiting
    if (this.#isAuthenticated) {
      return true;
    }

    // 3. No authentication in progress, or previous attempt failed. Start a new one.
    const { promise, resolve, reject } = Promise.withResolvers<boolean>();
    // IMPORTANT: Set the shared promise *before* the first await
    this.#authenticationPromise = promise;

    try {
      // Perform authentication process
      const publicKey = await getAccountPublicKey(
        this.walletClient,
        this.keycard,
      );

      // Use a bypass function for auth requests to avoid potential recursive auth checks
      // within encodeAndSend if it calls authenticate itself.
      const authRequestFunction = async (env: schema.IEnvelope) => {
        const id = this.encodeAndSendNoWait(env);
        const { promise: waitPromise } = this.#waitingMessagesResponse.lock(
          id.raw.toString(),
        )!;
        // Ensure the lock exists before awaiting
        assert(waitPromise, `Lock not found for request ID: ${id.raw}`);
        return await waitPromise;
      };

      const { response: authResponse } = await authRequestFunction({
        authRequest: {
          publicKey: {
            raw: hexToBytes(`0x${publicKey}`),
          },
        },
      });

      // either authResponse.payload or authResponse.error is required
      if (!authResponse?.payload) {
        assert(
          authResponse?.error,
          "Authentication response error is required",
        );
        const { code, message } = authResponse.error;
        assert(code, "error.code is required");
        assert(message, "error.message is required");
        throw new Error(`Authentication failed with code: ${code}: ${message}`);
      }

      const sig = await this.walletClient.signMessage({
        account: this.keycard,
        message: {
          raw: authResponse.payload,
        },
      });

      await authRequestFunction({
        challengeSolutionRequest: {
          signature: { raw: hexToBytes(sig) },
        },
      });

      // Mark as authenticated
      this.#isAuthenticated = true;
      resolve(true); // Resolve the promise we created
      return true;
    } catch (error) {
      // Mark as not authenticated
      this.#isAuthenticated = false;
      // Reset the main promise *only if* it's still our promise.
      // This prevents a late failure from overwriting a newer attempt's promise.
      if (this.#authenticationPromise === promise) {
        this.#authenticationPromise = this.#initialAuthPromise;
      }
      reject(error); // Reject the promise we created
      throw error; // Rethrow
    }
  }

  connect(onError?: (error: Event) => void): Promise<Event> {
    if (
      !this.connection ||
      this.connection.readyState === WebSocket.CLOSING ||
      this.connection.readyState === WebSocket.CLOSED
    ) {
      this.connection = new WebSocket(this.relayEndpoint.url + "/sessions");

      // Reset authentication state when creating a new connection
      this.#isAuthenticated = false;
      this.#authenticationPromise = this.#initialAuthPromise; // Use the initial promise instance

      this.connection.addEventListener(
        "error",
        onError ? onError : (errEv: Event) => {
          assert(errEv instanceof ErrorEvent, "error event is required");
          const error = new Error(errEv.message);
          error.name = errEv.error?.name ?? "WebSocketError";
          errLog("WebSocket error!", error);
        },
      );

      this.connection.addEventListener(
        "close",
        (ev: CloseEvent) => {
          if (!ev.wasClean) {
            warnLog("WebSocket closed uncleanly");
          }
          this.#isAuthenticated = false;
          this.#authenticationPromise = this.#initialAuthPromise;
          this.connection = null;
        },
      );

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
          debug("WebSocket opened");
          // TODO: unbox event to concrete values
          resolve(evt);
        });
      }
    });
  }

  disconnect(): Promise<CloseEvent | string> {
    return new Promise((resolve) => {
      if (
        !this.connection || // Check if connection exists before accessing readyState
        this.connection.readyState === WebSocket.CLOSED
      ) {
        resolve("already closed");
        return;
      }
      // Add listener before closing
      this.connection.addEventListener("close", (event) => {
        // Reset authentication state on disconnect
        this.#isAuthenticated = false;
        this.#authenticationPromise = this.#initialAuthPromise; // Use the initial promise instance
        resolve(event); // Resolve with the close event
      });
      // Handle cases where close might happen before listener is added (less likely but possible)
      if (
        this.connection.readyState === WebSocket.CLOSING ||
        this.connection.readyState === WebSocket.CLOSED
      ) {
        // If already closing/closed after check but before listener, resolve immediately after resetting state
        this.#isAuthenticated = false;
        this.#authenticationPromise = this.#initialAuthPromise;
        resolve("closed before listener attached");
        return;
      }

      this.connection.close(1000);
      // State reset now happens in the 'close' event listener
    });
  }

  async enrollKeycard(
    wallet: WalletClient,
    account: Hex | Account,
    isGuest: boolean = true,
    location?: URL,
  ) {
    const parsedAccount = parseAccount(account);
    const address = parsedAccount.address;
    const publicKey = await getAccountPublicKey(
      this.walletClient,
      this.keycard,
    );
    const endpointURL = new URL(this.relayEndpoint.url);
    endpointURL.protocol = this.relayEndpoint.url.protocol.includes("wss")
      ? "https"
      : "http";
    endpointURL.pathname += `/enroll_key_card`;
    endpointURL.search = `guest=${isGuest ? 1 : 0}`;
    const signInURL: URL = location ?? endpointURL;

    const message = createSiweMessage({
      address,
      chainId: 1, // not really used
      domain: signInURL.host,
      nonce: "00000000",
      uri: signInURL.href,
      version: "1",
      resources: [
        `mass-relayid:${hexToBigInt(this.relayEndpoint.tokenId)}`,
        `mass-shopid:${this.shopId}`,
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
    await this.authenticate();
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

/**
 * Get the public key of an account. We have to sign then recover the public key,
 * because the eth rpc doesn't have a method to get the public key of an account.
 */
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

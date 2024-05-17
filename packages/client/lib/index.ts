// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: MIT

import { WebSocket } from "isows";

import {
  bytesToHex,
  hexToBytes,
  toBytes,
  Address,
  type WalletClient,
  type Transport,
  type Account,
  type Chain,
} from "viem";

import { privateKeyToAccount, PrivateKeyAccount } from "viem/accounts";
import { hardhat } from "viem/chains";
import type { TypedData } from "abitype";
import { EventEmitter } from "events";
import { market } from "./protobuf/compiled";
import mmproto = market.mass;
import {
  PBObject,
  PBMessage,
  PBInstance,
  MESSAGE_TYPES,
  MESSAGE_PREFIXES,
} from "./protobuf/constants";
import * as abi from "@massmarket/contracts";

export const ManifestField = mmproto.UpdateManifest.ManifestField;
const UpdateItemField = mmproto.UpdateItem.ItemField;

export type WalletClientWithAccount = WalletClient<
  Transport,
  Chain,
  Account
> & {
  account: Account;
};

export type ClientArgs = {
  relayEndpoint: string;
  keyCardWallet: PrivateKeyAccount;
  storeId: `0x${string}`;
  chain: Chain;
  keyCardEnrolled: boolean;
};

function randomBytes(n: number) {
  const b = new Uint8Array(n);
  crypto.getRandomValues(b);
  return b;
}

function convertFirstCharToLowerCase(str: string) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

function snakeToCamel(str: string) {
  return str.replace(/_([a-z])/g, (match, letter) => `${letter.toUpperCase()}`);
}

function camelToSnake(str: string) {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function formatArray(array: Uint8Array[] | number[]) {
  if (typeof array[0] === "number") {
    return array.map((num) => BigInt(num as number));
  } else {
    return array.map((m) => bytesToHex(m as Uint8Array));
  }
}

// TODO: there are a lot of assumptions backed in here that should be commented
function formatMessageForSigning(
  obj: Record<string, Uint8Array | string | number | Uint8Array[] | number[]>,
) {
  const snakeCase: Record<
    string,
    string | `0x${string}`[] | BigInt | BigInt[]
  > = {};
  for (const [key, value] of Object.entries(obj)) {
    // TODO: Refactor this. Nested ternary operators are hard to read and a nightmare to change.
    snakeCase[camelToSnake(key)] = Array.isArray(value)
      ? formatArray(value)
      : typeof value === "string"
        ? value
        : typeof value === "number"
          ? BigInt(value)
          : bytesToHex(value);
  }
  return snakeCase;
}

export class RelayClient extends EventEmitter {
  connection!: WebSocket;
  storeId!: `0x${string}`;
  chain;
  keyCardWallet;
  endpoint;
  useTLS: boolean;
  DOMAIN_SEPARATOR;
  firstEvent: mmproto.EventPushResponse | null;
  keyCardEnrolled: boolean;
  constructor({
    relayEndpoint,
    keyCardWallet,
    chain = hardhat,
    storeId,
    keyCardEnrolled,
  }: ClientArgs) {
    super();
    this.keyCardWallet = keyCardWallet;
    this.endpoint = relayEndpoint;
    this.useTLS = relayEndpoint.startsWith("wss");
    this.chain = chain;
    this.storeId = storeId;
    this.DOMAIN_SEPARATOR = {
      name: "MassMarket",
      version: "1",
      chainId: this.chain.id,
      verifyingContract: abi.addresses.StoreReg as Address,
    };
    this.firstEvent = null;
    this.keyCardEnrolled = keyCardEnrolled;
  }

  #handlePingRequest(ping: mmproto.PingRequest) {
    const pr = mmproto.PingResponse.encode({
      requestId: ping.requestId,
    }).finish();

    const typedPr = new Uint8Array(pr.length + 1);
    typedPr[0] = 2;
    typedPr.set(pr, 1);
    this.connection.send(typedPr);
  }

  encodeAndSend(
    encoder: PBMessage,
    object: PBObject = {},
  ): Promise<PBInstance> {
    if (!object.requestId) {
      object.requestId = RelayClient.requestId();
    }
    const id = object.requestId;
    const payload = encoder.encode(object).finish();
    const typed = new Uint8Array(payload.length + 1);
    typed[0] = MESSAGE_TYPES.get(encoder) as number;
    typed.set(payload, 1);
    console.log(`[send] reqId=${bytesToHex(id)} typeCode=${typed[0]}`);
    this.connection.send(typed);

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
      case mmproto.PingRequest:
        this.#handlePingRequest(message);
        break;
      case mmproto.EventPushRequest:
        // TODO: add signature verification
        this.emit("event", message as mmproto.EventPushRequest);
        break;
      default:
        this.emit(bytesToHex(message.requestId), message);
    }
  }

  createEventStream() {
    let requestId: Uint8Array | null = null;
    const parentInstance = this;
    let enqueueFn: any;
    const enqueueWrapperFn = (controller: any) => {
      return (enqueueFn = (event: any) => {
        requestId = event.requestId;
        controller.enqueue(event);
      });
    };

    return new ReadableStream(
      {
        start(controller) {
          try {
            if (parentInstance.firstEvent) {
              requestId = parentInstance.firstEvent.requestId;
              controller.enqueue(parentInstance.firstEvent);
              parentInstance.firstEvent = null;
            }
            parentInstance.on("event", enqueueWrapperFn(controller));
          } catch (error) {
            console.log({ error });
          }
        },
        pull() {
          if (requestId) {
            parentInstance.encodeAndSend(mmproto.EventPushResponse, {
              requestId,
            });
          }
        },
        cancel() {
          parentInstance.removeListener("event", enqueueFn);
        },
      },
      { highWaterMark: 0 },
    );
  }
  // TODO: there are a lot of assumptions backed in here that should be commented
  // for eG why isnt this used in enrollKeycard
  #signTypedDataMessage(
    types: TypedData,
    message: Record<
      string,
      Uint8Array | string | number | Uint8Array[] | number[]
    >,
  ) {
    return this.keyCardWallet.signTypedData({
      types,
      primaryType: Object.keys(types)[0],
      domain: this.DOMAIN_SEPARATOR,
      message: formatMessageForSigning(message),
    });
  }

  // TODO: there are a lot of assumptions backed in here that should be commented
  async #signAndSendEvent(
    types: any,
    message: Record<
      string,
      Uint8Array | string | number | Uint8Array[] | number[]
    >,
  ) {
    const sig = await this.#signTypedDataMessage(types, message);
    let key = convertFirstCharToLowerCase(Object.keys(types)[0]);
    const eventRequest = {
      event: {
        signature: hexToBytes(sig),
        [key]: message,
      },
    };
    return this.encodeAndSend(mmproto.EventWriteRequest, eventRequest);
  }
  async #authenticate() {
    const response = (await this.encodeAndSend(mmproto.AuthenticateRequest, {
      publicKey: toBytes(this.keyCardWallet.publicKey).slice(1),
    })) as mmproto.AuthenticateResponse;
    const types = {
      Challenge: [{ name: "challenge", type: "string" }],
    };
    const sig = await this.#signTypedDataMessage(types, {
      challenge: bytesToHex(response.challenge).slice(2),
    });
    return this.encodeAndSend(mmproto.ChallengeSolvedRequest, {
      signature: toBytes(sig),
    });
  }
  async connect(): Promise<
    void | Event | mmproto.ChallengeSolvedResponse | string
  > {
    if (
      !this.connection ||
      this.connection.readyState === WebSocket.CLOSING ||
      this.connection.readyState === WebSocket.CLOSED
    ) {
      this.connection = new WebSocket(this.endpoint + "/sessions");
      this.connection.addEventListener("error", (error: Event) => {
        console.error(`WebSocket error: ${error}`);
      });
      this.connection.addEventListener(
        "message",
        this.#decodeMessage.bind(this),
      );
    }
    return new Promise((resolve, reject) => {
      if (this.connection.readyState === WebSocket.OPEN) {
        resolve();
      } else {
        this.connection.addEventListener("open", async () => {
          console.log("ws open");
          if (this.keyCardEnrolled) {
            const res = await this.#authenticate();
            if (res) {
              console.log("authentication success");
              resolve(res);
            } else {
              console.log("authentication failed");
              reject(res);
            }
          } else {
            resolve("ws connected without authentication");
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

  async enrollKeycard(wallet: WalletClientWithAccount) {
    const publicKey = toBytes(this.keyCardWallet.publicKey).slice(1);

    const types = {
      Enrollment: [{ name: "keyCard", type: "string" }],
    };
    const message = {
      keyCard: Buffer.from(publicKey).toString("hex"),
    };
    // formatMessageForSigning(message); will turn keyCard into key_card
    // const sig = await this.#signTypedDataMessage(types, message);
    const signature = await wallet.signTypedData({
      types,
      domain: this.DOMAIN_SEPARATOR,
      primaryType: "Enrollment",
      message,
    });
    const body = JSON.stringify({
      key_card: Buffer.from(publicKey).toString("base64"),
      signature: RelayClient.hexToBase64(signature),
      store_token_id: RelayClient.hexToBase64(this.storeId),
    });
    const endpointURL = new URL(this.endpoint);
    endpointURL.protocol = this.useTLS ? "https" : "http";
    endpointURL.pathname += "/enroll_key_card";
    console.log(`posting to ${endpointURL.href}`);
    const response = await fetch(endpointURL.href, {
      method: "POST",
      body,
    });
    if (response.ok) {
      this.keyCardEnrolled = true;
    }
    return response;
  }

  async createStore(
    id: `0x${string}` = bytesToHex(RelayClient.eventId()),
    wallet: WalletClientWithAccount,
  ) {
    const r = await wallet.writeContract({
      address: abi.addresses.StoreReg as Address,
      abi: abi.StoreReg,
      functionName: "mint",
      args: [BigInt(id), wallet.account.address],
    });
    this.storeId = id;
    return r;
  }

  async createInviteSecret(wallet: WalletClientWithAccount) {
    if (!this.storeId)
      throw new Error("A store ID is needed before creating an invite");
    const privateKey = bytesToHex(randomBytes(32)) as `0x${string}`;
    const token = privateKeyToAccount(privateKey);
    // Save the public key onchain
    await wallet.writeContract({
      address: abi.addresses.StoreReg as Address,
      abi: abi.StoreReg,
      functionName: "publishInviteVerifier",
      args: [BigInt(this.storeId), token.address],
    });
    return privateKey;
  }

  async redeemInviteSecret(
    secret: `0x${string}`,
    wallet: WalletClientWithAccount,
  ) {
    if (!this.storeId)
      throw new Error("A store ID is need before creating an invite");
    const message = "enrolling:" + wallet.account.address.toLowerCase();
    const tokenAccount = privateKeyToAccount(secret);
    const sig = await tokenAccount.signMessage({
      message,
    });
    const sigBytes = hexToBytes(sig);
    const v = sigBytes[64];
    const r = bytesToHex(sigBytes.slice(0, 32));
    const s = bytesToHex(sigBytes.slice(32, 64));
    return wallet.writeContract({
      address: abi.addresses.StoreReg as Address,
      abi: abi.StoreReg,
      functionName: "redeemInvite",
      args: [BigInt(this.storeId), v, r, s, wallet.account.address],
    });
  }

  async uploadBlob(blob: FormData) {
    await this.connect();
    const response = (await this.encodeAndSend(
      mmproto.GetBlobUploadURLRequest,
    )) as mmproto.GetBlobUploadURLResponse;
    const ipfsHash = await fetch(response.url, {
      method: "POST",
      body: blob,
    });
    return ipfsHash.json();
  }

  async writeStoreManifest(
    publishedTagId: `0x${string}` | null = null,
  ): Promise<mmproto.EventWriteResponse> {
    await this.connect();
    let pId = RelayClient.eventId();
    if (publishedTagId) {
      pId = hexToBytes(publishedTagId);
    }
    const storeManifest = {
      eventId: RelayClient.eventId(),
      storeTokenId: hexToBytes(this.storeId),
      domain: "socks.mass.market",
      publishedTagId: pId,
    };

    const types = {
      StoreManifest: [
        {
          name: "event_id",
          type: "bytes32",
        },
        {
          name: "store_token_id",
          type: "bytes32",
        },
        {
          name: "domain",
          type: "string",
        },
        {
          name: "published_tag_id",
          type: "bytes32",
        },
      ],
    };

    return this.#signAndSendEvent(
      types,
      storeManifest,
    ) as Promise<mmproto.EventWriteResponse>;
  }

  async createItem(
    price: string,
    metadata: { name: string; description: string; image: string },
  ) {
    await this.connect();
    const jsonString = JSON.stringify(metadata);
    const encoder = new TextEncoder();
    const utf8Encoded = encoder.encode(jsonString);
    const iid = RelayClient.eventId();
    const item = {
      eventId: iid,
      price: price,
      metadata: utf8Encoded,
    };
    const types = {
      CreateItem: [
        {
          name: "event_id",
          type: "bytes32",
        },
        {
          name: "price",
          type: "string",
        },
        {
          name: "metadata",
          type: "bytes",
        },
      ],
    };
    await this.#signAndSendEvent(types, item);
    return bytesToHex(iid);
  }

  async updateItem(
    itemId: `0x${string}`,
    field: mmproto.UpdateItem.ItemField,
    value: any,
  ) {
    await this.connect();

    const fieldMap = new Map([
      [UpdateItemField.ITEM_FIELD_PRICE, { name: "price", type: "string" }],
      [
        UpdateItemField.ITEM_FIELD_METADATA,
        { name: "metadata", type: "bytes" },
      ],
    ]);

    const fieldType = fieldMap.get(field)?.name as string;
    const getValue = () => {
      if (field === UpdateItemField.ITEM_FIELD_METADATA) {
        const jsonString = JSON.stringify(value);
        const encoder = new TextEncoder();
        const utf8Encoded = encoder.encode(jsonString);
        return utf8Encoded;
      } else {
        return value;
      }
    };
    const update = {
      eventId: RelayClient.eventId(),
      itemId: hexToBytes(itemId),
      field: field as number,
      [fieldType]: getValue(),
    };

    const types = {
      UpdateItem: [
        {
          name: "event_id",
          type: "bytes32",
        },
        {
          name: "item_id",
          type: "bytes32",
        },
        {
          name: "field",
          type: "int256",
        },
        fieldMap.get(field),
      ],
    };

    return this.#signAndSendEvent(types, update);
  }

  async updateManifest(
    field: mmproto.UpdateManifest.ManifestField,
    value: string,
  ) {
    await this.connect();
    const fieldMap = new Map([
      [
        ManifestField.MANIFEST_FIELD_DOMAIN,
        {
          name: "string",
          type: "string",
        },
      ],
      [
        ManifestField.MANIFEST_FIELD_PUBLISHED_TAG,
        {
          name: "tag_id",
          type: "bytes32",
        },
      ],
      [
        ManifestField.MANIFEST_FIELD_ADD_ERC20,
        {
          name: "erc20_addr",
          type: "address",
        },
      ],
      [
        ManifestField.MANIFEST_FIELD_REMOVE_ERC20,
        {
          name: "erc20_addr",
          type: "address",
        },
      ],
    ]);

    const fieldType = fieldMap.get(field)?.name as string;
    const manifest = {
      eventId: RelayClient.eventId(),
      field: field as number,
      [snakeToCamel(fieldType)]:
        field === ManifestField.MANIFEST_FIELD_DOMAIN
          ? value
          : hexToBytes(value as `0x${string}`),
    };

    const types = {
      UpdateManifest: [
        {
          name: "event_id",
          type: "bytes32",
        },
        {
          name: "field",
          type: "int256",
        },
        fieldMap.get(field),
      ],
    };

    return this.#signAndSendEvent(types, manifest);
  }

  async createTag(name: string) {
    await this.connect();
    const tagId = RelayClient.eventId();
    const tag = {
      eventId: tagId,
      name: name,
    };

    const types = {
      CreateTag: [
        {
          name: "event_id",
          type: "bytes32",
        },
        {
          name: "name",
          type: "string",
        },
      ],
    };
    await this.#signAndSendEvent(types, tag);
    return bytesToHex(tagId);
  }

  async addItemToTag(tagId: `0x${string}`, itemId: `0x${string}`) {
    await this.connect();
    const tag = {
      eventId: RelayClient.eventId(),
      tagId: hexToBytes(tagId),
      itemId: hexToBytes(itemId),
    };

    const types = {
      AddToTag: [
        {
          name: "event_id",
          type: "bytes32",
        },
        {
          name: "tag_id",
          type: "bytes32",
        },
        {
          name: "item_id",
          type: "bytes32",
        },
      ],
    };
    return this.#signAndSendEvent(types, tag);
  }

  async removeFromTag(tagId: `0x${string}`, itemId: `0x${string}`) {
    await this.connect();
    const tag = {
      eventId: RelayClient.eventId(),
      tagId: hexToBytes(tagId),
      itemId: hexToBytes(itemId),
    };

    const types = {
      RemoveFromTag: [
        {
          name: "event_id",
          type: "bytes32",
        },
        {
          name: "tag_id",
          type: "bytes32",
        },
        {
          name: "item_id",
          type: "bytes32",
        },
      ],
    };
    return this.#signAndSendEvent(types, tag);
  }
  async abandonCart(cartId: `0x${string}`) {
    await this.connect();

    const cart = {
      eventId: RelayClient.eventId(),
      cartId: hexToBytes(cartId),
    };

    const types = {
      CartAbandoned: [
        {
          name: "event_id",
          type: "bytes32",
        },
        { name: "cart_id", type: "bytes32" },
      ],
    };

    return await this.#signAndSendEvent(types, cart);
  }

  async createCart() {
    await this.connect();
    const reqId = RelayClient.eventId();
    const cart = {
      eventId: reqId,
    };

    const types = {
      CreateCart: [
        {
          name: "event_id",
          type: "bytes32",
        },
      ],
    };

    await this.#signAndSendEvent(types, cart);
    return bytesToHex(reqId);
  }

  async changeCart(
    cartId: `0x${string}`,
    itemId: `0x${string}`,
    quantity: number,
  ) {
    await this.connect();

    const cart = {
      eventId: RelayClient.eventId(),
      cartId: hexToBytes(cartId),
      itemId: hexToBytes(itemId),
      quantity,
    };

    const types = {
      ChangeCart: [
        {
          name: "event_id",
          type: "bytes32",
        },
        {
          name: "cart_id",
          type: "bytes32",
        },
        {
          name: "item_id",
          type: "bytes32",
        },
        {
          name: "quantity",
          type: "int32",
        },
      ],
    };

    return this.#signAndSendEvent(types, cart);
  }

  // null erc20Addr means vanilla ethererum is used
  async commitCart(
    cartId: `0x${string}`,
    erc20Addr: `0x${string}` | null = null,
  ): Promise<mmproto.CommitCartResponse> {
    let addrBytes: Uint8Array | null = null;
    if (erc20Addr) {
      addrBytes = hexToBytes(erc20Addr);
      if (addrBytes.length !== 20) {
        return Promise.reject(new Error("erc20Addr must be 20 bytes"));
      }
    }
    await this.connect();
    return this.encodeAndSend(mmproto.CommitCartRequest, {
      cartId: hexToBytes(cartId),
      erc20Addr: addrBytes,
    }) as Promise<mmproto.CommitCartResponse>;
  }

  async changeStock(itemIds: `0x${string}`[], diffs: number[]) {
    await this.connect();
    const stock = {
      eventId: RelayClient.eventId(),
      itemIds: itemIds.map((d) => hexToBytes(d)),
      diffs: diffs,
    };

    const types = {
      ChangeStock: [
        {
          name: "event_id",
          type: "bytes32",
        },
        {
          name: "item_ids",
          type: "bytes32[]",
        },
        {
          name: "diffs",
          type: "int32[]",
        },
      ],
    };
    return this.#signAndSendEvent(types, stock);
  }

  getRandomStoreId() {
    return bytesToHex(randomBytes(32));
  }

  static generatePk() {
    return bytesToHex(randomBytes(32));
  }

  static hexToBase64(hex: string) {
    const u8 = new Uint8Array(toBytes(hex));
    return Buffer.from(u8).toString("base64");
  }

  static requestId() {
    return randomBytes(16);
  }

  static eventId() {
    return randomBytes(32);
  }
}

// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: MIT

import { WebSocket } from "isows";
import {
  bytesToHex,
  hexToBytes,
  toBytes,
  Address,
  recoverTypedDataAddress,
  type WalletClient,
  type Transport,
  type Account,
  type Chain,
} from "viem";
import { EventEmitter } from "events";
import { PrivateKeyAccount } from "viem/accounts";
import { hardhat } from "viem/chains";
import type { TypedData } from "abitype";
import pb from "./protobuf/compiled.js";
/* eslint no-undef: "off" */
import mmproto = pb.market.mass;
import {
  PBObject,
  PBMessage,
  PBInstance,
  MESSAGE_TYPES,
  MESSAGE_PREFIXES,
} from "./protobuf/constants.js";
import { BlockchainClient } from "./blockchainClient.js";
import { ReadableEventStream } from "./stream.js";
import {
  formatMessageForSigning,
  requestId,
  eventId,
  hexToBase64,
  convertFirstCharToLowerCase,
  snakeToCamel,
  type NetworkMessage,
} from "./utils.js";
import * as abi from "@massmarket/contracts";

export type WalletClientWithAccount = WalletClient<
  Transport,
  Chain,
  Account
> & {
  account: Account;
};

export class RelayClient extends EventEmitter {
  connection!: WebSocket;
  private chain;
  blockchain: BlockchainClient;
  private keyCardWallet;
  private endpoint;
  private useTLS: boolean;
  private DOMAIN_SEPARATOR;
  keyCardEnrolled: boolean;
  private eventStream;

  constructor({
    relayEndpoint,
    keyCardWallet,
    chain = hardhat,
    keyCardEnrolled,
    shopId,
  }: {
    relayEndpoint: string;
    keyCardWallet: PrivateKeyAccount;
    chain: Chain;
    keyCardEnrolled: boolean;
    shopId: `0x${string}` | undefined;
  }) {
    super();
    this.blockchain = new BlockchainClient(shopId);
    this.keyCardWallet = keyCardWallet;
    this.endpoint = relayEndpoint;
    this.useTLS = relayEndpoint.startsWith("wss");
    this.chain = chain;
    this.DOMAIN_SEPARATOR = {
      name: "MassMarket",
      version: "1",
      chainId: this.chain.id,
      verifyingContract: abi.addresses.ShopReg as Address,
    };
    this.keyCardEnrolled = keyCardEnrolled;
    this.eventStream = new ReadableEventStream(this);
  }

  createEventStream() {
    return this.eventStream.stream;
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
      object.requestId = requestId();
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
        this.eventStream.enqueue(message as mmproto.EventPushRequest);
        break;
      default:
        this.emit(bytesToHex(message.requestId), message);
    }
  }

  // TODO: there are a lot of assumptions baked in here that should be commented
  // for eG why isnt this used in enrollKeycard
  #signTypedDataMessage(types: TypedData, message: NetworkMessage) {
    return this.keyCardWallet.signTypedData({
      types,
      primaryType: Object.keys(types)[0],
      domain: this.DOMAIN_SEPARATOR,
      message: formatMessageForSigning(message),
    });
  }

  // TODO: there are a lot of assumptions baked in here that should be commented
  async #signAndSendShopEvent(types: TypedData, message: NetworkMessage) {
    const sig = await this.#signTypedDataMessage(types, message);
    let key = convertFirstCharToLowerCase(Object.keys(types)[0]);
    const event = {
      signature: hexToBytes(sig),
      [key]: message,
    };
    const write = {
      event: {
        type_url: "type.googleapis.com/market.mass.ShopEvent",
        value: mmproto.ShopEvent.encode(event).finish(),
      },
    };
    return this.encodeAndSend(mmproto.EventWriteRequest, write);
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

  // TODO: implement for other types
  async recoverSignedAddress(orderId: `0x${string}`, signature: `0x${string}`) {
    const types = {
      CreateOrder: [
        {
          name: "event_id",
          type: "bytes32",
        },
      ],
    };
    const address = await recoverTypedDataAddress({
      domain: this.DOMAIN_SEPARATOR,
      types,
      primaryType: "CreateOrder",
      message: {
        event_id: orderId,
      },
      signature,
    });
    return address;
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
      signature: hexToBase64(signature),
      shop_token_id: hexToBase64(this.blockchain.shopId),
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

  async uploadBlob(blob: FormData) {
    await this.connect();
    const uploadURLResp = (await this.encodeAndSend(
      mmproto.GetBlobUploadURLRequest,
    )) as mmproto.GetBlobUploadURLResponse;
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

  async writeShopManifest(
    name: string,
    description: string,
    profilePictureUrl: string,
    publishedTagId: `0x${string}` | null = null,
  ): Promise<mmproto.EventWriteResponse> {
    await this.connect();
    let pId = eventId();
    if (publishedTagId) {
      pId = hexToBytes(publishedTagId);
    }
    const shopManifest = {
      eventId: eventId(),
      shopTokenId: hexToBytes(this.blockchain.shopId),
      domain: "socks.mass.market",
      publishedTagId: pId,
      name,
      description,
      profilePictureUrl,
    };

    const types = {
      ShopManifest: [
        {
          name: "event_id",
          type: "bytes32",
        },
        {
          name: "shop_token_id",
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
        {
          name: "name",
          type: "string",
        },
        {
          name: "description",
          type: "string",
        },
        {
          name: "profile_picture_url",
          type: "string",
        },
      ],
    };

    return this.#signAndSendShopEvent(
      types,
      shopManifest,
    ) as Promise<mmproto.EventWriteResponse>;
  }

  async updateShopManifest(update: {
    domain?: string;
    publishedTagId?: `0x${string}`;
    addErc20Addr?: `0x${string}`;
    removeErc20Addr?: `0x${string}`;
    name?: string;
    description?: string;
    profilePictureUrl?: string;
  }) {
    await this.connect();

    const types = [
      {
        name: "event_id",
        type: "bytes32",
      },
    ];

    const optional_types = [
      {
        name: "name",
        type: "string",
      },
      {
        name: "description",
        type: "string",
      },
      {
        name: "profile_picture_url",
        type: "string",
      },
      {
        name: "domain",
        type: "string",
      },
      {
        name: "published_tag_id",
        type: "bytes32",
      },
      {
        name: "add_erc20_addr",
        type: "address",
      },
      {
        name: "remove_erc20_addr",
        type: "address",
      },
    ];

    let message = {
      eventId: eventId(),
    } as { [key: string]: any };

    for (const opt_type of optional_types) {
      const { name, type } = opt_type;
      const obj_name = snakeToCamel(name);
      // @ts-ignore
      const v = update[obj_name];

      if (v !== undefined) {
        types.push(opt_type);
        if (type == "address" || type == "bytes32") {
          message[obj_name] = hexToBytes(v);
        } else {
          message[obj_name] = v;
        }
      }
    }
    return this.#signAndSendShopEvent(
      {
        UpdateShopManifest: types,
      },
      message,
    );
  }

  async createItem(
    price: string,
    metadata: { name: string; description: string; image: string },
  ) {
    await this.connect();
    const jsonString = JSON.stringify(metadata);
    const encoder = new TextEncoder();
    const utf8Encoded = encoder.encode(jsonString);
    const iid = eventId();
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
    await this.#signAndSendShopEvent(types, item);
    return bytesToHex(iid);
  }

  async updateItem(
    itemId: `0x${string}`,
    update: {
      price?: string;
      metadata?: any; // TODO: actually should be an object...
    },
  ) {
    await this.connect();

    const message = {
      eventId: eventId(),
      itemId: hexToBytes(itemId),
    } as Record<string, Uint8Array | string | number | Uint8Array[] | number[]>;

    const types = [
      {
        name: "event_id",
        type: "bytes32",
      },
      {
        name: "item_id",
        type: "bytes32",
      },
    ];

    if (update.price !== undefined) {
      types.push({ name: "price", type: "string" });
      message["price"] = update.price;
    }
    if (update.metadata !== undefined) {
      const jsonString = JSON.stringify(update.metadata);
      const encoder = new TextEncoder();
      const utf8Encoded = encoder.encode(jsonString);
      types.push({ name: "metadata", type: "bytes" });
      message["metadata"] = utf8Encoded;
    }

    return this.#signAndSendShopEvent(
      {
        UpdateItem: types,
      },
      message,
    );
  }

  async createTag(name: string) {
    await this.connect();
    const tagId = eventId();
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
    await this.#signAndSendShopEvent(types, tag);
    return bytesToHex(tagId);
  }

  async addItemToTag(tagId: `0x${string}`, itemId: `0x${string}`) {
    await this.connect();
    const tag = {
      eventId: eventId(),
      tagId: hexToBytes(tagId),
      addItemId: hexToBytes(itemId),
    };

    const types = {
      UpdateTag: [
        {
          name: "event_id",
          type: "bytes32",
        },
        {
          name: "tag_id",
          type: "bytes32",
        },
        {
          name: "add_item_id",
          type: "bytes32",
        },
      ],
    };
    return this.#signAndSendShopEvent(types, tag);
  }

  async removeFromTag(tagId: `0x${string}`, itemId: `0x${string}`) {
    await this.connect();
    const tag = {
      eventId: eventId(),
      tagId: hexToBytes(tagId),
      removeItemId: hexToBytes(itemId),
    };

    const types = {
      UpdateTag: [
        {
          name: "event_id",
          type: "bytes32",
        },
        {
          name: "tag_id",
          type: "bytes32",
        },
        {
          name: "remove_item_id",
          type: "bytes32",
        },
      ],
    };
    return this.#signAndSendShopEvent(types, tag);
  }

  async abandonOrder(orderId: `0x${string}`) {
    await this.connect();

    const order = {
      eventId: eventId(),
      orderId: hexToBytes(orderId),
    };

    const types = {
      OrderAbandoned: [
        {
          name: "event_id",
          type: "bytes32",
        },
        { name: "order_id", type: "bytes32" },
      ],
    };

    return await this.#signAndSendShopEvent(types, order);
  }

  async createOrder() {
    await this.connect();
    const reqId = eventId();
    const order = {
      eventId: reqId,
    };

    const types = {
      CreateOrder: [
        {
          name: "event_id",
          type: "bytes32",
        },
      ],
    };

    await this.#signAndSendShopEvent(types, order);
    return bytesToHex(reqId);
  }

  async changeOrder(
    orderId: `0x${string}`,
    itemId: `0x${string}`,
    quantity: number,
  ) {
    await this.connect();

    const order = {
      eventId: eventId(),
      orderId: hexToBytes(orderId),
      changeItems: {
        itemId: hexToBytes(itemId),
        quantity,
      },
    };

    const types = {
      UpdateOrder: [
        {
          name: "event_id",
          type: "bytes32",
        },
        {
          name: "order_id",
          type: "bytes32",
        },
        {
          name: "change_items",
          type: "change_items",
        },
      ],
      change_items: [
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

    return this.#signAndSendShopEvent(types, order);
  }

  // null erc20Addr means vanilla ethererum is used
  async commitOrder(
    orderId: `0x${string}`,
    erc20Addr?: `0x${string}` | null,
  ): Promise<mmproto.CommitItemsToOrderResponse> {
    let erc20AddrBytes: Uint8Array | null = null;
    if (erc20Addr) {
      erc20AddrBytes = hexToBytes(erc20Addr);
      if (erc20AddrBytes.length !== 20) {
        return Promise.reject(new Error("erc20Addr must be 20 bytes"));
      }
    }
    await this.connect();
    return this.encodeAndSend(mmproto.CommitItemsToOrderRequest, {
      orderId: hexToBytes(orderId),
      erc20Addr: erc20AddrBytes,
      chainId: this.chain.id,
    }) as Promise<mmproto.CommitItemsToOrderResponse>;
  }

  async changeStock(itemIds: `0x${string}`[], diffs: number[]) {
    await this.connect();
    const stock = {
      eventId: eventId(),
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
    return this.#signAndSendShopEvent(types, stock);
  }
}

// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { Dispatch, SetStateAction } from "react";
import { type Chain, type PublicClient } from "viem";
import { type PrivateKeyAccount } from "viem/accounts";
import { EventEmitter } from "stream";

import { WalletClientWithAccount } from "@massmarket/client";
import { market } from "@massmarket/client/lib/protobuf/compiled";
import mmproto = market.mass;

import { IProduct, ITag, IStatus, IRelay } from "@/types";
import { Level } from "level";

type metadata = { title: string; description: string; image: string };
export type ItemId = `0x${string}`;
export type TagId = `0x${string}`;
export type OrderId = `0x${string}`;
export type EventId = `0x${string}`;

export type FinalizedOrderState = {
  erc20Addr: `0x${string}` | null;
  orderId: OrderId;
  purchaseAddress: `0x${string}`;
  salesTax: string | null;
  total: string | null;
  totalInCrypto: string | null;
  subTotal: string | null;
};
export type UpdateItemProps = {
  itemId: ItemId;
  value: number | { title: string; description: string; image: string };
};

export type ItemState = { [key: ItemId]: number };
export type OrderState = {
  items: ItemState;
  status?: IStatus;
  txHash?: `0x${string}`;
};

export type IRelayWriteResponse = {
  // TODO: should be mmproto.EventWriteResponse but can't import anymore somehow
};
type blockchain = {
  createStore: (wallet: WalletClientWithAccount) => Promise<`0x${string}`>;
};
// TODO: should move this to client package and use it in tests to make sure it's in sync
export type IRelayClient = EventEmitter & {
  wallet: WalletClientWithAccount;
  chain: Chain;
  keyCard: PrivateKeyAccount;
  endpoint: string;
  blockchain: blockchain;
  getRandomStoreId: () => `0x${string}`;
  writeStoreManifest: (pId?: TagId) => Promise<IRelayWriteResponse>;
  updateManifest: (
    field: number,
    value: string,
  ) => Promise<IRelayWriteResponse>;
  createInviteSecret: (
    wallet: WalletClientWithAccount,
  ) => Promise<`0x${string}`>;

  redeemInviteSecret: (
    secret: `0x${string}`,
    wallet: WalletClientWithAccount,
  ) => Promise<`0x${string}`>;
  enrollKeycard: (
    wallet: WalletClientWithAccount,
  ) => Promise<{ ok?: boolean; error?: string }>;
  login: () => Promise<`0x${string}`>;
  createItem: (price: string, metadata: metadata) => Promise<ItemId>;
  updateItem: (
    itemId: ItemId,
    value: string | { title: string; description: string; image: string },
  ) => Promise<`0x${string}`>;
  addItemToTag: (tagId: TagId, itemId: ItemId) => Promise<IRelayWriteResponse>;
  removeFromTag: (tagId: TagId, itemId: ItemId) => Promise<IRelayWriteResponse>;
  uploadBlob: (blob: Blob) => Promise<{ url: string }>;
  addListener: (event: string, callback: (e: Event) => void) => void;
  createTag: (name: string) => Promise<TagId>;
  changeOrder: (
    cardId: OrderId,
    itemId: ItemId,
    saleQty: number,
  ) => Promise<IRelayWriteResponse>;
  createOrder: () => Promise<`0x${string}`>;
  changeStock: (
    itemId: ItemId[],
    diffs: number[],
  ) => Promise<IRelayWriteResponse>;
  abandonOrder: (cardId: OrderId) => Promise<void>;
  commitOrder: (
    cardId: OrderId,
    erc20: `0x${string}` | null,
  ) => Promise<{ requestId: Uint8Array; orderFinalizedId: Uint8Array }>;
  createEventStream: () => Promise<{ events: mmproto.IEvent[] }>[];
  recoverSignedAddress: (
    orderId: `0x${string}`,
    signature: `0x${string}`,
  ) => `0x${string}`;
};

export type ClientContext = {
  keyCardEnrolled: `0x${string}` | null;
  walletAddress: `0x${string}` | null;
  clientWallet: WalletClientWithAccount | null;
  balance: string | null;
  avatar: string | null;
  name: string | null;
  relayClient: IRelayClient | null;
  publicClient: PublicClient | null;
  inviteSecret: `0x${string}` | null;
  setKeyCardEnrolled: Dispatch<SetStateAction<`0x${string}` | null>>;
  setInviteSecret: Dispatch<SetStateAction<`0x${string}` | null>>;
  setWallet: Dispatch<SetStateAction<WalletClientWithAccount | null>>;
  getTokenInformation: (
    d: `0x${string}`,
  ) => Promise<{ name: string; symbol: string; decimals: number }>;
};

export type StoreContent = {
  relays: IRelay[];
  products: Map<ItemId, IProduct>;
  allTags: Map<TagId, ITag>;
  orderItems: Map<OrderId, OrderState>;
  orderId: OrderId | null;
  erc20Addr: `0x${string}` | null;
  publishedTagId: TagId | null;
  finalizedOrders: Map<EventId, FinalizedOrderState>;
  db: Level<string, string>;
  addProduct: (
    p: IProduct,
    keysArr: ItemId[] | [],
  ) => Promise<{ id?: ItemId; error: null | string }>;
  updateProduct: (
    itemId: ItemId,
    updatedFields: { price: boolean; metadata: boolean },
    newProduct: IProduct,
    keysArr: ItemId[] | [],
  ) => Promise<{ error: string | null }>;
  createState: () => void;
  createTag: (name: string) => Promise<{ id?: TagId; error: null | string }>;
  addProductToTag: (
    tagId: TagId,
    itemId: ItemId,
  ) => Promise<{ error: string | null }>;
  removeProductFromTag: (
    tagId: TagId,
    itemId: ItemId,
  ) => Promise<{ id?: TagId; error: string | null }>;
  updateOrder: (
    itemId?: ItemId,
    saleQty?: number,
  ) => Promise<{ error: string | null }>;
  commitOrder: (erc20: boolean) => Promise<{
    orderFinalizedId?: OrderId;
    requestId?: `0x${string}`;
    error: string | null;
    erc20?: `0x${string}`;
  }>;
  invalidateOrder: (msg: string) => void;
  setErc20Addr: (erc20: `0x${string}`) => void;
  setPublishedTagId: (id: TagId) => void;
  setOrderId: (orderId: OrderId | null) => void;
};

export type ProductsMap = Map<ItemId, IProduct>;

export type TagsMap = Map<TagId, ITag>;

export type OrdersMap = Map<OrderId, OrderState>;

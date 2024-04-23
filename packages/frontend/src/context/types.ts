// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { Dispatch, SetStateAction } from "react";
import { type Chain, type PublicClient } from "viem";
import { type PrivateKeyAccount } from "viem/accounts";
import { EventEmitter } from "stream";

import { WalletClientWithAccount } from "@massmarket/client";
// import * as pb from "client/lib/protobuf/compiled";
// import mmproto = pb.market.mass;

import { Store, IRelay, IProduct, ITag, IStatus } from "@/types/index";

export interface MyEvents {
  connect: Record<string, never>;
}
export enum ItemField {
  ITEM_FIELD_UNSPECIFIED = 0,
  ITEM_FIELD_PRICE = 1,
  ITEM_FIELD_METADATA = 2,
}

type metadata = { title: string; description: string; image: string };
export type ItemId = `0x${string}`;
export type TagId = `0x${string}`;
export type CartId = `0x${string}`;
export type EventId = `0x${string}`;

export type FinalizedCartState = {
  erc20Addr: `0x${string}`;
  cartId: `0x${string}`;
  purchaseAddress: `0x${string}`;
  salesTax: string;
  subTotal: string;
  total: string;
  totalInCrypto: string;
};
export type UpdateItemProps = {
  itemId: ItemId;
  field: ItemField;
  value: number | { title: string; description: string; image: string };
};

export type ItemState = { [key: ItemId]: number };
export type CartState = {
  items: ItemState;
  status?: IStatus;
  txHash?: `0x${string}`;
};

export type IRelayWriteResponse = {
  // TODO: should be mmproto.EventWriteResponse but can't import anymore somehow
};

// TODO: should move this to client package and use it in tests to make sure it's in sync
export type IRelayClient = EventEmitter & {
  wallet: WalletClientWithAccount;
  chain: Chain;
  keyCard: PrivateKeyAccount;
  endpoint: string;
  getRandomStoreId: () => `0x${string}`;
  writeStoreManifest: (pId?: TagId) => Promise<IRelayWriteResponse>;
  updateManifest: (
    field: number,
    value: string,
  ) => Promise<IRelayWriteResponse>;
  createInviteSecret: () => Promise<`0x${string}`>;
  createStore: (storeId: `0x${string}`) => Promise<`0x${string}`>;
  redeemInviteSecret: (secret: `0x${string}`) => Promise<`0x${string}`>;
  enrollKeycard: () => Promise<{ ok?: boolean; error?: string }>;
  login: () => Promise<`0x${string}`>;
  createItem: (price: string, metadata: metadata) => Promise<ItemId>;
  updateItem: (
    itemId: ItemId,
    field: ItemField,
    value: string | { title: string; description: string; image: string },
  ) => Promise<`0x${string}`>;
  addItemToTag: (tagId: TagId, itemId: ItemId) => Promise<IRelayWriteResponse>;
  removeFromTag: (tagId: TagId, itemId: ItemId) => Promise<IRelayWriteResponse>;
  uploadBlob: (blob: Blob) => Promise<string>;
  addListener: (event: string, callback: (result: any) => void) => void;
  createTag: (name: string) => Promise<TagId>;
  changeCart: (
    cardId: `0x${string}`,
    itemId: ItemId,
    saleQty: number,
  ) => Promise<IRelayWriteResponse>;
  createCart: () => Promise<`0x${string}`>;
  changeStock: (
    itemId: ItemId[],
    diffs: number[],
  ) => Promise<IRelayWriteResponse>;
};

export type ClientContext = {
  walletAddress: `0x${string}` | null;
  balance: string | null;
  avatar: string | null;
  name: string | null;
  relayClient: IRelayClient | null;
  publicClient: PublicClient | null;
  inviteSecret: `0x${string}` | null;
  setInviteSecret: Dispatch<SetStateAction<`0x${string}`>>;
  setWallet: Dispatch<SetStateAction<WalletClientWithAccount>>;
  getTokenInformation: (
    d: `0x${string}`,
  ) => Promise<{ name: string; symbol: string; decimals: number }>;
};

export type StoreContent = {
  store: Store | null;
  relays: IRelay[];
  products: Map<ItemId, IProduct>;
  allTags: Map<TagId, ITag>;
  cartItems: Map<CartId, CartState>;
  cartId: `0x${string}` | null;
  erc20Addr: `0x${string}` | null;
  publishedTagId: `0x${string}` | null;
  finalizedCarts: Map<EventId, FinalizedCartState>;
  addProduct: (
    p: IProduct,
    keysArr: ItemId[] | 0,
  ) => Promise<ItemId | { error: string }>;
  updateProduct: (
    itemId: ItemId,
    updatedFields: { price: boolean; metadata: boolean },
    newProduct: IProduct,
    keysArr: ItemId[] | 0,
  ) => Promise<{ error: string | null }>;
  createState: () => void;
  createTag: (name: string) => Promise<TagId>;
  addProductToTag: (
    tagId: TagId,
    itemId: ItemId,
  ) => Promise<{ error: string | null }>;
  removeProductFromTag: (
    tagId: TagId,
    itemId: ItemId,
  ) => Promise<{ error: string | null }>;
  updateCart: (
    itemId?: ItemId,
    quantity?: number,
  ) => Promise<{ error?: string }>;
  commitCart: (erc20: boolean) => Promise<{
    cartFinalizedId: `0x${string}`;
    requestId: `0x${string}`;
    error?: string;
    erc20?: `0x${string}`;
  }>;
  invalidateCart: (msg: string) => void;
  setErc20Addr: (erc20: `0x${string}`) => void;
  setPublishedTagId: (id: TagId) => void;
  setCartId: (cartId: CartId | null) => void;
};

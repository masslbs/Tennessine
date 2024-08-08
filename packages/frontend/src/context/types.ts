// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { Dispatch, SetStateAction } from "react";
import { type PublicClient } from "viem";

import { Item, Tag, Status, Relay } from "@/types";
import { Level } from "level";
import { RelayClient, WalletClientWithAccount } from "@massmarket/client";
import { updateStoreDataAction } from "@/reducers/storeReducer";
import {
  TokenAddr,
  AcceptedCurrencyActions,
} from "@/reducers/acceptedCurrencyReducers";
import { StateManager } from "@massmarket/stateManager";

export type ItemId = `0x${string}`;
export type TagId = `0x${string}`;
export type OrderId = `0x${string}`;
export type EventId = `0x${string}`;
export type ShopId = `0x${string}`;

export type FinalizedOrderState = {
  orderHash: Uint8Array;
  currencyAddr: Uint8Array;
  totalInCrypto: Uint8Array;
  ttl: string;
  payeeAddr: Uint8Array;
  shopSignature: Uint8Array;
  total: string;
};
export type UpdateItemProps = {
  itemId: ItemId;
  value: number | { title: string; description: string; image: string };
};

export type storeState = {
  name: string;
  profilePictureUrl: string;
  baseCurrencyAddr: `0x${string}` | null;
};

export type ItemState = { [key: ItemId]: number };
export type OrderState = {
  items: ItemState;
  status?: Status;
  txHash?: `0x${string}`;
};

export type CurrenciesState = Map<TokenAddr, null | string>;

export type RelayWriteResponse = {
  // TODO: should be mmproto.EventWriteResponse but can't import anymore somehow
};

export type ClientContext = {
  keyCardEnrolled: boolean;
  walletAddress: `0x${string}` | null;
  clientWallet: WalletClientWithAccount | null;
  balance: string | null;
  avatar: string | null;
  name: string | null;
  relayClient: RelayClient | null;
  publicClient: PublicClient | null;
  inviteSecret: `0x${string}` | null;
  shopId: ShopId;
  setShopId: Dispatch<SetStateAction<ShopId>>;
  setKeyCardEnrolled: Dispatch<SetStateAction<boolean>>;
  setInviteSecret: Dispatch<SetStateAction<`0x${string}` | null>>;
  setWallet: Dispatch<SetStateAction<WalletClientWithAccount | null>>;
  getTokenInformation: (
    d: `0x${string}`,
  ) => Promise<{ name: string; symbol: string; decimals: number }>;
  checkPermissions: () => Promise<boolean>;
  setRelayClient: Dispatch<SetStateAction<RelayClient | null>>;
  createNewRelayClient: () => Promise<RelayClient | null>;
};

export type StoreContent = {
  relays: Relay[];
  products: Map<ItemId, Item>;
  allTags: Map<TagId, Tag>;
  orderItems: Map<OrderId, OrderState>;
  orderId: OrderId | null;
  erc20Addr: `0x${string}` | null;
  publishedTagId: TagId | null;
  finalizedOrders: Map<EventId, FinalizedOrderState>;
  db: Level<string, string>;
  storeData: storeState;
  addProduct: (
    p: Item,
    keysArr: ItemId[] | [],
  ) => Promise<{ id?: ItemId; error: null | string }>;
  updateProduct: (
    itemId: ItemId,
    updatedFields: { price: boolean; metadata: boolean },
    newProduct: Item,
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
  commitOrder: () => Promise<{
    orderFinalizedId?: OrderId;
    requestId?: `0x${string}`;
    error: string | null;
    erc20?: `0x${string}`;
  }>;
  invalidateOrder: (msg: string) => void;
  setErc20Addr: (erc20: `0x${string}`) => void;
  setPublishedTagId: (id: TagId) => void;
  setOrderId: (orderId: OrderId | null) => void;
  setStoreData: Dispatch<updateStoreDataAction>;
  acceptedCurrencies: Map<TokenAddr, null | string>;
  setAcceptedCurrencies: Dispatch<AcceptedCurrencyActions>;
  selectedCurrency: TokenAddr;
  setSelectedCurrency: Dispatch<TokenAddr>;
  stateManager: StateManager;
};

export type ProductsMap = Map<ItemId, Item>;
export type TagsMap = Map<TagId, Tag>;
export type OrdersMap = Map<OrderId, OrderState>;

// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { Dispatch, SetStateAction } from "react";
import { type PublicClient } from "viem";

import { Item, Tag, Status, ShopCurrencies } from "@/types";
import { RelayClient, WalletClientWithAccount } from "@massmarket/client";

import { StateManager } from "@massmarket/stateManager";

export type ItemId = `0x${string}`;
export type TagId = `0x${string}`;
export type OrderId = `0x${string}`;
export type EventId = `0x${string}`;
export type ShopId = `0x${string}`;
export type TokenAddr = `0x${string}`;

export type UpdateItemProps = {
  itemId: ItemId;
  value: number | { title: string; description: string; image: string };
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
  orderId: OrderId | null;
  setOrderId: (orderId: OrderId | null) => void;
  selectedCurrency: ShopCurrencies | null;
  setSelectedCurrency: Dispatch<ShopCurrencies>;
  stateManager: StateManager | null;
  getOrderId: () => Promise<OrderId>;
};

export type ProductsMap = Map<ItemId, Item>;
export type TagsMap = Map<TagId, Tag>;
export type OrdersMap = Map<OrderId, OrderState>;

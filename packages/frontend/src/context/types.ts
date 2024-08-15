// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { Dispatch, SetStateAction } from "react";
import { type PublicClient } from "viem";

import { ShopId, OrderId, ShopCurrencies } from "@/types";
import { RelayClient, WalletClientWithAccount } from "@massmarket/client";
import { LoadingStateManager } from "./initialLoadingState";
import { StateManager } from "@massmarket/stateManager";

//Types for Contexts only
export type ClientContext = {
  keyCardEnrolled: boolean;
  ensName: string | null;
  walletAddress: `0x${string}` | null;
  clientWallet: WalletClientWithAccount | null;
  avatar: string | null;
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
  stateManager: StateManager | LoadingStateManager;
  getOrderId: () => Promise<OrderId>;
};

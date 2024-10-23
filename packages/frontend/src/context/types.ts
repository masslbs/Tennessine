// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { Dispatch, SetStateAction } from "react";
import { type PublicClient } from "viem";

import { ShopId, OrderId, ShopCurrencies, ShopDetails } from "@/types";
import { RelayClient, WalletClientWithAccount } from "@massmarket/client";
import { LoadingStateManager } from "./initialLoadingState";
import { StateManager } from "@massmarket/stateManager";

//Types for Contexts only
export type ClientContext = {
  ensName: string | null;
  walletAddress: `0x${string}` | null;
  clientWallet: WalletClientWithAccount | null;
  avatar: string | null;
  relayClient: RelayClient | null;
  shopPublicClient: PublicClient | null;
  inviteSecret: `0x${string}` | null;
  shopId: ShopId | null;
  setShopId: Dispatch<SetStateAction<ShopId | null>>;
  setInviteSecret: Dispatch<SetStateAction<`0x${string}` | null>>;
  setWallet: Dispatch<SetStateAction<WalletClientWithAccount | null>>;
  checkPermissions: () => Promise<boolean>;
  setRelayClient: Dispatch<SetStateAction<RelayClient | null>>;
  createNewRelayClient: () => Promise<RelayClient | null>; // TODO: i think this shouldn't have to retun null
  upgradeGuestToCustomer: () => Promise<void>;
};

export type StoreContent = {
  orderId: OrderId | null;
  setOrderId: (orderId: OrderId | null) => void;
  selectedCurrency: ShopCurrencies | null;
  setSelectedCurrency: Dispatch<ShopCurrencies>;
  stateManager: StateManager | LoadingStateManager;
  getOrderId: () => Promise<OrderId | null>;
  shopDetails: ShopDetails;
  setShopDetails: Dispatch<ShopDetails>;
  getBaseTokenInfo: () => Promise<[string, number] | null>;
};

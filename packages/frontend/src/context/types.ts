// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { Dispatch, SetStateAction } from "react";
import { type PublicClient } from "viem";

import { ShopId, OrderId, ShopDetails } from "@/types";
import {
  RelayClient,
  WalletClientWithAccount,
  RelayEndpoint,
} from "@massmarket/client";
import { LoadingStateManager } from "./initialLoadingState";
import { StateManager } from "@massmarket/stateManager";
import { ClientWithStateManager } from "@/app/ClientWithStateManager";

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
  upgradeGuestToCustomer: () => Promise<void>;
  relayEndpoint: RelayEndpoint;
  createNewRelayClient: () => Promise<RelayClient>;
  clientWithStateManager: ClientWithStateManager;
  setClientStateManager: Dispatch<SetStateAction<ClientWithStateManager>>;
};

export type StoreContent = {
  getOrderId: () => Promise<OrderId | null>;
  stateManager: StateManager | LoadingStateManager;
  shopDetails: ShopDetails;
  setShopDetails: Dispatch<ShopDetails>;
  getBaseTokenInfo: () => Promise<[string, number]>;
};

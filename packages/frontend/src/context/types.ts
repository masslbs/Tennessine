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
  walletAddress: `0x${string}` | null;
  avatar: string | null;
  ensName: string | null;
  clientWallet: WalletClientWithAccount | null;
  relayClient: RelayClient | null;
  shopPublicClient: PublicClient | null;
  inviteSecret: `0x${string}` | null;
  shopId: ShopId | null;
  relayEndpoint: RelayEndpoint | null;
  clientWithStateManager: ClientWithStateManager | null;
  setWallet: Dispatch<SetStateAction<WalletClientWithAccount | null>>;
  setInviteSecret: Dispatch<SetStateAction<`0x${string}` | null>>;
  setShopId: Dispatch<SetStateAction<ShopId | null>>;
  checkPermissions: () => Promise<boolean>;
  setRelayClient: Dispatch<SetStateAction<RelayClient | null>>;
  upgradeGuestToCustomer: () => Promise<void>;
  setClientStateManager: Dispatch<
    SetStateAction<ClientWithStateManager | null>
  >;
};

export type StoreContent = {
  getOrderId: () => Promise<OrderId | null>;
  shopDetails: ShopDetails;
  setShopDetails: Dispatch<ShopDetails>;
  getBaseTokenInfo: () => Promise<[string, number]>;
};

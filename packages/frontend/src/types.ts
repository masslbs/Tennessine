// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { OrderState } from "@massmarket/schema";
export { OrderState };
export type KeyCard = `0x${string}`;
export type ListingId = number;
export type TagId = `0x${string}`;
export type OrderId = number;
export type TokenAddress = `0x${string}`;
export type ShopId = bigint;

export enum Status {
  Failed = "FAILED",
  Pending = "PENDING",
  Complete = "COMPLETE",
}

export interface ShopDetails {
  name: string;
  profilePictureUrl: string;
}

export type CurrencyChainOption = {
  label: string;
  value: string | number;
} & Partial<ChainAddress>;

export type ChainAddress = {
  chainId: number;
  address: string;
};

export enum CheckoutStep {
  cart = "cart",
  shippingDetails = "shippingDetails",
  paymentDetails = "paymentDetails",
  confirmation = "confirmation",
  expired = "expired",
}

export enum SearchShopStep {
  Search = "SEARCH",
  Connect = "CONNECT",
  Confirm = "CONFIRM",
}
export enum CreateShopStep {
  ManifestForm = "MANIFEST_FORM",
  ConnectWallet = "CONNECT_WALLET",
  Confirmation = "CONFIRMATION",
}

export type ShopForm = {
  shopName: string;
  description: string;
  avatar: FormData | null;
  paymentAddress: string;
};

export enum ListingViewState {
  Unspecified = 0,
  Published = 1,
  Deleted = 2,
}

export enum KeycardRole {
  NEW_GUEST = "new-guest",
  RETURNING_GUEST = "returning-guest",
  MERCHANT = "merchant",
}

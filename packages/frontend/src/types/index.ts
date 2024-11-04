// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import {
  Item,
  Order,
  Metadata,
  Tag,
  ShopCurrencies,
  ShopManifest,
  KeyCard,
  OrderState,
  ListingViewState,
  Payee,
} from "@massmarket/stateManager/types";

export {
  type Item,
  type Order,
  type Metadata,
  type Tag,
  type ShopCurrencies,
  type ShopManifest,
  type KeyCard,
  type Payee,
  OrderState,
  ListingViewState,
};
export type ItemId = `0x${string}`;
export type TagId = `0x${string}`;
export type OrderId = `0x${string}`;
export type TokenAddr = `0x${string}`;
export type ShopId = `0x${string}`;

export enum RelayStatus {
  Available = "AVAILABLE",
  Unavailable = "UNAVAILABLE",
}

export enum Role {
  Owner = "OWNER",
  Admin = "ADMIN",
  Clerk = "CLERK",
}

export interface Contributor {
  id: number;
  role: Role;
  name: string;
  keyCardId: string;
  thumbnail: string;
  walletAddress: string;
}

export interface Relay {
  id: `0x${string}`;
  name: string;
  location: string;
  status: RelayStatus;
  provisioned: boolean;
}

export enum SortOption {
  priceLow = "Price Low",
  priceHigh = "Price High",
  newest = "Newest",
  default = "Default",
  available = "Available",
  hidden = "Hidden",
  unavailable = "Unavailable",
}
export enum Status {
  Failed = "FAILED",
  Pending = "PENDING",
  Complete = "COMPLETE",
}
export interface BaseTokenDetails {
  decimal: number;
  symbol: string;
}
export interface ShopDetails {
  name: string;
  profilePictureUrl: string;
}

export interface CurrencyChainOption {
  label: string;
  value: string | number;
  address?: `0x${string}`;
  chainId?: number;
}
export enum CheckoutStep {
  cart = "cart",
  shippingDetails = "shippingDetails",
  paymentDetails = "paymentDetails",
  confirmation = "confirmation",
}

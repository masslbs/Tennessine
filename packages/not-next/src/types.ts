// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import {
  KeyCard,
  Listing,
  ListingViewState,
  Metadata,
  Order,
  OrderEventTypes,
  OrderState,
  Payee,
  ShippingDetails,
  ShopCurrencies,
  ShopManifest,
  Tag,
} from "@massmarket/stateManager/types";

export {
  type KeyCard,
  type Listing,
  ListingViewState,
  type Metadata,
  type Order,
  OrderEventTypes,
  OrderState,
  type Payee,
  type ShippingDetails,
  type ShopCurrencies,
  type ShopManifest,
  type Tag,
};
export type ListingId = `0x${string}`;
export type TagId = `0x${string}`;
export type OrderId = `0x${string}`;
export type TokenAddr = `0x${string}`;
export type ShopId = bigint;

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
  expired = "expired",
}
export interface CurrentOrder {
  orderId: OrderId;
  status: OrderState;
}

export interface Token {
  symbol: string;
  decimals: number;
}

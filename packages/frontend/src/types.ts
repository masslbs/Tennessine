// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later


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
} & Partial<TCurrencyMap>;

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

export interface CurrentOrder {
  orderId: OrderId;
  status: OrderState;
}

export type CartItem = {
  selectedQty: number;
} & TListing;

export type ShopForm = {
  shopName: string;
  description: string;
  avatar: FormData | null;
  paymentAddress: string;
};

export enum ListingViewState {
  LISTING_VIEW_STATE_UNSPECIFIED = 0,
  LISTING_VIEW_STATE_PUBLISHED = 1,
  LISTING_VIEW_STATE_DELETED = 2,
}
export enum OrderState {
  STATE_UNSPECIFIED = 0,
  STATE_OPEN = 1,
  STATE_CANCELED = 2,
  STATE_COMMITTED = 3,
  STATE_PAYMENT_TX = 4,
  STATE_PAID = 5,
}
export enum OrderEventTypes {
  CANCELLED = "orderCanceled",
  CHANGE_ITEMS = "changeItems",
  INVOICE_ADDRESS = "invoiceAddress",
  SHIPPING_ADDRESS = "shippingAddress",
  COMMIT_ITEMS = "commitItems",
  CHOOSE_PAYMENT = "choosePayment",
  PAYMENT_DETAILS = "paymentDetails",
  PAYMENT_TX = "addPaymentTx",
}

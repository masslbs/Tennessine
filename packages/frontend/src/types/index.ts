// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later
import { Item, Order } from "@massmarket/stateManager/types";
export type ItemId = `0x${string}`;
export type TagId = `0x${string}`;
export type OrderId = `0x${string}`;
export type { Item, Order };
export interface Metadata {
  title: string;
  description: string;
  image: string;
}

export enum Status {
  Failed = "FAILED",
  Pending = "PENDING",
  Complete = "COMPLETE",
}

export enum RelayStatus {
  Available = "AVAILABLE",
  Unavailable = "UNAVAILABLE",
}

export interface Transaction {
  id: number;
  status: Status;
  orders: Order[];
  createdAt?: Date;
  totalPrice: number;
  payment?: {
    id: number;
    paymentAddr: string;
  };
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

export interface Tag {
  id: `0x${string}`;
  name: string;
}
export type KeyCard = `0x${string}`;

interface ShippingDetails {
  name: string;
  address1: string;
  city: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
}

interface CreateShopManifest {
  name: string;
  description: string;
}

export type ShopManifest = CreateShopManifest & {
  tokenId: `0x${string}`;
  setBaseCurrency: ShopCurrencies | null;
  addAcceptedCurrencies: ShopCurrencies[];
  addPayee: {
    addr: `0x${string}`;
    callAsContract: boolean;
    chainId: number;
    name: string;
  } | null;
  publishedTagId: `0x${string}`;
  profilePictureUrl: string;
};
interface ShopCurrencies {
  tokenAddr: `0x${string}`;
  chainId: number;
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

// export type Store = {
//   id: number;
//   name: string;
//   thumbnail: string;
//   products: Item[];
//   transactions: ITransaction[];
//   contributors: Contributor[];
//   authorizedKeyCards: number[];
//   relays: Relay[];
//   tags: Tag[];
// };

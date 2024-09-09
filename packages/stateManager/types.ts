import { RelayClient } from "@massmarket/client";
/**
 * Define the Store Objects that are reified from the event stream
 */

export type IRelayClient = Pick<
  RelayClient,
  | "encodeAndSendNoWait"
  | "connect"
  | "sendShopEvent"
  | "createEventStream"
  | "listing"
  | "updateListing"
  | "tag"
  | "shopManifest"
  | "updateShopManifest"
  | "changeInventory"
  | "createOrder"
  | "updateOrder"
  | "commitOrder"
  | "updateTag"
>;
export enum OrderState {
  STATE_UNSPECIFIED = 0,
  STATE_OPEN = 1,
  STATE_CANCELED = 2,
  STATE_COMMITED = 3,
  STATE_UNPAID = 4,
  STATE_PAID = 5,
}
export enum ListingViewState {
  LISTING_VIEW_STATE_UNSPECIFIED = 0,
  LISTING_VIEW_STATE_PUBLISHED = 1,
  LISTING_VIEW_STATE_DELETED = 2,
}
export interface Metadata {
  title: string;
  description: string;
  images: string[];
}
export interface Item {
  id: BigInt;
  basePrice: string;
  baseInfo: Metadata;
  tags: BigInt[];
  quantity: number;
  viewState: ListingViewState;
}

export interface Tag {
  id: BigInt;
  name: string;
}

export interface IError {
  notFound: boolean;
  code: string;
}
export type OrdersByStatus = BigInt[];

export type KeyCard = `0x${string}`;
export interface ShippingDetails {
  name: string;
  address1: string;
  city: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
}

export interface OrderFinalized {
  orderHash: string;
  currencyAddr: string;
  totalInCrypto: string;
  ttl: string;
  payeeAddr: string;
  shopSignature: string;
  total: string;
}
export interface Order {
  id: BigInt;
  items: { [key: string]: number };
  status: OrderState;
  shippingDetails?: ShippingDetails;
  txHash?: string;
  orderFinalized?: OrderFinalized;
}
export interface ShopCurrencies {
  address: `0x${string}`;
  chainId: number;
}
//This interface is only for create manifest.
export interface CreateShopManifest {
  baseCurrency: ShopCurrencies;
  acceptedCurrencies: ShopCurrencies[];
  payees: Payee[];
}
export interface Payee {
  address: `0x${string}`;
  callAsContract: boolean;
  chainId: number;
  name: string;
}
//This type is used to store and retrieve the manifest from db. All the fields are required in this case.
export type ShopManifest = CreateShopManifest & {
  tokenId: `0x${string}` | null;
};

//These UpdateShopManifest properties are only for updating the manifest and not properties on the store state.
//i.e. payees in type ShopManifest stores the actual state, while these update properties are for the update client request.
export interface UpdateShopManifest {
  removePayee?: Payee;
  addPayee?: Payee;
  addAcceptedCurrencies?: ShopCurrencies[];
  removeAcceptedCurrencies?: ShopCurrencies[];
  setBaseCurrency: ShopCurrencies | null;
}
export type ShopObjectTypes =
  | Item
  | Tag
  | KeyCard
  | Order
  | OrdersByStatus
  | ShopManifest;

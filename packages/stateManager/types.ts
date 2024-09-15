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
  | "createItem"
  | "updateItem"
  | "createTag"
  | "shopManifest"
  | "updateShopManifest"
  | "changeStock"
  | "createOrder"
  | "updateOrder"
  | "commitOrder"
  | "updateTag"
>;
export interface Metadata {
  title: string;
  description: string;
  image: string;
}
export interface Item {
  id: `0x${string}`;
  price: string;
  metadata: Metadata;
  tags: `0x${string}`[];
  quantity: number;
}

export interface Tag {
  id: `0x${string}`;
  name: string;
}

export interface IError {
  notFound: boolean;
  code: string;
}
export type OrdersByStatus = {
  orderId: `0x${string}`;
  signer: `0x${string}`;
}[];

export type KeyCard = `0x${string}`;
export interface ShippingDetails {
  name: string;
  address1: string;
  city: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
}
export enum Status {
  Failed = "FAILED",
  Pending = "PENDING",
  Complete = "COMPLETE",
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
  id: `0x${string}`;
  items: { [key: `0x${string}`]: number };
  status: Status;
  shippingDetails?: ShippingDetails;
  txHash?: string;
  orderFinalized?: OrderFinalized;
}
export interface ShopCurrencies {
  tokenAddr: `0x${string}`;
  chainId: number;
}
//This interface is used to type a manifest obj for create, and these fields are required.
export interface CreateShopManifest {
  name: string;
  description: string;
}
export interface Payee {
  addr: `0x${string}`;
  callAsContract: boolean;
  chainId: number;
  name: string;
}
//This type is used to store and retrieve the manifest from db. All the fields are required in this case.
export type ShopManifest = CreateShopManifest & {
  tokenId: `0x${string}` | null;
  setBaseCurrency: ShopCurrencies | null;
  acceptedCurrencies: ShopCurrencies[];
  payee: Payee[];
  publishedTagId: `0x${string}` | null;
  profilePictureUrl: string;
};

//These UpdateShopManifest properties are only for updating the manifest and not properties on the store state.
//payee in type ShopManifest stores the actual state, while these update properties are for the update client request.
export interface UpdateShopManifest {
  removePayee?: Payee;
  addPayee?: Payee;
  addAcceptedCurrencies?: ShopCurrencies[];
  removeAcceptedCurrencies?: ShopCurrencies[];
}
export type ShopObjectTypes =
  | Item
  | Tag
  | KeyCard[]
  | Order
  | OrdersByStatus
  | ShopManifest;

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
  | "updateTag"
  | "sendMerchantSubscriptionRequest"
  | "sendGuestCheckoutSubscriptionRequest"
  | "sendGuestSubscriptionRequest"
  | "authenticate"
>;
export enum OrderState {
  STATE_UNSPECIFIED = 0,
  STATE_OPEN = 1,
  STATE_CANCELED = 2,
  STATE_COMMITED = 3,
  STATE_PAYMENT_TX = 4,
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
  id: `0x${string}`;
  price: string;
  metadata: Metadata;
  tags: `0x${string}`[];
  quantity: number;
  viewState: ListingViewState;
}

export interface Tag {
  id: `0x${string}`;
  name: string;
}

export interface IError {
  notFound: boolean;
  code: string;
}
export type OrdersByStatus = `0x${string}`[];

export type KeyCard = `0x${string}`[];
export interface ShippingDetails {
  name: string;
  address1: string;
  city: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  emailAddress: string;
}

export interface ChoosePayment {
  currency: {
    chainId: number;
    address: `0x${string}`;
  };
  payee: {
    name: string;
    address: `0x${string}`;
    chainId: number;
  };
}

export interface PaymentDetails {
  paymentId: string;
  total: string;
  shopSignature: `0x${string}`;
  ttl: string;
}
export interface Order {
  id: `0x${string}`;
  items: { [key: `0x${string}`]: number };
  status: OrderState;
  shippingDetails?: ShippingDetails;
  invoiceAddress?: ShippingDetails;
  txHash?: string;
  blockHash?: string;
  choosePayment?: ChoosePayment;
  paymentDetails?: PaymentDetails;
}
export interface ShopCurrencies {
  address: `0x${string}`;
  chainId: number;
}
export interface ShippingRegion {
  name: string;
  country: string;
  postalCode: string;
  city: string;
  orderPriceModifiers: OrderPriceModifier[];
}
export interface OrderPriceModifier {
  title: string;
  percentage?: `0x${string}`;
  absolute?: {
    plusSign: boolean;
    diff: `0x${string}`;
  };
}
//This interface is only for create manifest.
export interface CreateShopManifest {
  pricingCurrency: {
    address: `0x${string}` | null;
    chainId: number | null;
  };
  acceptedCurrencies: ShopCurrencies[];
  payees: Payee[];
  shippingRegions: ShippingRegion[];
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
  setPricingCurrency?: ShopCurrencies | null;
  addShippingRegions?: ShippingRegion[];
  removeShippingRegions?: string[];
}
export type SeqNo = number;
export type ShopObjectTypes =
  | Item
  | Tag
  | KeyCard
  | Order
  | OrdersByStatus
  | ShopManifest
  | SeqNo;

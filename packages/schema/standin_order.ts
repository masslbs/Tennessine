import { ChainAddress } from "./standin_manifest.ts";
import { BaseClass } from "./utils.ts";
import type {
  TAddressDetails,
  TOrder,
  TOrderedItem,
  TOrderPaid,
  TPaymentDetails,
  TChainAddress,
} from "./cbor.ts";

export class Order extends BaseClass {
  ID: number;
  Items: OrderedItem[];
  State: OrderState;
  InvoiceAddress?: AddressDetails;
  ShippingAddress?: AddressDetails;
  CanceledAt?: Date;
  ChosenPayee?: Payee;
  ChosenCurrency?: ChainAddress;
  PaymentDetails?: PaymentDetails;
  TxDetails?: OrderPaid;
  constructor(input: { get: <K extends keyof TOrder>(key: K) => TOrder[K] }) {
    super();
    this.ID = input.get("ID");
    const items = input.get("Items");
    this.Items = items
      ? items.map((item: TOrderedItem) =>
        new OrderedItem({
          get: <K extends keyof TOrderedItem>(key: K) => item[key],
        })
      )
      : [];
    this.State = OrderStateFromNumber(input.get("State"));
    this.InvoiceAddress = input.get("InvoiceAddress")
      ? new AddressDetails({
        get: <K extends keyof TAddressDetails>(key: K) =>
          input.get("InvoiceAddress")![key],
      })
      : undefined;
    this.ShippingAddress = input.get("ShippingAddress")
      ? new AddressDetails({
        get: <K extends keyof TAddressDetails>(key: K) =>
          input.get("ShippingAddress")![key],
      })
      : undefined;
    this.CanceledAt = input.get("CanceledAt");
    this.ChosenPayee = input.get("ChosenPayee")
      ? new Payee({get: <K extends keyof TChainAddress>(key: K) => input.get("ChosenPayee")![key]})
      : undefined;
    this.ChosenCurrency = input.get("ChosenCurrency")
      ? new ChainAddress({get: <K extends keyof TChainAddress>(key: K) => input.get("ChosenCurrency")![key]})
      : undefined;
    this.PaymentDetails = input.get("PaymentDetails")
      ? new PaymentDetails({get: <K extends keyof TPaymentDetails>(key: K) => input.get("PaymentDetails")![key]})
      : undefined;
    this.TxDetails = input.get("TxDetails")
      ? new OrderPaid({get: <K extends keyof TOrderPaid>(key: K) => input.get("TxDetails")![key]})
      : undefined;
  }
}

export class OrderedItem extends BaseClass {
  ListingID: number;
  VariationIDs: string[] = [];
  Quantity: number;
  constructor(
    input: { get: <K extends keyof TOrderedItem>(key: K) => TOrderedItem[K] },
  ) {
    super();
    this.ListingID = input.get("ListingID");
    this.VariationIDs = input.get("VariationIDs") ?? [];
    this.Quantity = input.get("Quantity");
  }
}

export enum OrderState {
  Unspecified = 0,
  Open = 1,
  Canceled = 2,
  Committed = 3,
  PaymentChosen = 4,
  Unpaid = 5,
  Paid = 6,
}

export function OrderStateFromNumber(num: number): OrderState {
  switch (num) {
    case 0:
      return OrderState.Unspecified;
    case 1:
      return OrderState.Open;
    case 2:
      return OrderState.Canceled;
    case 3:
      return OrderState.Committed;
    default:
      throw new Error(`Invalid order state: ${num}`);
  }
}

export class AddressDetails extends BaseClass {
  Name: string;
  Address1: string;
  Address2?: string;
  City: string;
  PostalCode: string;
  Country: string;
  EmailAddress?: string;
  PhoneNumber?: string;

  constructor(
    input: {
      get: <K extends keyof TAddressDetails>(key: K) => TAddressDetails[K];
    },
  ) {
    super();
    this.Name = input.get("Name");
    this.Address1 = input.get("Address1");
    this.Address2 = input.get("Address2");
    this.City = input.get("City");
    this.PostalCode = input.get("PostalCode");
    this.Country = input.get("Country");
    this.EmailAddress = input.get("EmailAddress");
    this.PhoneNumber = input.get("PhoneNumber");
  }
}

export class PaymentDetails extends BaseClass {
  PaymentID: string;
  Total: bigint;
  ListingHashes: string[];
  TTL: number;
  ShopSignature: string;
  constructor(
    input: {
      get: <K extends keyof TPaymentDetails>(key: K) => TPaymentDetails[K];
    },
  ) {
    super();
    this.PaymentID = input.get("PaymentID");
    this.Total = input.get("Total");
    this.ListingHashes = input.get("ListingHashes") ?? [];
    this.TTL = input.get("TTL");
    this.ShopSignature = input.get("ShopSignature");
  }
}

export class OrderPaid extends BaseClass {
  TxHash?: string;
  BlockHash: string;
  constructor(
    input: { get: <K extends keyof TOrderPaid>(key: K) => TOrderPaid[K] },
  ) {
    super();
    this.TxHash = input.get("TxHash");
    this.BlockHash = input.get("BlockHash");
  }
}

export class Payee extends BaseClass {
  ChainID: number;
  Address: string;
  constructor(
    input: {
      get: <K extends keyof TChainAddress>(key: K) => TChainAddress[K];
    },
  ) {
    super();
    this.ChainID = input.get("ChainID");
    this.Address = input.get("Address");
  }
}

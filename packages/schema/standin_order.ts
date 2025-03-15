import { ChainAddress } from "./standin_manifest.ts";

export class Order {
  ID: number;
  Items: OrderedItem[];
  State: OrderState;
  InvoiceAddress?: AddressDetails;
  ShippingAddress?: AddressDetails;
  CanceledAt?: string;
  ChosenPayee?: Payee;
  ChosenCurrency?: ChainAddress;
  PaymentDetails?: PaymentDetails;
  TxDetails?: OrderPaid;
  constructor(public input: Map<string, any>) {
    this.ID = input.get("ID");
    this.Items =
      input.get("Items")?.map((item: any) => new OrderedItem(item)) ?? [];
    this.State = OrderStateFromNumber(input.get("State"));
    this.InvoiceAddress = input.get("InvoiceAddress")
      ? new AddressDetails(input.get("InvoiceAddress"))
      : undefined;
    this.ShippingAddress = input.get("ShippingAddress")
      ? new AddressDetails(input.get("ShippingAddress"))
      : undefined;
    this.CanceledAt = input.get("CanceledAt");
    this.ChosenPayee = input.get("ChosenPayee")
      ? new Payee(input.get("ChosenPayee"))
      : undefined;
    this.ChosenCurrency = input.get("ChosenCurrency")
      ? new ChainAddress(input.get("ChosenCurrency"))
      : undefined;
    this.PaymentDetails = input.get("PaymentDetails")
      ? new PaymentDetails(input.get("PaymentDetails"))
      : undefined;
    this.TxDetails = input.get("TxDetails")
      ? new OrderPaid(input.get("TxDetails"))
      : undefined;
  }
}

export class OrderedItem {
  ListingID: number;
  VariationIDs: string[] = [];
  Quantity: number;
  constructor(public input: Map<string, any>) {
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

export class AddressDetails {
  Name: string;
  Address1: string;
  Address2?: string;
  City: string;
  PostalCode: string;
  Country: string;
  EmailAddress: string;
  PhoneNumber?: string;

  constructor(public input: Map<string, any>) {
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

export class PaymentDetails {
  PaymentID: string;
  Total: bigint;
  ListingHashes: string[];
  TTL: number;
  ShopSignature: string;
  constructor(public input: Map<string, any>) {
    this.PaymentID = input.get("PaymentID");
    this.Total = input.get("Total");
    this.ListingHashes = input.get("ListingHashes") ?? [];
    this.TTL = input.get("TTL");
    this.ShopSignature = input.get("ShopSignature");
  }
}

export class OrderPaid {
  TxHash?: string;
  BlockHash: string;
  constructor(public input: Map<string, any>) {
    this.TxHash = input.get("TxHash");
    this.BlockHash = input.get("BlockHash");
  }
}

export class Payee {
  ChainID: number;
  Address: string;
  constructor(public input: Map<string, any>) {
    this.ChainID = input.get("ChainID");
    this.Address = input.get("Address");
  }
}

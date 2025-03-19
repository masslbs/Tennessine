import { ChainAddress, Payee } from "./standin_manifest.ts";
import {
  BaseClass,
  ensureDate,
  ensureNumber,
  ensureSomeNumberAsBigInt,
  ensureString,
  ensureStringArray,
  ensureUint8Array,
} from "./utils.ts";

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

  constructor(input: Map<string, unknown>) {
    super();
    this.ID = ensureNumber(input.get("ID"), "ID");

    const items = input.get("Items");
    if (items !== undefined) {
      if (!Array.isArray(items)) {
        throw new TypeError("Expected Items to be an array");
      }
      this.Items = items.map((item) => {
        if (!(item instanceof Map)) {
          throw new TypeError("Expected item to be a Map");
        }
        return new OrderedItem(item);
      });
    } else {
      this.Items = [];
    }

    const stateNum = ensureNumber(input.get("State"), "State");
    this.State = OrderStateFromNumber(stateNum);

    const invoiceAddress = input.get("InvoiceAddress");
    if (invoiceAddress !== undefined) {
      if (!(invoiceAddress instanceof Map)) {
        throw new TypeError("Expected InvoiceAddress to be a Map");
      }
      this.InvoiceAddress = new AddressDetails(invoiceAddress);
    }

    const shippingAddress = input.get("ShippingAddress");
    if (shippingAddress !== undefined) {
      if (!(shippingAddress instanceof Map)) {
        throw new TypeError("Expected ShippingAddress to be a Map");
      }
      this.ShippingAddress = new AddressDetails(shippingAddress);
    }

    const canceledAt = input.get("CanceledAt");
    if (canceledAt !== undefined) {
      this.CanceledAt = ensureDate(canceledAt, "CanceledAt");
    }

    const chosenPayee = input.get("ChosenPayee");
    if (chosenPayee !== undefined) {
      if (!(chosenPayee instanceof Map)) {
        throw new TypeError("Expected ChosenPayee to be a Map");
      }
      this.ChosenPayee = new Payee(chosenPayee);
    }

    const chosenCurrency = input.get("ChosenCurrency");
    if (chosenCurrency !== undefined) {
      if (!(chosenCurrency instanceof Map)) {
        throw new TypeError("Expected ChosenCurrency to be a Map");
      }
      this.ChosenCurrency = new ChainAddress(chosenCurrency);
    }

    const paymentDetails = input.get("PaymentDetails");
    if (paymentDetails !== undefined) {
      if (!(paymentDetails instanceof Map)) {
        throw new TypeError("Expected PaymentDetails to be a Map");
      }
      this.PaymentDetails = new PaymentDetails(paymentDetails);
    }

    const txDetails = input.get("TxDetails");
    if (txDetails !== undefined) {
      if (!(txDetails instanceof Map)) {
        throw new TypeError("Expected TxDetails to be a Map");
      }
      this.TxDetails = new OrderPaid(txDetails);
    }
  }
}

export class OrderedItem extends BaseClass {
  ListingID: number;
  VariationIDs?: string[];
  Quantity: number;

  constructor(input: Map<string, unknown>) {
    super();
    this.ListingID = ensureNumber(input.get("ListingID"), "ListingID");

    const variationIDs = input.get("VariationIDs");
    if (variationIDs !== undefined) {
      this.VariationIDs = ensureStringArray(variationIDs, "VariationIDs");
    }

    this.Quantity = ensureNumber(input.get("Quantity"), "Quantity");
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
  EmailAddress: string;
  PhoneNumber?: string;

  constructor(input: Map<string, unknown>) {
    super();
    this.Name = ensureString(input.get("Name"), "Name");
    this.Address1 = ensureString(input.get("Address1"), "Address1");

    const address2 = input.get("Address2");
    if (address2 !== undefined) {
      this.Address2 = ensureString(address2, "Address2");
    }

    this.City = ensureString(input.get("City"), "City");
    this.PostalCode = ensureString(input.get("PostalCode"), "PostalCode");
    this.Country = ensureString(input.get("Country"), "Country");

    const emailAddress = input.get("EmailAddress");
    this.EmailAddress = ensureString(emailAddress, "EmailAddress");

    const phoneNumber = input.get("PhoneNumber");
    if (phoneNumber !== undefined) {
      this.PhoneNumber = ensureString(phoneNumber, "PhoneNumber");
    }
  }
}

export class PaymentDetails extends BaseClass {
  PaymentID: Uint8Array;
  Total: bigint | number;
  ListingHashes: Uint8Array[];
  TTL: number;
  ShopSignature: Uint8Array;

  constructor(input: Map<string, unknown>) {
    super();
    this.PaymentID = ensureUint8Array(input.get("PaymentID"), "PaymentID", 32);
    this.Total = ensureSomeNumberAsBigInt(input.get("Total"), "Total");

    const listingHashes = input.get("ListingHashes");
    if (listingHashes !== undefined) {
      if (!Array.isArray(listingHashes)) {
        throw new TypeError("Expected ListingHashes to be an array");
      }
      const verifiedHashes: Uint8Array[] = [];
      for (const [index, hash] of listingHashes.entries()) {
        if (!(hash instanceof Uint8Array)) {
          throw new TypeError("Expected hash to be a Uint8Array");
        }
        verifiedHashes.push(ensureUint8Array(hash, `hash ${index}`, 32));
      }
      this.ListingHashes = verifiedHashes;
    } else {
      this.ListingHashes = [];
    }

    this.TTL = ensureNumber(input.get("TTL"), "TTL");
    this.ShopSignature = ensureUint8Array(
      input.get("ShopSignature"),
      "ShopSignature",
      65,
    );
  }
}

export class OrderPaid extends BaseClass {
  TxHash?: Uint8Array;
  BlockHash: Uint8Array;

  constructor(input: Map<string, unknown>) {
    super();
    const txHash = input.get("TxHash");
    if (txHash !== undefined) {
      this.TxHash = ensureUint8Array(txHash, "TxHash", 32);
    }

    this.BlockHash = ensureUint8Array(input.get("BlockHash"), "BlockHash", 32);
  }
}

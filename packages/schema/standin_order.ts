import type { CodecKey, CodecValue } from "@massmarket/utils/codec";

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
  PaymentState: OrderPaymentState;
  InvoiceAddress?: AddressDetails;
  ShippingAddress?: AddressDetails;
  CanceledAt?: Date;
  ChosenPayee?: Payee;
  ChosenCurrency?: ChainAddress;
  PaymentDetails?: PaymentDetails;
  TxDetails?: OrderPaid;
  FulfilmentState?: string;
  CommentForCustomer?: string;

  constructor(
    id: number = 0,
    items: OrderedItem[] = [],
    paymentState: OrderPaymentState = OrderPaymentState.Unspecified,
    invoiceAddress?: AddressDetails,
    shippingAddress?: AddressDetails,
    canceledAt?: Date,
    chosenPayee?: Payee,
    chosenCurrency?: ChainAddress,
    paymentDetails?: PaymentDetails,
    txDetails?: OrderPaid,
    fulfilmentState?: string,
    commentForCustomer?: string,
  ) {
    super();
    this.ID = id;
    this.Items = items;
    this.PaymentState = paymentState;
    this.InvoiceAddress = invoiceAddress;
    this.ShippingAddress = shippingAddress;
    this.CanceledAt = canceledAt;
    this.ChosenPayee = chosenPayee;
    this.ChosenCurrency = chosenCurrency;
    this.PaymentDetails = paymentDetails;
    this.TxDetails = txDetails;
    this.FulfilmentState = fulfilmentState;
    this.CommentForCustomer = commentForCustomer;
  }

  static fromCBOR(value: CodecValue): Order {
    if (!(value instanceof Map)) {
      throw new TypeError("Expected value to be a Map");
    }
    const input = value as Map<CodecKey, CodecValue>;
    const id = ensureNumber(input.get("ID"), "ID");

    const items: OrderedItem[] = [];
    const itemsData = input.get("Items");
    if (itemsData !== undefined) {
      if (!Array.isArray(itemsData)) {
        throw new TypeError("Expected Items to be an array");
      }
      items.push(...itemsData.map((item) => {
        if (!(item instanceof Map)) {
          throw new TypeError("Expected item to be a Map");
        }
        return OrderedItem.fromCBOR(item);
      }));
    }

    const stateNum = ensureNumber(input.get("PaymentState"), "PaymentState");

    let invoiceAddress: AddressDetails | undefined;
    const invoiceAddressData = input.get("InvoiceAddress");
    if (invoiceAddressData !== undefined) {
      if (!(invoiceAddressData instanceof Map)) {
        throw new TypeError("Expected InvoiceAddress to be a Map");
      }
      invoiceAddress = AddressDetails.fromCBOR(invoiceAddressData);
    }

    let shippingAddress: AddressDetails | undefined;
    const shippingAddressData = input.get("ShippingAddress");
    if (shippingAddressData !== undefined) {
      if (!(shippingAddressData instanceof Map)) {
        throw new TypeError("Expected ShippingAddress to be a Map");
      }
      shippingAddress = AddressDetails.fromCBOR(shippingAddressData);
    }

    let canceledAt: Date | undefined;
    const canceledAtData = input.get("CanceledAt");
    if (canceledAtData !== undefined) {
      canceledAt = ensureDate(canceledAtData, "CanceledAt");
    }

    let chosenPayee: Payee | undefined;
    const chosenPayeeData = input.get("ChosenPayee");
    if (chosenPayeeData !== undefined) {
      if (!(chosenPayeeData instanceof Map)) {
        throw new TypeError("Expected ChosenPayee to be a Map");
      }
      chosenPayee = Payee.fromCBOR(chosenPayeeData);
    }

    let chosenCurrency: ChainAddress | undefined;
    const chosenCurrencyData = input.get("ChosenCurrency");
    if (chosenCurrencyData !== undefined) {
      if (!(chosenCurrencyData instanceof Map)) {
        throw new TypeError("Expected ChosenCurrency to be a Map");
      }
      chosenCurrency = ChainAddress.fromCBOR(chosenCurrencyData);
    }

    let paymentDetails: PaymentDetails | undefined;
    const paymentDetailsData = input.get("PaymentDetails");
    if (paymentDetailsData !== undefined) {
      if (!(paymentDetailsData instanceof Map)) {
        throw new TypeError("Expected PaymentDetails to be a Map");
      }
      paymentDetails = PaymentDetails.fromCBOR(paymentDetailsData);
    }

    let txDetails: OrderPaid | undefined;
    const txDetailsData = input.get("TxDetails");
    if (txDetailsData !== undefined) {
      if (!(txDetailsData instanceof Map)) {
        throw new TypeError("Expected TxDetails to be a Map");
      }
      txDetails = OrderPaid.fromCBOR(txDetailsData);
    }

    let fulfilmentState: string | undefined;
    const fulfilmentStateData = input.get("FulfilmentState");
    if (fulfilmentStateData !== undefined) {
      if (!(typeof fulfilmentStateData === "string")) {
        throw new TypeError("expected FulfilmentState to be string");
      }
      fulfilmentState = String(fulfilmentStateData);
    }

    let commentForCustomer: string | undefined;
    const commentForCustomerData = input.get("CommentForCustomer");
    if (commentForCustomerData !== undefined) {
      if (!(typeof commentForCustomerData === "string")) {
        throw new TypeError("expected CommentForCustomer to be string");
      }
      commentForCustomer = String(commentForCustomerData);
    }

    return new Order(
      id,
      items,
      stateNum,
      invoiceAddress,
      shippingAddress,
      canceledAt,
      chosenPayee,
      chosenCurrency,
      paymentDetails,
      txDetails,
      fulfilmentState,
      commentForCustomer,
    );
  }
}

export class OrderedItem extends BaseClass {
  ListingID: number;
  VariationIDs?: string[];
  Quantity: number;

  constructor(
    listingID: number = 0,
    quantity: number = 1,
    variationIDs?: string[],
  ) {
    super();
    this.ListingID = listingID;
    this.Quantity = quantity;
    this.VariationIDs = variationIDs;
  }

  static fromCBOR(value: CodecValue): OrderedItem {
    if (!(value instanceof Map)) {
      throw new TypeError("Expected value to be a Map");
    }
    const input = value as Map<CodecKey, CodecValue>;
    const listingID = ensureNumber(input.get("ListingID"), "ListingID");
    const quantity = ensureNumber(input.get("Quantity"), "Quantity");

    let variationIDs: string[] | undefined;
    const variationIDsData = input.get("VariationIDs");
    if (variationIDsData !== undefined) {
      variationIDs = ensureStringArray(variationIDsData, "VariationIDs");
    }

    return new OrderedItem(listingID, quantity, variationIDs);
  }
}

export enum OrderPaymentState {
  Unspecified,
  Open,
  Canceled,
  Committed,
  PaymentChosen,
  Unpaid,
  Paid,
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

  constructor(
    name: string = "",
    address1: string = "",
    city: string = "",
    postalCode: string = "",
    country: string = "",
    emailAddress: string = "",
    address2?: string,
    phoneNumber?: string,
  ) {
    super();
    this.Name = name;
    this.Address1 = address1;
    this.Address2 = address2;
    this.City = city;
    this.PostalCode = postalCode;
    this.Country = country;
    this.EmailAddress = emailAddress;
    this.PhoneNumber = phoneNumber;
  }

  static fromCBOR(value: CodecValue): AddressDetails {
    if (!(value instanceof Map)) {
      throw new TypeError("Expected value to be a Map");
    }
    const input = value as Map<CodecKey, CodecValue>;
    const name = ensureString(input.get("Name"), "Name");
    const address1 = ensureString(input.get("Address1"), "Address1");
    const city = ensureString(input.get("City"), "City");
    const postalCode = ensureString(input.get("PostalCode"), "PostalCode");
    const country = ensureString(input.get("Country"), "Country");
    const emailAddress = ensureString(
      input.get("EmailAddress"),
      "EmailAddress",
    );

    let address2: string | undefined;
    const address2Data = input.get("Address2");
    if (address2Data !== undefined) {
      address2 = ensureString(address2Data, "Address2");
    }

    let phoneNumber: string | undefined;
    const phoneNumberData = input.get("PhoneNumber");
    if (phoneNumberData !== undefined) {
      phoneNumber = ensureString(phoneNumberData, "PhoneNumber");
    }

    return new AddressDetails(
      name,
      address1,
      city,
      postalCode,
      country,
      emailAddress,
      address2,
      phoneNumber,
    );
  }
}

export class PaymentDetails extends BaseClass {
  PaymentID: Uint8Array;
  Total: bigint | number;
  ListingHashes: Uint8Array[];
  TTL: number;
  ShopSignature: Uint8Array;

  constructor(
    paymentID: Uint8Array = new Uint8Array(32),
    total: bigint | number = 0n,
    ttl: number = 0,
    shopSignature: Uint8Array = new Uint8Array(65),
    listingHashes: Uint8Array[] = [],
  ) {
    super();
    this.PaymentID = paymentID;
    this.Total = total;
    this.ListingHashes = listingHashes;
    this.TTL = ttl;
    this.ShopSignature = shopSignature;
  }

  static fromCBOR(value: CodecValue): PaymentDetails {
    if (!(value instanceof Map)) {
      throw new TypeError("Expected value to be a Map");
    }
    const input = value as Map<CodecKey, CodecValue>;
    const paymentID = ensureUint8Array(input.get("PaymentID"), "PaymentID", 32);
    const total = ensureSomeNumberAsBigInt(input.get("Total"), "Total");
    const ttl = ensureNumber(input.get("TTL"), "TTL");
    const shopSignature = ensureUint8Array(
      input.get("ShopSignature"),
      "ShopSignature",
      65,
    );

    const listingHashes: Uint8Array[] = [];
    const listingHashesData = input.get("ListingHashes");
    if (listingHashesData !== undefined) {
      if (!Array.isArray(listingHashesData)) {
        throw new TypeError("Expected ListingHashes to be an array");
      }
      for (const [index, hash] of listingHashesData.entries()) {
        if (!(hash instanceof Uint8Array)) {
          throw new TypeError("Expected hash to be a Uint8Array");
        }
        listingHashes.push(ensureUint8Array(hash, `hash ${index}`, 32));
      }
    }

    return new PaymentDetails(
      paymentID,
      total,
      ttl,
      shopSignature,
      listingHashes,
    );
  }
}

export class OrderPaid extends BaseClass {
  TxHash?: Uint8Array;
  BlockHash: Uint8Array;

  constructor(blockHash: Uint8Array = new Uint8Array(32), txHash?: Uint8Array) {
    super();
    this.BlockHash = blockHash;
    this.TxHash = txHash;
  }

  static fromCBOR(value: CodecValue): OrderPaid {
    if (!(value instanceof Map)) {
      throw new TypeError("Expected value to be a Map");
    }
    const input = value as Map<CodecKey, CodecValue>;
    const blockHash = ensureUint8Array(input.get("BlockHash"), "BlockHash", 32);

    let txHash: Uint8Array | undefined;
    const txHashData = input.get("TxHash");
    if (txHashData !== undefined) {
      txHash = ensureUint8Array(txHashData, "TxHash", 32);
    }

    return new OrderPaid(blockHash, txHash);
  }
}

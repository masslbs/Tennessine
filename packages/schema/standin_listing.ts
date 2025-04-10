import { CodecKey, CodecValue } from "@massmarket/utils/codec";
import { PriceModifier } from "./standin_manifest.ts";
import {
  BaseClass,
  ensureBoolean,
  ensureNumber,
  ensureSomeNumberAsBigInt,
  ensureString,
  ensureStringArray,
} from "./utils.ts";

export class Listing extends BaseClass {
  ID: number;
  Price: bigint;
  Metadata: ListingMetadata;
  ViewState: ListingViewState;
  Options?: Map<CodecKey, ListingOption>;
  StockStatuses?: ListingStockStatus[];

  constructor(
    id: number = 0,
    price: bigint = BigInt(0),
    metadata?: ListingMetadata,
    viewState: ListingViewState = ListingViewState.Unspecified,
  ) {
    super();
    this.ID = id;
    this.Price = price;
    this.Metadata = metadata || new ListingMetadata("", "");
    this.ViewState = viewState;
  }

  static fromCBOR(value: CodecValue): Listing {
    if (!(value instanceof Map)) {
      throw new TypeError("Expected value to be a Map");
    }
    const input = value as Map<CodecKey, CodecValue>;
    const id = ensureNumber(input.get("ID"), "ID");
    const price = ensureSomeNumberAsBigInt(input.get("Price"), "Price");

    const metadata = input.get("Metadata");
    if (!(metadata instanceof Map)) {
      throw new TypeError("Expected Metadata to be a Map");
    }
    const metadataObj = ListingMetadata.fromCBOR(metadata);

    const viewStateNum = ensureNumber(input.get("ViewState"), "ViewState");
    const viewState = ViewStateFromNumber(viewStateNum);

    // @ts-ignore TODO: see comment on ensureSomeNumberAsBigInt about treatment of bigint
    const listing = new Listing(id, price, metadataObj, viewState);

    const options = input.get("Options");
    if (options !== undefined) {
      if (!(options instanceof Map)) {
        throw new TypeError("Expected Options to be a Map");
      }
      const map = new Map<CodecKey, ListingOption>();
      for (const [key, value] of options) {
        if (!(value instanceof Map)) {
          throw new TypeError(`Expected option value for ${key} to be a Map`);
        }
        map.set(key, ListingOption.fromCBOR(value));
      }
      listing.Options = map;
    }

    const stockStatuses = input.get("StockStatuses");
    if (stockStatuses !== undefined) {
      if (!Array.isArray(stockStatuses)) {
        throw new TypeError("Expected StockStatuses to be an array");
      }
      listing.StockStatuses = stockStatuses.map((stockStatus) => {
        if (!(stockStatus instanceof Map)) {
          throw new TypeError("Expected stockStatus item to be a Map");
        }
        return ListingStockStatus.fromCBOR(stockStatus);
      });
    }

    return listing;
  }
}

export class ListingMetadata {
  Title: string;
  Description: string;
  Images?: string[];

  constructor(title: string, description: string, images?: string[]) {
    this.Title = title;
    this.Description = description;
    this.Images = images;
  }

  static fromCBOR(input: Map<CodecKey, CodecValue>): ListingMetadata {
    const title = ensureString(input.get("Title"), "Title");
    const description = ensureString(input.get("Description"), "Description");

    const images = input.get("Images");
    if (images !== undefined) {
      return new ListingMetadata(
        title,
        description,
        ensureStringArray(images, "Images"),
      );
    }

    return new ListingMetadata(title, description);
  }

  asCBORMap(): CodecValue {
    const map = new Map<CodecKey, CodecValue>();
    map.set("Title", this.Title);
    map.set("Description", this.Description);
    if (this.Images) {
      map.set("Images", this.Images);
    }
    return map;
  }
}

export enum ListingViewState {
  Unspecified = 0,
  Published = 1,
  Deleted = 2,
}

export function ViewStateFromNumber(num: number): ListingViewState {
  switch (num) {
    case 0:
      return ListingViewState.Unspecified;
    case 1:
      return ListingViewState.Published;
    case 2:
      return ListingViewState.Deleted;
    default:
      throw new Error(`Invalid view state: ${num}`);
  }
}

export class ListingVariation extends BaseClass {
  VariationInfo?: ListingMetadata;
  PriceModifier?: PriceModifier;
  SKU?: string;

  constructor(
    variationInfo?: ListingMetadata,
    priceModifier?: PriceModifier,
    sku?: string,
  ) {
    super();
    this.VariationInfo = variationInfo;
    this.PriceModifier = priceModifier;
    this.SKU = sku;
  }

  static fromCBOR(input: Map<CodecKey, CodecValue>): ListingVariation {
    const variation = new ListingVariation();

    const metadata = input.get("VariationInfo");
    if (metadata !== undefined) {
      if (!(metadata instanceof Map)) {
        throw new TypeError("Expected VariationInfo to be a Map");
      }
      variation.VariationInfo = ListingMetadata.fromCBOR(metadata);
    }

    const priceModifier = input.get("PriceModifier");
    if (priceModifier !== undefined) {
      if (!(priceModifier instanceof Map)) {
        throw new TypeError("Expected PriceModifier to be a Map");
      }
      variation.PriceModifier = PriceModifier.fromCBOR(
        priceModifier as Map<CodecKey, CodecValue>,
      );
    }

    const sku = input.get("SKU");
    if (sku !== undefined) {
      variation.SKU = ensureString(sku, "SKU");
    }

    return variation;
  }
}

export class ListingOption extends BaseClass {
  Title: string;
  Variations: Map<CodecKey, ListingVariation> | undefined;

  constructor(title: string, variations?: Map<CodecKey, ListingVariation>) {
    super();
    this.Title = title;
    this.Variations = variations;
  }

  static fromCBOR(input: Map<CodecKey, CodecValue>): ListingOption {
    const title = ensureString(input.get("Title"), "Title");
    const option = new ListingOption(title);

    const variations = input.get("Variations");
    if (variations) {
      if (!(variations instanceof Map)) {
        throw new TypeError("Expected Variations to be a Map");
      }
      const map = new Map<CodecKey, ListingVariation>();
      for (const [key, val] of variations) {
        if (!(val instanceof Map)) {
          throw new TypeError(
            `Expected variation value for ${key} to be a Map`,
          );
        }
        map.set(
          key,
          ListingVariation.fromCBOR(val),
        );
      }
      option.Variations = map;
    }

    return option;
  }
}

export class ListingStockStatus extends BaseClass {
  VariationIDs: string[];
  InStock?: boolean;
  ExpectedInStockBy?: Date;

  constructor(
    variationIDs: string[] = [],
    inStock?: boolean,
    expectedInStockBy?: Date,
  ) {
    super();
    this.VariationIDs = variationIDs;
    this.InStock = inStock;
    this.ExpectedInStockBy = expectedInStockBy;
  }

  static fromCBOR(input: Map<CodecKey, CodecValue>): ListingStockStatus {
    const stockStatus = new ListingStockStatus();

    const variationIDs = input.get("VariationIDs");
    stockStatus.VariationIDs = variationIDs
      ? ensureStringArray(variationIDs, "VariationIDs")
      : [];

    const inStock = input.get("InStock");
    if (inStock !== undefined) {
      stockStatus.InStock = ensureBoolean(inStock, "InStock");
    }

    const expectedInStockBy = input.get("ExpectedInStockBy");
    if (expectedInStockBy !== undefined) {
      if (!(expectedInStockBy instanceof Date)) {
        throw new TypeError("Expected ExpectedInStockBy to be a Date object");
      }
      stockStatus.ExpectedInStockBy = expectedInStockBy;
    }

    return stockStatus;
  }
}

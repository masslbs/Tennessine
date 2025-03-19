import { PriceModifier } from "./standin_manifest.ts";
import {
  BaseClass,
  ensureBoolean,
  ensureNumber,
  ensureString,
  ensureStringArray,
} from "./utils.ts";

export class Listing extends BaseClass {
  ID: number;
  Price: number;
  Metadata: ListingMetadata;
  ViewState: ListingViewState;
  Options?: Map<string, ListingOption>;
  StockStatuses?: ListingStockStatus[];

  constructor(input: Map<string, unknown>) {
    super();
    this.ID = ensureNumber(input.get("ID"), "ID");
    this.Price = ensureNumber(input.get("Price"), "Price");

    const metadata = input.get("Metadata");
    if (!(metadata instanceof Map)) {
      throw new TypeError("Expected Metadata to be a Map");
    }
    this.Metadata = new ListingMetadata(metadata);

    const viewStateNum = ensureNumber(input.get("ViewState"), "ViewState");
    this.ViewState = ViewStateFromNumber(viewStateNum);

    const options = input.get("Options");
    if (options !== undefined) {
      if (!(options instanceof Map)) {
        throw new TypeError("Expected Options to be a Map");
      }
      const map = new Map<string, ListingOption>();
      for (const [key, value] of options) {
        if (!(value instanceof Map)) {
          throw new TypeError(`Expected option value for ${key} to be a Map`);
        }
        map.set(key, new ListingOption(value));
      }
      this.Options = map;
    }

    const stockStatuses = input.get("StockStatuses");
    if (stockStatuses !== undefined) {
      if (!Array.isArray(stockStatuses)) {
        throw new TypeError("Expected StockStatuses to be an array");
      }
      this.StockStatuses = stockStatuses.map((stockStatus) => {
        if (!(stockStatus instanceof Map)) {
          throw new TypeError("Expected stockStatus item to be a Map");
        }
        return new ListingStockStatus(stockStatus);
      });
    }
  }
}

export class ListingMetadata {
  Title: string;
  Description: string;
  Images?: string[];

  constructor(input: Map<string, unknown>) {
    this.Title = ensureString(input.get("Title"), "Title");
    this.Description = ensureString(input.get("Description"), "Description");

    const images = input.get("Images");
    if (images !== undefined) {
      this.Images = ensureStringArray(images, "Images");
    }
  }

  asCBORMap(): Map<string, unknown> {
    const map = new Map<string, unknown>();
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

  constructor(input: Map<string, unknown>) {
    super();
    const metadata = input.get("VariationInfo");
    if (metadata !== undefined) {
      if (!(metadata instanceof Map)) {
        throw new TypeError("Expected VariationInfo to be a Map");
      }
      this.VariationInfo = new ListingMetadata(metadata);
    }

    const priceModifier = input.get("PriceModifier");
    if (priceModifier !== undefined) {
      if (!(priceModifier instanceof Map)) {
        throw new TypeError("Expected PriceModifier to be a Map");
      }
      this.PriceModifier = new PriceModifier(priceModifier);
    }

    const sku = input.get("SKU");
    if (sku !== undefined) {
      this.SKU = ensureString(sku, "SKU");
    }
  }
}

export class ListingOption extends BaseClass {
  Title: string;
  Variations: Map<string, ListingVariation> | undefined;

  constructor(input: Map<string, unknown>) {
    super();
    this.Title = ensureString(input.get("Title"), "Title");
    const variations = input.get("Variations");

    if (variations) {
      if (!(variations instanceof Map)) {
        throw new TypeError("Expected Variations to be a Map");
      }
      const map = new Map<string, ListingVariation>();
      for (const [key, val] of variations) {
        if (!(val instanceof Map)) {
          throw new TypeError(
            `Expected variation value for ${key} to be a Map`,
          );
        }
        map.set(
          key,
          new ListingVariation(val),
        );
      }
      this.Variations = map;
    }
  }
}

export class ListingStockStatus extends BaseClass {
  VariationIDs: string[];
  InStock?: boolean;
  ExpectedInStockBy?: Date;

  constructor(input: Map<string, unknown>) {
    super();
    const variationIDs = input.get("VariationIDs");
    this.VariationIDs = variationIDs
      ? ensureStringArray(variationIDs, "VariationIDs")
      : [];

    const inStock = input.get("InStock");
    if (inStock !== undefined) {
      this.InStock = ensureBoolean(inStock, "InStock");
    }

    const expectedInStockBy = input.get("ExpectedInStockBy");
    if (expectedInStockBy !== undefined) {
      if (!(expectedInStockBy instanceof Date)) {
        throw new TypeError("Expected ExpectedInStockBy to be a Date object");
      }
      this.ExpectedInStockBy = expectedInStockBy;
    }
  }
}

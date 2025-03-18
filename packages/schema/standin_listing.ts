import { PriceModifier } from "./standin_manifest.ts";
import { BaseClass } from "./utils.ts";

export class Listing extends BaseClass {
  ID: number;
  Price: number;
  Metadata: ListingMetadata;
  ViewState: ListingViewState;
  Options?: Map<string, ListingOption>;
  StockStatuses?: ListingStockStatus[];

  constructor(input: Map<string, unknown>) {
    super();
    this.ID = input.get("ID") as number;
    this.Price = input.get("Price") as number;
    const metadata = input.get("Metadata");
    // since metadata does not return a map with a getter and ListingMetadata expects a map, this is a workaround for typescript.
    this.Metadata = new ListingMetadata(metadata as Map<string, unknown>);
    this.ViewState = ViewStateFromNumber(
      input.get("ViewState") as ListingViewState,
    );
    const options = input.get("Options") as Map<string, unknown>;
    if (options) {
      const map = new Map<string, ListingOption>();
      for (const [key, value] of options) {
        map.set(key, new ListingOption(value as Map<string, unknown>));
      }
      this.Options = map;
    }
    const stockStatuses = input.get("StockStatuses") as Map<string, unknown>[];
    if (stockStatuses) {
      this.StockStatuses = stockStatuses.map((
        stockStatus: Map<string, unknown>,
      ) => new ListingStockStatus(stockStatus));
    }
  }
}

export class ListingMetadata {
  Title: string;
  Description: string;
  Images?: string[];

  constructor(input: Map<string, unknown>) {
    this.Title = input.get("Title") as string;
    this.Description = input.get("Description") as string;
    this.Images = input.get("Images") as string[] | undefined;
  }

  returnAsMap(): Map<string, unknown> {
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
    this.VariationInfo = metadata
      ? new ListingMetadata(metadata as Map<string, unknown>)
      : undefined;
    const priceModifier = input.get("PriceModifier");
    this.PriceModifier = priceModifier
      ? new PriceModifier(priceModifier as Map<string, unknown>)
      : undefined;
    this.SKU = input.get("SKU") as string;
  }
}

export class ListingOption extends BaseClass {
  Title: string;
  Variations: Map<string, ListingVariation> | undefined;

  constructor(input: Map<string, unknown>) {
    super();
    this.Title = input.get("Title") as string;
    const variations = input.get("Variations") as Map<string, unknown>;

    if (variations) {
      const map = new Map<string, ListingVariation>();
      for (const [key, val] of variations) {
        map.set(
          key,
          new ListingVariation(val as Map<string, unknown>),
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
    this.VariationIDs = input.get("VariationIDs") as string[] ?? [];
    this.InStock = input.get("InStock") as boolean;
    if (input.get("ExpectedInStockBy")) {
      this.ExpectedInStockBy = input.get("ExpectedInStockBy") as Date;
    }
  }
}

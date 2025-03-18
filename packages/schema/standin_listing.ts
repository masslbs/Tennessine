import { string } from "@valibot/valibot";
import { PriceModifier } from "./standin_manifest.ts";
import { BaseClass } from "./utils.ts";

export class Listing extends BaseClass {
  ID: number;
  Price: number;
  Metadata: ListingMetadata;
  ViewState: ListingViewState;
  Options?: Map<string, ListingOption>;
  StockStatuses?: ListingStockStatus[];

  constructor(input: Map<string, any>) {
    super();
    this.ID = input.get("ID")!;
    this.Price = input.get("Price")!;
    const metadata = input.get("Metadata");
    // since metadata does not return a map with a getter and ListingMetadata expects a map, this is a workaround for typescript.
    this.Metadata = new ListingMetadata(metadata);
    this.ViewState = ViewStateFromNumber(input.get("ViewState"));
    const options = input.get("Options");
    if (options) {
      const map = new Map<string, ListingOption>();
      for (const [key, value] of options) {
        map.set(key, new ListingOption(value));
      }
      this.Options = map;
    }
    const stockStatuses = input.get("StockStatuses");
    if (stockStatuses) {
      this.StockStatuses = stockStatuses.map((stockStatus: Map<string, any>) =>
        new ListingStockStatus(stockStatus)
      );
    }
  }
}

export class ListingMetadata {
  Title: string;
  Description: string;
  Images?: string[];

  constructor(input: Map<string, any>) {
    this.Title = input.get("Title") as string;
    this.Description = input.get("Description") as string;
    this.Images = input.get("Images") as string[] | undefined;
  }

  returnAsMap(): Map<string, any> {
    const map = new Map<string, any>();
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

  constructor(input: Map<string, any>) {
    super();
    const metadata = input.get("VariationInfo");
    this.VariationInfo = metadata ? new ListingMetadata(metadata) : undefined;
    const priceModifier = input.get("PriceModifier");
    this.PriceModifier = priceModifier
      ? new PriceModifier(priceModifier)
      : undefined;
    this.SKU = input.get("SKU");
  }
}

export class ListingOption extends BaseClass {
  Title: string;
  Variations: Map<string, ListingVariation> | undefined;

  constructor(input: Map<string, any>) {
    super();
    this.Title = input.get("Title");
    const variations = input.get("Variations");

    if (variations) {
      const map = new Map<string, ListingVariation>();
      for (const [key, val] of variations) {
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

  constructor(input: Map<string, any>) {
    super();
    this.VariationIDs = input.get("VariationIDs") ?? [];

    this.InStock = input.get("InStock");

    if (input.get("ExpectedInStockBy")) {
      this.ExpectedInStockBy = input.get("ExpectedInStockBy");
    }
  }
}

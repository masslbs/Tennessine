import { PriceModifier } from "./standin_manifest.ts";
import { BaseClass } from "./utils.ts";
export interface ListingStockStatus {
  variationIds: string[];
  inStock: boolean | null;
  expectedInStockBy: Date | null;
}

export class Listing extends BaseClass {
  ID: number;
  Price: bigint;
  Metadata: ListingMetadata;
  ViewState: ListingViewState;
  Options: Map<string, ListingOption>;
  StockStatuses: Map<string, ListingStockStatus[]>;

  constructor(input: Map<string, any>) {
    super();
    this.ID = input.get("ID");
    this.Price = input.get("Price");
    this.Metadata = new ListingMetadata(input.get("Metadata"));
    this.ViewState = ViewStateFromNumber(input.get("ViewState"));
    this.Options = input.get("Options");
    this.StockStatuses = input.get("StockStatuses");
  }
}

export class ListingMetadata extends BaseClass {
  Title: string;
  Description: string;
  Images: string[];

  constructor(input: Map<string, any>) {
    super();
    this.Title = input.get("Title");
    this.Description = input.get("Description");
    this.Images = input.get("Images") ?? [];
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

export class ListingOption extends BaseClass {
  Title: string;
  Variations: Map<string, ListingVariation>;

  constructor(input: Map<string, any>) {
    super();
    this.Title = input.get("Title");
    this.Variations = input.get("Variations");
  }
}

export class ListingVariation extends BaseClass {
  VariationInfo: ListingMetadata;
  PriceModifier: PriceModifier;
  SKU: string;

  constructor(input: Map<string, any>) {
    super();
    this.VariationInfo = new ListingMetadata(input.get("VariationInfo"));
    this.PriceModifier = new PriceModifier(input.get("PriceModifier"));
    this.SKU = input.get("SKU");
  }
}

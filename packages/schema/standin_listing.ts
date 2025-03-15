import { PriceModifier } from "./standin_manifest.ts";

export class Listing {
  ID: number;
  Price: bigint;
  Metadata: ListingMetadata;
  ViewState: ListingViewState;
  Options: Map<string, ListingOption>;
  StockStatuses: Map<string, ListingStockStatus>;

  constructor(public input: Map<string, any>) {
    // console.log("listing input", input);
    this.ID = input.get("ID");
    this.Price = input.get("Price");
    this.Metadata = new ListingMetadata(input.get("Metadata"));
    this.ViewState = ViewStateFromNumber(input.get("ViewState"));
    this.Options = input.get("Options");
    this.StockStatuses = input.get("StockStatuses");
  }
}

export class ListingMetadata {
  Title: string;
  Description: string;
  Images: URL[];

  constructor(public input: Map<string, any>) {
    // console.log("metadata input", input);
    this.Title = input.get("Title");
    this.Description = input.get("Description");

    // Ensure all images are valid URLs
    const images = input.get("Images") ?? [];
    this.Images = images.map((img: string) => {
      return new URL(img);
    });
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

export class ListingOption {
  Title: string;
  Variations: Map<string, ListingVariation>;

  constructor(public input: Map<string, any>) {
    this.Title = input.get("Title");
    this.Variations = input.get("Variations");
  }
}

export class ListingVariation {
  VariationInfo: ListingMetadata;
  PriceModifier: PriceModifier;
  SKU: string;

  constructor(public input: Map<string, any>) {
    this.VariationInfo = new ListingMetadata(input.get("VariationInfo"));
    this.PriceModifier = new PriceModifier(input.get("PriceModifier"));
    this.SKU = input.get("SKU");
  }
}

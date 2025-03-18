import { PriceModifier } from "./standin_manifest.ts";
import { BaseClass } from "./utils.ts";
import type {
  TListing,
  TListingMetadata,
  TListingOption,
  TListingStockStatus,
  TListingVariation,
  TPriceModifier,
} from "./cbor.ts";

export class Listing extends BaseClass {
  ID: number;
  Price: number;
  Metadata: ListingMetadata;
  ViewState: ListingViewState;
  Options: Map<string, ListingOption> | undefined;
  StockStatuses: TListingStockStatus[] | undefined;

  constructor(input: {
    get<K extends keyof TListing>(key: K): TListing[K];
  }) {
    super();
    this.ID = input.get("ID")!;
    this.Price = input.get("Price")!;
    const metadata = input.get("Metadata");
    // since metadata does not return a map with a getter and ListingMetadata expects a map, this is a workaround for typescript.
    this.Metadata = new ListingMetadata({
      get: <K extends keyof TListingMetadata>(key: K) => metadata[key],
    });
    this.ViewState = ViewStateFromNumber(input.get("ViewState"));
    const options = input.get("Options");
    if (options) {
      const map = new Map<string, ListingOption>();
      for (const [key, value] of options) {
        map.set(
          key,
          new ListingOption({
            get: <K extends keyof TListingOption>(_key: K) => value[_key],
          }),
        );
      }
      this.Options = map;
    }
    this.StockStatuses = input.get("StockStatuses");
  }
}

export class ListingMetadata extends BaseClass {
  Title: string;
  Description: string;
  Images: string[];

  constructor(
    input: {
      get: <K extends keyof TListingMetadata>(key: K) => TListingMetadata[K];
    },
  ) {
    super();
    this.Title = input.get("Title") as string;
    this.Description = input.get("Description") as string;
    this.Images = input.get("Images") as string[] ?? [];
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
  VariationInfo: ListingMetadata;
  PriceModifier: PriceModifier | undefined;
  SKU: string | undefined;

  constructor(
    input: {
      get<K extends keyof TListingVariation>(key: K): TListingVariation[K];
    },
  ) {
    super();
    const metadata = input.get("VariationInfo");
    this.VariationInfo = new ListingMetadata({
      get: <K extends keyof TListingMetadata>(key: K) => metadata[key],
    });
    const priceModifier = input.get("PriceModifier");
    this.PriceModifier = priceModifier
      ? new PriceModifier({
        get: <K extends keyof TPriceModifier>(key: K) => priceModifier[key],
        has: <K extends keyof TPriceModifier>(key: K) =>
          Boolean(priceModifier[key]),
      })
      : undefined;
    this.SKU = input.get("SKU");
  }
}

export class ListingOption extends BaseClass {
  Title: string;
  Variations: Map<string, ListingVariation> | undefined;

  constructor(
    input: { get<K extends keyof TListingOption>(key: K): TListingOption[K] },
  ) {
    super();
    this.Title = input.get("Title");
    const variations = input.get("Variations");

    if (variations) {
      const map = new Map<string, ListingVariation>();
      for (const [key, val] of variations) {
        map.set(
          key,
          new ListingVariation({
            get: <K extends keyof TListingVariation>(_key: K) => val[_key],
          }),
        );
      }
      this.Variations = map;
    }
  }
}

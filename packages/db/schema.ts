import * as v from "jsr:@valibot/valibot";

export const PatchSchema = v.array(
  v.intersect([
    v.object({
      path: v.string(),
    }),
    v.variant("op", [
      v.object({
        op: v.union([
          v.literal("add"),
          v.literal("replace"),
          v.literal("test"),
        ]),
        value: v.any(),
      }),
      v.object({
        op: v.union([v.literal("copy"), v.literal("move")]),
        from: v.string(),
      }),
      v.object({
        op: v.literal("remove"),
      }),
    ]),
  ]),
);

export const StoreSchema = v.object({
  Manifest: v.object({
    ShopId: v.number(),
    Payees: v.record(
      v.string(),
      v.object({
        Address: v.object({
          ChainId: v.number(),
          Address: v.string(),
        }),
        CallAsContract: v.boolean(),
      }),
    ),
    PriceingCurrency: v.object({
      ChainID: v.number(),
      Address: v.string(),
    }),
    ShippingRegions: v.record(
      v.string(),
      v.object({
        Country: v.string(),
        PostCode: v.string(),
        City: v.string(),
        PriceModifier: v.optional(v.number()),
      }),
    ),
  }),
  Orders: v.record(
    v.string(),
    v.object({
      ID: v.number(),
      Items: v.array(v.object({
        ListingId: v.number(),
        Quantity: v.number(),
        VariationsIDs: v.array(v.number()),
      })),
      State: v.number(),
      InvoiceAddress: v.optional(v.string()),
      ShippingAddress: v.optional(v.string()),
      CanceledAt: v.optional(v.date()),
      ChosenPayee: v.optional(v.string()),
      ChosenCurrency: v.optional(v.string()),
      TxDetails: v.optional(v.string()),
    }),
  ),
  Accounts: v.record(
    v.string(),
    v.object({
      KeyCards: v.array(v.string()),
      Guest: v.boolean(),
    }),
  ),
  Tags: v.record(
    v.string(),
    v.object({
      Name: v.string(),
      ListingIds: v.array(v.number()),
    }),
  ),
  Listings: v.record(
    v.string(),
    v.object({
      ID: v.number(),
      Name: v.string(),
      Metadata: v.object({
        Title: v.string(),
        Description: v.string(),
        Images: v.array(v.string()),
      }),
      Price: v.number(),
      ViewState: v.number(),
      Options: v.optional(v.array(v.string())),
      StockStatuses: v.optional(v.string()),
    }),
  ),
});

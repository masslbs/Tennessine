import * as v from "@valibot/valibot";

export const OpSchema = v.intersect([
  v.object({
    path: v.array(v.string()),
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
]);
export const PatchSchema = v.object({
  signature: v.instance(Uint8Array),
  seqNum: v.number(),
  keycard: v.instance(Uint8Array),
  account: v.instance(Uint8Array),
  ops: v.array(
    OpSchema,
  ),
});

export const BaseObjectSchema = v.object({
  Accounts: v.record(
    v.string(),
    v.object({
      KeyCards: v.array(v.string()),
      Guest: v.boolean(),
    }),
  ),
});

const CurrencySchema = v.object({
  ChainID: v.number(),
  Address: v.string(),
});

export const ShopSchema = v.object({
  ...BaseObjectSchema.entries,
  Manifest: v.object({
    ShopID: v.bigint(),
    Payees: v.record(
      v.string(),
      v.object({
        Address: CurrencySchema,
        CallAsContract: v.boolean(),
      }),
    ),
    AcceptedCurrencies: v.array(CurrencySchema),
    PricingCurrency: CurrencySchema,
    ShippingRegions: v.record(
      v.string(),
      v.object({
        Country: v.string(),
        Postcode: v.string(),
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

export type TPatch = v.InferInput<typeof PatchSchema>;

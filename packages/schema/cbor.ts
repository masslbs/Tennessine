import * as v from "@valibot/valibot";

// For OpString enum
const OpStringSchema = v.union([
  v.literal("add"),
  v.literal("replace"),
  v.literal("remove"),
  v.literal("increment"),
  v.literal("decrement"),
]);

// For PatchSetHeader
export const PatchSetHeaderSchema = v.object({
  KeyCardNonce: v.number(), // uint64 with gt=0
  ShopID: v.union([v.bigint(), v.number()]),
  Timestamp: v.date(),
  RootHash: v.instance(Uint8Array<ArrayBufferLike>),
});

export type TPatchSetHeader = v.InferInput<typeof PatchSetHeaderSchema>;

// For Patch
export const PatchSchema = v.object({
  Op: OpStringSchema,
  Path: v.array(v.string()), // assuming PatchPath is string array
  Value: v.any(),
});

export type TPatch = v.InferInput<typeof PatchSchema>;

export const PatchSetSchema = v.object({
  Header: PatchSetHeaderSchema,
  Patches: v.array(PatchSchema),
});

export type TPatchSet = v.InferInput<typeof PatchSetSchema>;

// For SignedPatchSet
export const SignedPatchSetSchema = v.object({
  ...PatchSetSchema.entries,
  Signature: v.instance(Uint8Array<ArrayBufferLike>), // assuming objects.Signature is represented as Uint8Array
});

// Type inference
export type TSignedPatchSet = v.InferInput<typeof SignedPatchSetSchema>;

export const RecoveredPatchSetSchema = v.object({
  ...SignedPatchSetSchema.entries,
  Signer: v.string(),
});

// Type inference
export type TRecoveredPatchSet = v.InferInput<typeof RecoveredPatchSetSchema>;

export const BaseObjectSchema = v.object({
  Accounts: v.record(
    v.string(),
    v.object({
      KeyCards: v.array(v.string()),
      Guest: v.boolean(),
    }),
  ),
});

const CurrencyMapSchema = v.record(
  v.string(), // chainid
  v.record(
    v.string(), // currency
    v.nullable(v.object({
      isContract: v.boolean(),
      description: v.string(),
    })),
  ),
);

export const ShopSchema = v.object({
  ...BaseObjectSchema.entries,
  Manifest: v.object({
    ShopID: v.bigint(),
    Payees: CurrencyMapSchema,
    AcceptedCurrencies: CurrencyMapSchema,
    PricingCurrency: v.object({
      ChainID: v.number(),
      Address: v.string(),
    }),
    ShippingRegions: v.record(
      v.string(),
      v.object({
        Country: v.string(),
        Postcode: v.string(),
        City: v.string(),
        PriceModifiers: v.nullable(v.number()),
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

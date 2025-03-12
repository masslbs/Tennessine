import * as v from "@valibot/valibot";

const Bytes = v.instance(Uint8Array<ArrayBufferLike>);

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
  KeyCardNonce: v.union([v.bigint(), v.number()]),
  ShopID: v.union([v.bigint(), v.number()]),
  Timestamp: v.date(),
  RootHash: Bytes,
});

export type TPatchSetHeader = v.InferInput<typeof PatchSetHeaderSchema>;

// For Patch
export const PatchSchema = v.object({
  Op: OpStringSchema,
  Path: v.array(v.any()), // assuming PatchPath is string array
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
  Signature: Bytes,
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

const CurrencyMapSchema = v.map(
  v.number(), // chainid
  v.map(
    Bytes, // currency
    v.nullable(v.object({
      isContract: v.boolean(),
    })),
  ),
);
const PricingCurrencySchema = v.object({
  ChainID: v.number(),
  Address: v.string(),
});

const ManifestSchema = v.object({
  ShopID: v.bigint(),
  Payees: CurrencyMapSchema,
  AcceptedCurrencies: CurrencyMapSchema,
  PricingCurrency: PricingCurrencySchema,
  ShippingRegions: v.record(
    v.string(),
    v.object({
      Country: v.string(),
      Postcode: v.string(),
      City: v.string(),
      PriceModifiers: v.nullable(v.number()),
    }),
  ),
});

const ListingSchema = v.record(
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
    StockStatus: v.optional(v.string()),
  }),
);

const TagSchema = v.record(
  v.string(),
  v.object({
    Name: v.string(),
    ListingIds: v.array(v.number()),
  }),
);

const AddressDetailsSchema = v.object({
  Name: v.string(),
  Address1: v.string(),
  Address2: v.string(),
  City: v.string(),
  PostalCode: v.string(),
  Country: v.string(),
  PhoneNumber: v.string(),
  EmailAddress: v.optional(v.string()),
});

const OrderSchema = v.record(
  v.string(),
  v.object({
    ID: v.number(),
    Items: v.array(v.object({
      ListingId: v.number(),
      Quantity: v.number(),
      VariationsIDs: v.array(v.number()),
    })),
    State: v.number(),
    InvoiceAddress: v.optional(AddressDetailsSchema),
    ShippingAddress: v.optional(AddressDetailsSchema),
    CanceledAt: v.optional(v.date()),
    ChosenPayee: v.optional(v.string()),
    ChosenCurrency: v.optional(v.string()),
    TxDetails: v.optional(v.string()),
  }),
);

export const ManifestSchema=  v.object({
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
})


export const ShopSchema = v.object({
  ...BaseObjectSchema.entries,
  Manifest: ManifestSchema,
  Listings: ListingSchema,
  Tags: TagSchema,
  Orders: OrderSchema,
});

export type TManifest = v.InferInput<typeof ManifestSchema>;
export type TListing = v.InferInput<typeof ListingSchema>;
export type TTag = v.InferInput<typeof TagSchema>;
export type TOrder = v.InferInput<typeof OrderSchema>;
export type TCurrencyMap = v.InferInput<typeof CurrencyMapSchema>;
export type TPricingCurrency = v.InferInput<typeof PricingCurrencySchema>;
export type TAddressDetails = v.InferInput<typeof AddressDetailsSchema>;

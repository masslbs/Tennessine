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
const ChainAddressSchema = v.object({
  ChainID: v.number(),
  Address: v.string(),
});

const ModificationAbsoluteSchema = v.object({
  Amount: v.bigint(),
  Plus: v.boolean(),
});

const PriceModifierSchema = v.object({
  ModificationPrecents: v.optional(v.bigint()),
  ModificationAbsolute: v.optional(ModificationAbsoluteSchema),
});

const ShippingRegionSchema = v.object({
  Country: v.string(),
  PostalCode: v.string(),
  City: v.string(),
  PriceModifiers: v.optional(PriceModifierSchema),
});

const PayeeMetadata = v.object({
  CallAsContract: v.boolean(),
});

const PayeeSchema = v.map(v.number(), v.map(v.string(), PayeeMetadata));

const ManifestSchema = v.object({
  ShopID: v.bigint(),
  Payees: PayeeSchema,
  AcceptedCurrencies: CurrencyMapSchema,
  PricingCurrency: ChainAddressSchema,
  ShippingRegions: v.optional(v.map(
    v.string(),
    ShippingRegionSchema,
  )),
});

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

const ListingMetadataSchema = v.object({
  Title: v.string(),
  Description: v.string(),
  Images: v.array(v.string()),
});

const ListingStockStatusSchema = v.object({
  VariationIDs: v.array(v.string()),
  InStock: v.optional(v.boolean()),
  ExpectedInStockBy: v.optional(v.date()),
});

const ListingVariationSchema = v.object({
  VariationInfo: ListingMetadataSchema,
  PriceModifier: v.optional(PriceModifierSchema),
  SKU: v.optional(v.string()),
});

const ListingOptionSchema = v.object({
  Title: v.string(),
  Variations: v.optional(v.map(v.string(), ListingVariationSchema)),
});

const ListingSchema = v.object({
  ID: v.number(),
  Name: v.string(),
  Metadata: ListingMetadataSchema,
  Price: v.number(),
  ViewState: v.number(),
  Options: v.optional(v.map(v.string(), ListingOptionSchema)),
  StockStatuses: v.optional(v.array(ListingStockStatusSchema)),
});

const TagSchema = v.object({
  Name: v.string(),
  ListingIds: v.array(v.number()),
});

const OrderedItemSchema = v.object({
  ListingID: v.number(),
  Quantity: v.number(),
  VariationIDs: v.array(v.string()),
});

const PaymentDetailsSchema = v.object({
  PaymentID: v.string(),
  Total: v.bigint(),
  ListingHashes: v.array(v.string()),
  TTL: v.number(),
  ShopSignature: v.string(),
});

const OrderPaidSchema = v.object({
  TxHash: v.optional(v.string()),
  BlockHash: v.string(),
});

const OrderSchema = v.object({
  ID: v.number(),
  Items: v.array(OrderedItemSchema),
  State: v.number(),
  InvoiceAddress: v.optional(AddressDetailsSchema),
  ShippingAddress: v.optional(AddressDetailsSchema),
  CanceledAt: v.optional(v.date()),
  ChosenPayee: v.optional(ChainAddressSchema),
  ChosenCurrency: v.optional(ChainAddressSchema),
  TxDetails: v.optional(OrderPaidSchema),
  PaymentDetails: v.optional(PaymentDetailsSchema),
});

export const ShopSchema = v.object({
  ...BaseObjectSchema.entries,
  Manifest: ManifestSchema,
  Listings: v.record(v.string(), ListingSchema),
  Tags: v.record(v.string(), TagSchema),
  Orders: v.record(v.string(), OrderSchema),
});

export type TManifest = v.InferInput<typeof ManifestSchema>;
export type TListing = v.InferInput<typeof ListingSchema>;
export type TTag = v.InferInput<typeof TagSchema>;
export type TOrder = v.InferInput<typeof OrderSchema>;
export type TCurrencyMap = v.InferInput<typeof CurrencyMapSchema>;
export type TChainAddress = v.InferInput<typeof ChainAddressSchema>;
export type TAddressDetails = v.InferInput<typeof AddressDetailsSchema>;
export type IShopSchema = v.InferInput<typeof ShopSchema>;
export type TListingMetadata = v.InferInput<typeof ListingMetadataSchema>;
export type TOrderedItem = v.InferInput<typeof OrderedItemSchema>;
export type TShippingRegion = v.InferInput<typeof ShippingRegionSchema>;
export type TListingStockStatus = v.InferInput<typeof ListingStockStatusSchema>;
export type TListingOption = v.InferInput<typeof ListingOptionSchema>;
export type TListingVariation = v.InferInput<typeof ListingVariationSchema>;
export type TPriceModifier = v.InferInput<typeof PriceModifierSchema>;
export type TModificationAbsolute = v.InferInput<
  typeof ModificationAbsoluteSchema
>;
export type TPayee = v.InferInput<typeof PayeeSchema>;
export type TPaymentDetails = v.InferInput<typeof PaymentDetailsSchema>;
export type TOrderPaid = v.InferInput<typeof OrderPaidSchema>;

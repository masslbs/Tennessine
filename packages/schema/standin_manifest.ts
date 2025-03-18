import { BaseClass } from "./utils.ts";
import type {
  TChainAddress,
  TCurrencyMap,
  TManifest,
  TModificationAbsolute,
  TPayee,
  TPriceModifier,
  TShippingRegion,
} from "./cbor.ts";
export class Manifest extends BaseClass {
  ShopID: bigint;
  Payees: PayeeMap;
  AcceptedCurrencies: AcceptedCurrencyMap;
  PricingCurrency: ChainAddress;
  ShippingRegions: ShippingRegionsMap | undefined;

  constructor(input: { get<K extends keyof TManifest>(key: K): TManifest[K] }) {
    super();
    this.ShopID = input.get("ShopID");
    this.Payees = new PayeeMap(input.get("Payees"));
    this.AcceptedCurrencies = new AcceptedCurrencyMap(
      input.get("AcceptedCurrencies"),
    );
    const pricingCurrency = input.get("PricingCurrency");
    // console.log("pricingCurrency", pricingCurrency);
    this.PricingCurrency = new ChainAddress({
      get: <K extends keyof TChainAddress>(key: K) => pricingCurrency.get(key),
    });
    this.ShippingRegions = input.get("ShippingRegions")
      ? new ShippingRegionsMap(input.get("ShippingRegions")!)
      : undefined;
  }
}

export class ShippingRegionsMap {
  data: Map<string, ShippingRegion> = new Map();
  constructor(shippingRegions: Map<string, TShippingRegion>) {
    const map = new Map();
    for (const [key, value] of shippingRegions) {
      map.set(
        key,
        new ShippingRegion({
          get: <K extends keyof TShippingRegion>(_key: K) => value.get(_key),
        }),
      );
    }
    this.data = map;
  }

  returnAsMap(): Map<string, any> {
    const map = new Map();
    for (const [key, value] of this.data) {
      map.set(key, value.returnAsMap());
    }
    return map;
  }
}

export class PayeeMap {
  data: Map<number, Map<Uint8Array, PayeeMetadata>> = new Map();

  constructor(payees: TPayee) {
    if (payees === undefined) {
      this.data = new Map();
      return;
    }

    for (const [chainId, addressMap] of payees.entries()) {
      if (!(addressMap instanceof Map)) {
        throw new Error(
          `Expected Map for chain ID ${chainId}, got ${typeof addressMap}`,
        );
      }

      const validatedAddressMap = new Map();
      // Iterate through addresses and metadata
      for (const [address, metadata] of addressMap) {
        if (
          !(address instanceof Uint8Array)
        ) {
          throw new Error(`Invalid Ethereum address for chain ID ${chainId}`);
        }

        if (!(metadata instanceof Map)) {
          throw new Error(
            `Invalid metadata for address in chain ID ${chainId}`,
          );
        }

        const payeeMetadata = new PayeeMetadata(metadata);

        validatedAddressMap.set(address, payeeMetadata);
      }

      this.data.set(chainId, validatedAddressMap);
    }
  }

  get(chainId: number, address: Uint8Array): PayeeMetadata | undefined {
    return this.data.get(chainId)?.get(address);
  }

  returnAsMap(): Map<number, Map<Uint8Array, Map<"CallAsContract", boolean>>> {
    const map = new Map();
    for (const [chainId, addressMap] of this.data) {
      const forChainID = new Map();
      for (const [address, metadata] of addressMap) {
        forChainID.set(address, metadata.returnAsMap());
      }
      map.set(chainId, forChainID);
    }
    return map;
  }
}

export class PayeeMetadata extends BaseClass {
  CallAsContract: boolean = false;

  constructor(input: Map<"CallAsContract", boolean>) {
    super();
    this.CallAsContract = input.get("CallAsContract") || false;
  }
}

export class AcceptedCurrencyMap {
  data: Map<number, Map<Uint8Array, Map<"isContract", boolean>>> = new Map();

  constructor(input: TCurrencyMap) {
    if (input instanceof Map) {
      // Iterate through chain IDs
      for (const [chainId, addressSet] of input) {
        if (typeof chainId !== "number") {
          throw new Error(
            `Expected number for chain ID ${chainId}, got ${typeof chainId}`,
          );
        }
        if (!(addressSet instanceof Map)) {
          throw new Error(
            `Expected Set for chain ID ${chainId}, got ${typeof addressSet}`,
          );
        }

        const validatedAddressMap = new Map();
        // Iterate through addresses
        for (const [address, val] of addressSet.entries()) {
          validatedAddressMap.set(address, val);
        }

        this.data.set(chainId, validatedAddressMap);
      }
    } else {
      throw new Error("AcceptedCurrencies must be a Map");
    }
  }
  returnAsMap(): Map<number, Map<Uint8Array, Map<"isContract", boolean>>> {
    const map = new Map();
    for (const [chainId, addressMap] of this.data) {
      const addressMapMap = new Map();
      for (const [address, metadata] of addressMap) {
        addressMapMap.set(address, metadata);
      }
      map.set(chainId, addressMapMap);
    }
    return map;
  }
}

export class ChainAddress extends BaseClass {
  ChainID: number;
  Address: Uint8Array;
  constructor(
    input: {
      get<K extends keyof TChainAddress>(key: K): TChainAddress[K];
    },
    // input: Map<string, any>,
  ) {
    super();
    console.log("input", input.get("ChainID"));

    this.ChainID = input.get("ChainID");
    this.Address = input.get("Address");
  }
}

export class ShippingRegion extends BaseClass {
  Country: string;
  PostalCode: string;
  City: string;
  constructor(
    input: { get<K extends keyof TShippingRegion>(key: K): TShippingRegion[K] },
  ) {
    super();
    this.Country = input.get("Country");
    this.PostalCode = input.get("PostalCode");
    this.City = input.get("City");
  }
}

export class PriceModifier {
  ModificationPrecents?: bigint;
  ModificationAbsolute?: ModificationAbsolute | undefined;

  constructor(
    input: {
      get<K extends keyof TPriceModifier>(key: K): TPriceModifier[K];
      has<K extends keyof TPriceModifier>(key: K): boolean;
    },
  ) {
    // Make it a sum type - only one of these should be set
    if (input.has("ModificationPrecents")) {
      this.ModificationPrecents = input.get("ModificationPrecents");
    } else if (input.has("ModificationAbsolute")) {
      const modificationAbsolute = input.get("ModificationAbsolute")!;
      this.ModificationAbsolute = new ModificationAbsolute(
        {
          get: <K extends keyof TModificationAbsolute>(key: K) =>
            modificationAbsolute[key],
        },
      );
    } else {
      throw new Error(
        "PriceModifier must have either ModificationPrecents or ModificationAbsolute",
      );
    }
  }
}

export class ModificationAbsolute {
  Amount: bigint;
  Plus: boolean;

  constructor(
    input: {
      get<K extends keyof TModificationAbsolute>(
        key: K,
      ): TModificationAbsolute[K];
    },
  ) {
    this.Amount = input.get("Amount");
    this.Plus = input.get("Plus");
  }
}

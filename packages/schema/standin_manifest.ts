import { BaseClass } from "./utils.ts";
import type {
  TCurrencyMap,
  TManifest,
  TModificationAbsolute,
  TPayee,
  TPriceModifier,
  TChainAddress,
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
    this.PricingCurrency = new ChainAddress({
      get: <K extends keyof TChainAddress>(key: K) => pricingCurrency[key],
    });
    this.ShippingRegions = input.get("ShippingRegions")
      ? new ShippingRegionsMap(input.get("ShippingRegions")!)
      : undefined;
  }
}

export class ShippingRegionsMap extends BaseClass {
  data: Map<string, ShippingRegion> = new Map();
  constructor(shippingRegions: Map<string, TShippingRegion>) {
    super();
    const map = new Map();
    for (const [key, value] of shippingRegions) {
      map.set(
        key,
        new ShippingRegion({
          get: <K extends keyof TShippingRegion>(_key: K) => value[_key],
        }),
      );
    }
    this.data = map;
  }
}

export class PayeeMap {
  data: Map<number, Map<EthereumAddress, PayeeMetadata>> = new Map();

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
          !(address as string || Uint8Array instanceof Uint8Array) ||
          address.length !== 20
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

  get(chainId: number, address: EthereumAddress): PayeeMetadata | undefined {
    return this.data.get(chainId)?.get(address);
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
}

export class PayeeMetadata {
  CallAsContract: boolean = false;

  constructor(input: Map<"CallAsContract", boolean>) {
    this.CallAsContract = input.get("CallAsContract") || false;
  }
}

export class ChainAddress extends BaseClass {
  ChainID: number;
  Address: EthereumAddress | string;
  constructor(
    input: {
      get<K extends keyof TChainAddress>(key: K): TChainAddress[K];
    },
  ) {
    super();

    this.ChainID = input.get("ChainID");
    this.Address = input.get("Address");
  }
}

export class EthereumAddress extends BaseClass {
  Address: Uint8Array | string;

  constructor(input: Uint8Array) {
    super();
    if (input.length !== 20) {
      throw new Error("Invalid Ethereum address");
    }
    this.Address = input;
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

import { BaseClass } from "./utils.ts";

export class Manifest extends BaseClass {
  ShopID: bigint;
  Payees: PayeeMap;
  AcceptedCurrencies: AcceptedCurrencyMap;
  PricingCurrency: ChainAddress;
  ShippingRegions: ShippingRegionsMap | undefined;

  constructor(input: Map<string, unknown>) {
    super();
    this.ShopID = input.get("ShopID") as bigint;
    this.Payees = new PayeeMap(
      input.get("Payees") as ConstructorParameters<typeof PayeeMap>[0],
    );
    this.AcceptedCurrencies = new AcceptedCurrencyMap(
      input.get("AcceptedCurrencies") as ConstructorParameters<
        typeof AcceptedCurrencyMap
      >[0],
    );
    const pricingCurrency = input.get("PricingCurrency");
    this.PricingCurrency = new ChainAddress(
      pricingCurrency as Map<string, unknown>,
    );
    this.ShippingRegions = input.get("ShippingRegions")
      ? new ShippingRegionsMap(
        input.get("ShippingRegions") as Map<string, unknown>,
      )
      : undefined;
  }
}

export class ShippingRegionsMap {
  data: Map<string, ShippingRegion> = new Map();
  constructor(shippingRegions: Map<string, unknown>) {
    const map = new Map();
    for (const [key, value] of shippingRegions) {
      map.set(
        key,
        new ShippingRegion(value as Map<string, unknown>),
      );
    }
    this.data = map;
  }

  returnAsMap(): Map<string, unknown> {
    const map = new Map();
    for (const [key, value] of this.data) {
      map.set(key, value.returnAsMap());
    }
    return map;
  }
}

export class PayeeMap {
  data: Map<number, Map<Uint8Array, PayeeMetadata>> = new Map();

  constructor(payees: Map<number, Map<Uint8Array, unknown>>) {
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
          !(address instanceof Uint8Array && address.length === 20)
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

  constructor(input: Map<number, unknown>) {
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
  constructor(input: Map<string, unknown>) {
    super();
    this.ChainID = input.get("ChainID") as number;
    this.Address = input.get("Address") as Uint8Array;
  }
}

export class ShippingRegion extends BaseClass {
  Country: string;
  PostalCode: string;
  City: string;
  constructor(input: Map<string, unknown>) {
    super();
    this.Country = input.get("Country") as string;
    this.PostalCode = input.get("PostalCode") as string;
    this.City = input.get("City") as string;
  }
}

export class PriceModifier {
  ModificationPrecents?: bigint;
  ModificationAbsolute?: ModificationAbsolute | undefined;

  constructor(input: Map<string, unknown>) {
    // Make it a sum type - only one of these should be set
    if (input.has("ModificationPrecents")) {
      this.ModificationPrecents = input.get("ModificationPrecents") as bigint;
    } else if (input.has("ModificationAbsolute")) {
      const modificationAbsolute = input.get("ModificationAbsolute")!;
      this.ModificationAbsolute = new ModificationAbsolute(
        modificationAbsolute as Map<string, unknown>,
      );
    } else {
      throw new Error(
        "PriceModifier must have either ModificationPrecents or ModificationAbsolute",
      );
    }
  }

  returnAsMap(): Map<string, unknown> {
    const map = new Map();
    if (this.ModificationAbsolute && this.ModificationPrecents) {
      throw new Error(
        "PriceModifier must have either ModificationPrecents or ModificationAbsolute",
      );
    }
    if (this.ModificationPrecents) {
      map.set("ModificationPrecents", this.ModificationPrecents);
    }
    if (this.ModificationAbsolute) {
      map.set("ModificationAbsolute", this.ModificationAbsolute.returnAsMap());
    }
    return map;
  }
}

export class ModificationAbsolute extends BaseClass {
  Amount: bigint;
  Plus: boolean;

  constructor(input: Map<string, unknown>) {
    super();
    this.Amount = input.get("Amount") as bigint;
    this.Plus = input.get("Plus") as boolean;
  }
}

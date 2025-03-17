import { BaseClass } from "./utils.ts";

export class Manifest extends BaseClass {
  ShopID: bigint;
  Payees: PayeeMap;
  AcceptedCurrencies: AcceptedCurrencyMap;
  PricingCurrency: ChainAddress;
  ShippingRegions: ShippingRegionsMap

  constructor(input: Map<string, any>) {
    super();
    this.ShopID = input.get("ShopID");
    this.Payees = new PayeeMap(input.get("Payees"));
    this.AcceptedCurrencies = new AcceptedCurrencyMap(
      input.get("AcceptedCurrencies"),
    );
    this.PricingCurrency = new ChainAddress(input.get("PricingCurrency"));
    this.ShippingRegions = new ShippingRegionsMap(input.get("ShippingRegions"));
  }
}

export class ShippingRegionsMap extends BaseClass {
  data: Map<string, ShippingRegion> = new Map();
  constructor(shippingRegions: Map<string, any>) {
    super();
    const map = new Map();
    for (const [key, value] of shippingRegions) {
     map.set(key, new ShippingRegion(value));
    }
    this.data = map;
  }
}

export class PayeeMap {
  data: Map<number, Map<EthereumAddress, PayeeMetadata>> = new Map();

  constructor(payees: Map<string, any>) {
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
        if (!(address instanceof Uint8Array) || address.length !== 20) {
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

  constructor(input: Map<string, any>) {
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

  constructor(input: Map<string, any>) {
    this.CallAsContract = input.get("CallAsContract") || false;
  }
}

export class ChainAddress extends BaseClass {
  ChainID: number;
  Address: EthereumAddress;
  constructor(input: Map<string, any>) {
    super();

    this.ChainID = input.get("ChainID");
    this.Address = input.get("Address");
  }
}

export class EthereumAddress extends BaseClass {
  Address: Uint8Array;

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
  constructor(input: Map<string, any>) {
      super()
    this.Country = input.get("Country");
    this.PostalCode = input.get("PostalCode");
    this.City = input.get("City");

  }
}

export class PriceModifier {
  ModificationPrecents?: bigint;
  ModificationAbsolute?: ModificationAbsolute;

  constructor(input: Map<string, any>) {
    // Make it a sum type - only one of these should be set
    if (input.has("ModificationPrecents")) {
      this.ModificationPrecents = input.get("ModificationPrecents");
    } else if (input.has("ModificationAbsolute")) {
      this.ModificationAbsolute = new ModificationAbsolute(
        input.get("ModificationAbsolute"),
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

  constructor(input: Map<string, any>) {
    this.Amount = input.get("Amount");
    this.Plus = input.get("Plus");
  }
}

export class Manifest {
  ShopID: bigint;
  Payees: PayeeMap;
  AcceptedCurrencies: AcceptedCurrencyMap;
  PricingCurrency: ChainAddress;
  ShippingRegions: Map<string, ShippingRegion> = new Map();

  constructor(public input: Map<string, any>) {
    // console.log("Manifest input:", input);
    this.ShopID = input.get("ShopID");
    this.Payees = new PayeeMap(input.get("Payees"));
    this.AcceptedCurrencies = new AcceptedCurrencyMap(
      input.get("AcceptedCurrencies"),
    );
    this.PricingCurrency = new ChainAddress(input.get("PricingCurrency"));
    for (const [key, value] of input.get("ShippingRegions")) {
      this.ShippingRegions.set(key, new ShippingRegion(value));
    }
  }
}

export class PayeeMap {
  data: Map<number, Map<EthereumAddress, PayeeMetadata>> = new Map();

  constructor(public input: Map<string, any>) {
    const payees = input.get("Payees");
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
  data: Map<number, Set<EthereumAddress>> = new Map();

  constructor(public input: Map<string, any>) {
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

        const validatedAddressSet = new Set<EthereumAddress>();
        // Iterate through addresses
        for (const [address, _] of addressSet.entries()) {
          validatedAddressSet.add(new EthereumAddress(address));
        }

        this.data.set(chainId, validatedAddressSet);
      }
    } else {
      throw new Error("AcceptedCurrencies must be a Map");
    }
  }
}

export class PayeeMetadata {
  CallAsContract: boolean = false;

  constructor(public input: Map<string, any>) {
    this.CallAsContract = input.get("CallAsContract") || false;
  }
}

export class ChainAddress {
  ChainID: number;
  Address: EthereumAddress;

  constructor(public input: Map<string, any>) {
    this.ChainID = input.get("ChainID");
    this.Address = new EthereumAddress(input.get("Address"));
  }
}

export class EthereumAddress {
  Address: Uint8Array;

  constructor(public input: Uint8Array) {
    if (input.length !== 20) {
      throw new Error("Invalid Ethereum address");
    }
    this.Address = input;
  }
}

export class ShippingRegion {
  Country: string;
  PostalCode: string;
  City: string;
  PriceModifiers: Map<string, PriceModifier> = new Map();

  constructor(public input: Map<string, any>) {
    // console.log("ShippingRegion input:", input);
    this.Country = input.get("Country");
    this.PostalCode = input.get("PostalCode");
    this.City = input.get("City");
    this.PriceModifiers = new Map<string, PriceModifier>();
    for (const [key, value] of input.get("PriceModifiers") ?? []) {
      const pm = new PriceModifier(value);
      // console.log("PriceModifier:", pm);
      this.PriceModifiers.set(key, pm);
    }
    // console.log("ShippingRegion:", this);
  }
}

export class PriceModifier {
  ModificationPrecents?: bigint;
  ModificationAbsolute?: ModificationAbsolute;

  constructor(public input: Map<string, any>) {
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

  constructor(public input: Map<string, any>) {
    this.Amount = input.get("Amount");
    this.Plus = input.get("Plus");
  }
}

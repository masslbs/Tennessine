import {
  BaseClass,
  ensureBigInt,
  ensureBoolean,
  ensureNumber,
  ensureString,
  ensureUint8Array,
} from "./utils.ts";

export class Manifest extends BaseClass {
  ShopID: bigint;
  Payees: PayeeMap;
  AcceptedCurrencies: AcceptedCurrencyMap;
  PricingCurrency: ChainAddress;
  ShippingRegions: ShippingRegionsMap | undefined;

  constructor(input: Map<string, unknown>) {
    super();
    this.ShopID = ensureBigInt(input.get("ShopID"), "ShopID");

    const payees = input.get("Payees");
    if (!(payees instanceof Map)) {
      throw new TypeError("Expected Payees to be a Map");
    }
    this.Payees = new PayeeMap(payees);

    const acceptedCurrencies = input.get("AcceptedCurrencies");
    if (!(acceptedCurrencies instanceof Map)) {
      throw new TypeError("Expected AcceptedCurrencies to be a Map");
    }
    this.AcceptedCurrencies = new AcceptedCurrencyMap(acceptedCurrencies);

    const pricingCurrency = input.get("PricingCurrency");
    if (!(pricingCurrency instanceof Map)) {
      throw new TypeError("Expected PricingCurrency to be a Map");
    }
    this.PricingCurrency = new ChainAddress(pricingCurrency);

    const shippingRegions = input.get("ShippingRegions");
    if (shippingRegions !== undefined) {
      if (!(shippingRegions instanceof Map)) {
        throw new TypeError("Expected ShippingRegions to be a Map");
      }
      this.ShippingRegions = new ShippingRegionsMap(shippingRegions);
    } else {
      this.ShippingRegions = undefined;
    }
  }
}

export class ShippingRegionsMap {
  data: Map<string, ShippingRegion> = new Map();

  constructor(shippingRegions: Map<string, unknown>) {
    const map = new Map<string, ShippingRegion>();
    for (const [key, value] of shippingRegions) {
      if (!(value instanceof Map)) {
        throw new TypeError(
          `Expected shipping region value for ${key} to be a Map`,
        );
      }
      map.set(key, new ShippingRegion(value));
    }
    this.data = map;
  }

  asCBORMap(): Map<string, unknown> {
    const map = new Map();
    for (const [key, value] of this.data) {
      map.set(key, value.asCBORMap());
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
        throw new TypeError(
          `Expected Map for chain ID ${chainId}, got ${typeof addressMap}`,
        );
      }

      const validatedAddressMap = new Map<Uint8Array, PayeeMetadata>();
      // Iterate through addresses and metadata
      for (const [address, metadata] of addressMap) {
        if (!(address instanceof Uint8Array)) {
          throw new TypeError(
            `Expected Uint8Array for address in chain ID ${chainId}, got ${typeof address}`,
          );
        }

        if (address.length !== 20) {
          throw new Error(
            `Invalid Ethereum address for chain ID ${chainId}: address must be 20 bytes`,
          );
        }

        if (!(metadata instanceof Map)) {
          throw new TypeError(
            `Invalid metadata for address in chain ID ${chainId}, got ${typeof metadata}`,
          );
        }

        const payeeMetadata = new PayeeMetadata(
          metadata as Map<"CallAsContract", boolean>,
        );
        validatedAddressMap.set(address, payeeMetadata);
      }

      this.data.set(chainId, validatedAddressMap);
    }
  }

  get(chainId: number, address: Uint8Array): PayeeMetadata | undefined {
    return this.data.get(chainId)?.get(address);
  }

  asCBORMap(): Map<number, Map<Uint8Array, Map<"CallAsContract", boolean>>> {
    const map = new Map();
    for (const [chainId, addressMap] of this.data) {
      const forChainID = new Map();
      for (const [address, metadata] of addressMap) {
        forChainID.set(address, metadata.asCBORMap());
      }
      map.set(chainId, forChainID);
    }
    return map;
  }
}

export class PayeeMetadata extends BaseClass {
  CallAsContract: boolean = false;

  constructor(input: Map<string, unknown>) {
    super();
    const callAsContract = input.get("CallAsContract");
    this.CallAsContract = callAsContract !== undefined
      ? ensureBoolean(callAsContract, "CallAsContract")
      : false;
  }
}

export class Payee extends BaseClass {
  Address: ChainAddress;
  CallAsContract: boolean;

  constructor(input: Map<string, unknown>) {
    super();
    this.Address = new ChainAddress(
      input.get("Address") as Map<string, unknown>,
    );
    this.CallAsContract = ensureBoolean(
      input.get("CallAsContract"),
      "CallAsContract",
    );
  }
}

export class AcceptedCurrencyMap {
  data: Map<number, Map<Uint8Array, Map<string, boolean>>> = new Map();

  constructor(input: Map<number, unknown>) {
    // Iterate through chain IDs
    for (const [chainId, addressSet] of input) {
      if (typeof chainId !== "number") {
        throw new TypeError(
          `Expected number for chain ID, got ${typeof chainId}`,
        );
      }

      if (!(addressSet instanceof Map)) {
        throw new TypeError(
          `Expected Map for chain ID ${chainId}, got ${typeof addressSet}`,
        );
      }

      const validatedAddressMap = new Map<Uint8Array, Map<string, boolean>>();
      // Iterate through addresses
      for (const [address, val] of addressSet.entries()) {
        if (!(address instanceof Uint8Array)) {
          throw new TypeError(
            `Expected Uint8Array for address in chain ID ${chainId}, got ${typeof address}`,
          );
        }

        if (!(val instanceof Map)) {
          throw new TypeError(
            `Expected Map for address metadata in chain ID ${chainId}, got ${typeof val}`,
          );
        }

        validatedAddressMap.set(address, val as Map<string, boolean>);
      }

      this.data.set(chainId, validatedAddressMap);
    }
  }

  asCBORMap(): Map<number, Map<Uint8Array, Map<"IsContract", boolean>>> {
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
    this.ChainID = ensureNumber(input.get("ChainID"), "ChainID");
    this.Address = ensureUint8Array(input.get("Address"), "Address");
  }
}

export class ShippingRegion extends BaseClass {
  Country: string;
  PostalCode: string;
  City: string;

  constructor(input: Map<string, unknown>) {
    super();
    this.Country = ensureString(input.get("Country"), "Country");
    this.PostalCode = ensureString(input.get("PostalCode"), "PostalCode");
    this.City = ensureString(input.get("City"), "City");
  }
}

export class PriceModifier {
  ModificationPrecents?: bigint;
  ModificationAbsolute?: ModificationAbsolute;

  constructor(input: Map<string, unknown>) {
    // Make it a sum type - only one of these should be set
    if (input.has("ModificationPrecents")) {
      this.ModificationPrecents = ensureBigInt(
        input.get("ModificationPrecents"),
        "ModificationPrecents",
      );
    } else if (input.has("ModificationAbsolute")) {
      const modificationAbsolute = input.get("ModificationAbsolute");
      if (!(modificationAbsolute instanceof Map)) {
        throw new TypeError("Expected ModificationAbsolute to be a Map");
      }
      this.ModificationAbsolute = new ModificationAbsolute(
        modificationAbsolute,
      );
    } else {
      throw new Error(
        "PriceModifier must have either ModificationPrecents or ModificationAbsolute",
      );
    }
  }

  asCBORMap(): Map<string, unknown> {
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
      map.set("ModificationAbsolute", this.ModificationAbsolute.asCBORMap());
    }
    return map;
  }
}

export class ModificationAbsolute extends BaseClass {
  Amount: bigint;
  Plus: boolean;

  constructor(input: Map<string, unknown>) {
    super();
    this.Amount = ensureBigInt(input.get("Amount"), "Amount");
    this.Plus = ensureBoolean(input.get("Plus"), "Plus");
  }
}

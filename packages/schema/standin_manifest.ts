import { equal } from "@std/assert";

import { CodecKey, CodecValue } from "@massmarket/utils/codec";
import {
  BaseClass,
  ensureBigInt,
  ensureBoolean,
  ensureNumber,
  ensureString,
  ensureUint8Array,
} from "./utils.ts";

type ContractStatus = Map<"IsContract", boolean>;

export class Manifest extends BaseClass {
  ShopID: bigint;
  Payees: PayeeMap;
  AcceptedCurrencies: AcceptedCurrencyMap;
  PricingCurrency: ChainAddress;
  ShippingRegions: ShippingRegionsMap | undefined;

  constructor(
    shopID: bigint = 0n,
    payees?: PayeeMap,
    acceptedCurrencies?: AcceptedCurrencyMap,
    pricingCurrency?: ChainAddress,
    shippingRegions?: ShippingRegionsMap,
  ) {
    super();
    this.ShopID = shopID;
    this.Payees = payees || new PayeeMap();
    this.AcceptedCurrencies = acceptedCurrencies || new AcceptedCurrencyMap();
    this.PricingCurrency = pricingCurrency ||
      new ChainAddress(0, new Uint8Array(20));
    this.ShippingRegions = shippingRegions;
  }

  static fromCBOR(input: Map<CodecKey, CodecValue>): Manifest {
    const shopID = ensureBigInt(input.get("ShopID"), "ShopID");

    const payees = input.get("Payees");
    if (!(payees instanceof Map)) {
      throw new TypeError("Expected Payees to be a Map");
    }
    const payeeMap = PayeeMap.fromCBOR(payees);

    const acceptedCurrencies = input.get("AcceptedCurrencies");
    if (!(acceptedCurrencies instanceof Map)) {
      throw new TypeError("Expected AcceptedCurrencies to be a Map");
    }
    const acceptedCurrencyMap = AcceptedCurrencyMap.fromCBOR(
      acceptedCurrencies,
    );

    const pricingCurrency = input.get("PricingCurrency");
    if (!(pricingCurrency instanceof Map)) {
      throw new TypeError("Expected PricingCurrency to be a Map");
    }
    const pricingCurrencyObj = ChainAddress.fromCBOR(pricingCurrency);

    let shippingRegions: ShippingRegionsMap | undefined = undefined;
    const shippingRegionsData = input.get("ShippingRegions");
    if (shippingRegionsData !== undefined) {
      if (!(shippingRegionsData instanceof Map)) {
        throw new TypeError("Expected ShippingRegions to be a Map");
      }
      shippingRegions = ShippingRegionsMap.fromCBOR(shippingRegionsData);
    }

    return new Manifest(
      shopID,
      payeeMap,
      acceptedCurrencyMap,
      pricingCurrencyObj,
      shippingRegions,
    );
  }
}

export class ShippingRegionsMap {
  data: Map<string, ShippingRegion> = new Map();

  constructor(regions?: Map<CodecKey, ShippingRegion>) {
    this.data = regions || new Map();
  }

  static fromCBOR(
    shippingRegions: Map<CodecKey, CodecValue>,
  ): ShippingRegionsMap {
    const map = new Map<CodecKey, ShippingRegion>();
    for (const [key, value] of shippingRegions) {
      if (!(value instanceof Map)) {
        throw new TypeError(
          `Expected shipping region value for ${key} to be a Map`,
        );
      }
      map.set(key, ShippingRegion.fromCBOR(value));
    }
    return new ShippingRegionsMap(map);
  }

  asCBORMap(): Map<CodecKey, CodecValue> {
    const map = new Map();
    for (const [key, value] of this.data) {
      map.set(key, value.asCBORMap());
    }
    return map;
  }
}

export class PayeeMap {
  data: Map<CodecKey, Map<CodecKey, PayeeMetadata>> = new Map();

  constructor(data?: Map<CodecKey, Map<CodecKey, PayeeMetadata>>) {
    this.data = data || new Map();
  }

  static fromCBOR(payees: Map<CodecKey, CodecValue>): PayeeMap {
    if (payees === undefined) {
      return new PayeeMap();
    }

    const result = new Map<CodecKey, Map<CodecKey, PayeeMetadata>>();
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

        const payeeMetadata = PayeeMetadata.fromCBOR(
          metadata as Map<"CallAsContract", boolean>,
        );
        validatedAddressMap.set(address, payeeMetadata);
      }

      result.set(chainId, validatedAddressMap);
    }
    return new PayeeMap(result);
  }

  public get size() {
    return this.data.size;
  }

  get(chainId: number): Map<CodecKey, PayeeMetadata> | undefined {
    return this.data.get(chainId);
  }

  addAddress(chainId: number, address: Uint8Array, callAsContract: boolean) {
    const map = new Map();
    for (const [chainId, addressMap] of this.data) {
      const forChainID = new Map();
      for (const [address, metadata] of addressMap) {
        forChainID.set(address, metadata);
      }
      map.set(chainId, forChainID);
    }
    const addressMap = new Map();
    addressMap.set(address, new PayeeMetadata(callAsContract));
    map.set(chainId, addressMap);
    this.data = map;
    return map;
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

  constructor(callAsContract: boolean = false) {
    super();
    this.CallAsContract = callAsContract;
  }

  static fromCBOR(input: Map<CodecKey, CodecValue>): PayeeMetadata {
    const callAsContract = input.get("CallAsContract");
    const callAsContractValue = callAsContract !== undefined
      ? ensureBoolean(callAsContract, "CallAsContract")
      : false;
    return new PayeeMetadata(callAsContractValue);
  }
}

export class Payee extends BaseClass {
  Address: ChainAddress;
  CallAsContract: boolean;

  constructor(address: ChainAddress, callAsContract: boolean = false) {
    super();
    this.Address = address;
    this.CallAsContract = callAsContract;
  }

  static fromCBOR(input: Map<CodecKey, CodecValue>): Payee {
    const addressData = input.get("Address");
    if (!(addressData instanceof Map)) {
      throw new TypeError("Expected Address to be a Map");
    }
    const address = ChainAddress.fromCBOR(addressData);
    const callAsContract = ensureBoolean(
      input.get("CallAsContract"),
      "CallAsContract",
    );
    return new Payee(address, callAsContract);
  }
}

export class AcceptedCurrencyMap {
  data: Map<number, Map<Uint8Array, ContractStatus>> = new Map();

  constructor(data?: Map<number, Map<Uint8Array, ContractStatus>>) {
    this.data = data || new Map();
  }

  static fromCBOR(input: Map<CodecKey, CodecValue>): AcceptedCurrencyMap {
    const result = new Map<number, Map<Uint8Array, Map<string, boolean>>>();
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

      result.set(chainId, validatedAddressMap);
    }
    return new AcceptedCurrencyMap(
      (result as unknown) as Map<number, Map<Uint8Array, ContractStatus>>,
    );
  }

  public get size() {
    return this.data.size;
  }

  getAddressesByChainID(chainId: number) {
    return this.data.get(chainId);
  }
  getAddressMetadata(chainId: number, address: Uint8Array) {
    const addresses = this.data.get(chainId);
    if (addresses) {
      for (const [key, value] of addresses) {
        if (equal(key, address)) {
          return value;
        }
      }
    }
    return null;
  }

  asCBORMap(): Map<number, Map<Uint8Array, ContractStatus>> {
    const map = new Map();
    for (const [chainId, addressMap] of this.data) {
      const addressMapMap = new Map();
      for (const [address, _metadata] of addressMap) {
        //FIXME
        addressMapMap.set(address, new Map());
      }
      map.set(chainId, addressMapMap);
    }
    return map;
  }
  addAddress(chainId: number, address: Uint8Array, isContract: boolean) {
    const allChainsMap = this.asCBORMap();
    const allAddressesMap = allChainsMap.has(chainId)
      ? allChainsMap.get(chainId)
      : new Map();
    allAddressesMap!.set(address, new Map([["IsContract", isContract]]));
    allChainsMap.set(chainId, allAddressesMap!);
    this.data = allChainsMap;
    return allChainsMap;
  }

  removeAddress(chainId: number, address: Uint8Array) {
    const allChainsMap = this.asCBORMap();
    const addressMap = allChainsMap.get(chainId);
    const map = new Map();
    if (addressMap) {
      for (const [key, value] of addressMap) {
        if (!equal(key, address)) {
          map.set(key, value);
        }
      }
    }
    if (map.size) {
      allChainsMap.set(chainId, map);
    } else {
      allChainsMap.delete(chainId);
    }
    this.data = allChainsMap;
    return allChainsMap;
  }
}

export class ChainAddress extends BaseClass {
  Address: Uint8Array;
  ChainID: number;

  constructor(chainID: number, address: Uint8Array) {
    super();
    this.ChainID = chainID;
    this.Address = address;
  }

  static fromCBOR(input: Map<CodecKey, CodecValue>): ChainAddress {
    const chainID = ensureNumber(input.get("ChainID"), "ChainID");
    const address = ensureUint8Array(input.get("Address"), "Address");
    return new ChainAddress(chainID, address);
  }
}

export class ShippingRegion extends BaseClass {
  Country: string;
  PostalCode: string;
  City: string;

  constructor(
    country: string = "",
    postalCode: string = "",
    city: string = "",
  ) {
    super();
    this.Country = country;
    this.PostalCode = postalCode;
    this.City = city;
  }

  static fromCBOR(input: Map<CodecKey, CodecValue>): ShippingRegion {
    const country = ensureString(input.get("Country"), "Country");
    const postalCode = ensureString(input.get("PostalCode"), "PostalCode");
    const city = ensureString(input.get("City"), "City");
    return new ShippingRegion(country, postalCode, city);
  }
}

export class PriceModifier {
  ModificationPrecents?: bigint;
  ModificationAbsolute?: ModificationAbsolute;

  constructor(
    modificationPercents?: bigint,
    modificationAbsolute?: ModificationAbsolute,
  ) {
    // Make it a sum type - only one of these should be set
    if (
      modificationPercents !== undefined && modificationAbsolute !== undefined
    ) {
      throw new Error(
        "PriceModifier must have either ModificationPrecents or ModificationAbsolute, not both",
      );
    }
    this.ModificationPrecents = modificationPercents;
    this.ModificationAbsolute = modificationAbsolute;
  }

  static fromCBOR(input: Map<CodecKey, CodecValue>): PriceModifier {
    // Make it a sum type - only one of these should be set
    if (input.has("ModificationPrecents")) {
      const modificationPercents = ensureBigInt(
        input.get("ModificationPrecents"),
        "ModificationPrecents",
      );
      return new PriceModifier(modificationPercents);
    } else if (input.has("ModificationAbsolute")) {
      const modificationAbsolute = input.get("ModificationAbsolute");
      if (!(modificationAbsolute instanceof Map)) {
        throw new TypeError("Expected ModificationAbsolute to be a Map");
      }
      return new PriceModifier(
        undefined,
        ModificationAbsolute.fromCBOR(modificationAbsolute),
      );
    } else {
      throw new Error(
        "PriceModifier must have either ModificationPrecents or ModificationAbsolute",
      );
    }
  }

  asCBORMap(): Map<CodecKey, CodecValue> {
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

  constructor(amount: bigint, plus: boolean) {
    super();
    this.Amount = amount;
    this.Plus = plus;
  }

  static fromCBOR(input: Map<CodecKey, CodecValue>): ModificationAbsolute {
    const amount = ensureBigInt(input.get("Amount"), "Amount");
    const plus = ensureBoolean(input.get("Plus"), "Plus");
    return new ModificationAbsolute(amount, plus);
  }
}

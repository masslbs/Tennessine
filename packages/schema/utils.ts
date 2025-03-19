export class BaseClass {
  static isBaseClass(value: unknown): value is BaseClass {
    return (
      value instanceof BaseClass ||
      (value !== null && typeof value === "object" && "asCBORMap" in value &&
        typeof value.asCBORMap === "function")
    );
  }

  asCBORMap(): Map<string, unknown> {
    const map = new Map();
    for (const [key, value] of Object.entries(this)) {
      if (
        ["string", "number", "boolean", "bigint"].includes(typeof value) ||
        value instanceof Uint8Array
      ) {
        map.set(key, value);
      } else if (value instanceof Date) {
        map.set(key, value);
      } else if (Array.isArray(value)) {
        const newArray = [];
        for (const v of value) {
          if (BaseClass.isBaseClass(v)) {
            newArray.push(v.asCBORMap());
          } else {
            newArray.push(v);
          }
        }
        map.set(key, newArray);
      } else if (value instanceof Map) {
        const newMap = new Map();
        for (const [k, v] of value.entries()) {
          if (BaseClass.isBaseClass(v)) {
            newMap.set(k, v.asCBORMap());
          } else {
            newMap.set(k, v);
          }
        }
        map.set(key, newMap);
      } else if (BaseClass.isBaseClass(value)) {
        map.set(key, value.asCBORMap());
      } else if (value === undefined) {
        // ignore
      } else {
        console.error({ value });
        throw new Error(
          `Unknown value on ${key}. Type: ${typeof value}`,
        );
      }
    }
    return map;
  }
}

// Helper functions for type validation
export function ensureNumber(value: unknown, fieldName: string): number {
  if (typeof value !== "number" || isNaN(value)) {
    throw new TypeError(
      `Expected ${fieldName} to be a number, got ${typeof value}`,
    );
  }
  return value;
}

// Helper functions for type validation
export function ensureBigInt(value: unknown, fieldName: string): bigint {
  if (typeof value !== "bigint") {
    throw new TypeError(
      `Expected ${fieldName} to be a bigint, got ${typeof value}`,
    );
  }
  return value;
}

// Helper returns number or bigint
export function ensureSomeNumberAsBigInt(
  value: unknown,
  fieldName: string,
): bigint | number {
  if (typeof value === "bigint") {
    return value;
  }
  const num = ensureNumber(value, fieldName);
  // return BigInt(num); // TODO: i'd prefer this but when going to asCBORMap() it needs to convert to smalles possible value, which is annoying..
  return num;
}

export function ensureString(value: unknown, fieldName: string): string {
  if (typeof value !== "string") {
    throw new TypeError(
      `Expected ${fieldName} to be a string, got ${typeof value}`,
    );
  }
  return value;
}

export function ensureBoolean(value: unknown, fieldName: string): boolean {
  if (typeof value !== "boolean") {
    throw new TypeError(
      `Expected ${fieldName} to be a boolean, got ${typeof value}`,
    );
  }
  return value;
}

export function ensureStringArray(value: unknown, fieldName: string): string[] {
  if (
    !Array.isArray(value) || !value.every((item) => typeof item === "string")
  ) {
    throw new TypeError(`Expected ${fieldName} to be an array of strings`);
  }
  return value;
}

export function ensureMap<K, V>(value: unknown, fieldName: string): Map<K, V> {
  if (!(value instanceof Map)) {
    throw new TypeError(
      `Expected ${fieldName} to be a Map, got ${typeof value}`,
    );
  }
  return value as Map<K, V>;
}

// export function ensureMap(value: unknown, fieldName: string): Map<string, unknown> {
//   if (!(value instanceof Map)) {
//     throw new TypeError(`Expected ${fieldName} to be a Map, got ${typeof value}`);
//   }
//   return value;
// }

export function ensureUint8Array(
  value: unknown,
  fieldName: string,
  length?: number,
): Uint8Array {
  if (!(value instanceof Uint8Array)) {
    throw new TypeError(
      `Expected ${fieldName} to be a Uint8Array, got ${typeof value}`,
    );
  }
  if (length !== undefined && value.length !== length) {
    throw new TypeError(
      `Expected ${fieldName} to be a Uint8Array of length ${length}, got ${value.length}`,
    );
  }
  return value;
}

export function ensureDate(value: unknown, fieldName: string): Date {
  if (!(value instanceof Date)) {
    throw new TypeError(
      `Expected ${fieldName} to be a Date, got ${typeof value}`,
    );
  }
  return value;
}

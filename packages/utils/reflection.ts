import { equal } from "@std/assert";
import type { CodecKey } from "./codec.ts";

/**
 * Get a value from an array or map given a `key`, which can be a string, number, or object.
 * If the keys is an object then a deep equality check is performed while iterating through a map.
 * TODO: Iterateing through the map to find a key/value is suboptimal, consider using a more efficient data structure.
 */
export function get(
  obj: unknown,
  key: CodecKey,
) {
  if (obj instanceof Map) {
    if (
      typeof key === "object" && key !== null
    ) {
      // find the key in the map if the key is an array
      const f = obj.entries().find(([k]) => equal(k, key));
      if (f) return f[1];
    } else {
      return obj.get(key);
    }
  } else if (
    typeof obj === "object" && obj !== null &&
    (typeof key === "number" ||
      typeof key === "string")
  ) {
    return Reflect.get(obj, key);
  } else {
    // obj was a number / bool / null / undefined / etc
    return undefined;
  }
}

/**
 * Set a value in an array or map given a `key`, which can be a string, number, or object.
 */
export function set(
  obj: unknown,
  key: CodecKey,
  value: unknown,
): void {
  if (obj instanceof Map) {
    const f = obj.entries().find(([k]) => equal(k, key)) ?? [key];
    obj.set(f[0], value);
  } else if (
    typeof obj === "object" && obj !== null &&
    (typeof key === "number" ||
      typeof key === "string")
  ) {
    Reflect.set(obj, key, value);
  } else {
    throw new Error(`Cannot set key ${key} on ${obj}`);
  }
}

/**
 * Remove a value from an array or map given a `key`, which can be a string, number, or object.
 */
export function remove(
  obj: unknown,
  key: CodecKey,
): void {
  if (obj instanceof Map) {
    const f = obj.entries().find(([k]) => equal(k, key));
    if (f) obj.delete(f[0]);
  } else if (
    obj instanceof Array && typeof key === "number"
  ) {
    obj.splice(key, 1);
  } else {
    throw new Error(`Cannot remove key ${key} from ${obj}`);
  }
}

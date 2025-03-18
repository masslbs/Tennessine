// SPDX-FileCopyrightext: 2024 Mass Labs
//
// SPDX-License-Identifier: MIT

import { equal } from "@std/assert";
import { Buffer } from "buffer";
import {
  bytesToBigInt,
  bytesToHex,
  formatUnits,
  numberToBytes,
  parseUnits,
  toBytes,
} from "@wevm/viem";
import * as Sentry from "@sentry/browser";
import { type CodecKey, type CodecValue, decode } from "./codec.ts";
export * as codec from "./codec.ts";

// TODO: type case first argument to captureException
// TODO: add extras arguments (https://docs.sentry.io/platforms/javascript/guides/nextjs/enriching-events/)
export function logger(
  namespace: string,
  level: "debug" | "info" | "warn" | "error" = "debug",
) {
  return (message: string, error?: Error) => {
    // Sentry handling
    // ===============
    if (level === "debug") {
      // https://docs.sentry.io/platforms/javascript/guides/nextjs/enriching-events/breadcrumbs/
      // > Sentry uses breadcrumbs to create a trail of events that happened prior to an issue. These events are very similar to traditional logs, but can record more rich structured data.
      Sentry.addBreadcrumb({
        level: level as Sentry.SeverityLevel,
        category: namespace,
        message,
      });
    } else {
      // everything but debug get's reported directly
      if (error) {
        // if we have an error, we capture that and add the message and namespace as extras
        Sentry.captureException(error, {
          extra: {
            message,
            namespace,
          },
        });
      } else {
        // if we don't have an error, we just capture the message
        Sentry.captureMessage(message, {
          level: level as Sentry.SeverityLevel,
          extra: {
            namespace,
          },
        });
      }
    }
    // standard console logging
    // ========================
    const stmt = `[${namespace}] ${message}`;
    let fn = console.debug;
    switch (level) {
      case "debug":
        fn = console.debug;
        break;
      case "info":
        fn = console.info;
        break;
      case "warn":
        fn = console.warn;
        break;
      case "error":
        fn = console.error;
        break;
      default:
        fn = console.log;
    }
    const args: [string, Error?] = [stmt];
    if (error) {
      args.push(error);
    }
    fn.call(console, ...args);
  };
}

// Type predicate to narrow undefined | null | T to T
function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}

// Custom assert function for protobuf optional fields
export function assert(value: unknown, message: string): asserts value {
  if (!isDefined(value)) {
    throw new Error(message);
  }
}

// For nested optional fields, you can create a more specific version
export function assertField<T>(
  value: { raw?: T | null } | undefined | null,
  fieldName: string,
): asserts value is { raw: T } {
  if (!isDefined(value) || !isDefined(value.raw)) {
    throw new Error(`${fieldName} is required`);
  }
}

export function objectId() {
  return randomBytes(8);
}

export function randomBytes(n: number) {
  const b = new Uint8Array(n);
  crypto.getRandomValues(b);
  return b;
}

export function random32BytesHex() {
  return bytesToHex(randomBytes(32));
}

export function randomAddress() {
  return bytesToHex(randomBytes(20));
}

export function hexToBase64(hex: string) {
  const u8 = new Uint8Array(toBytes(hex));
  return Buffer.from(u8).toString("base64");
}

export function bufferToJSON(metadata: Uint8Array) {
  return JSON.parse(new TextDecoder().decode(metadata));
}

// This is used to get the string value from an array buffer
export function decodeBufferToString(buffer: Uint8Array) {
  const textDecoder = new TextDecoder();
  return textDecoder.decode(buffer);
}

export function priceToUint256(priceString: string, decimals = 18) {
  // Parse the price string to a bigint
  const priceInSmallestUnit = parseUnits(priceString, decimals);
  // Convert bigint to 32 byte directly
  return numberToBytes(priceInSmallestUnit, { size: 32 });
}

//Since we are currently storing price as a string, convert string to bigint, then calculate the decimal point.
export function formatUnitsFromString(price: string, decimal: number) {
  return formatUnits(BigInt(price), decimal);
}

export function random256BigInt() {
  return bytesToBigInt(randomBytes(32));
}

export type Hash = Uint8Array;

export async function hash(data: BufferSource): Promise<Hash> {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", data));
}

// TODO: we need a some way to denote whether the value is a hash
export function isHash(node: CodecValue): node is Hash {
  return node instanceof Uint8Array && node.length === 32;
}

export function getWindowLocation() {
  return typeof window == "undefined"
    ? undefined
    : new URL(globalThis.location.href);
}

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
      typeof key === "string" ||
      typeof key === "symbol")
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
    obj.set(key, value);
  } else if (
    typeof obj === "object" && obj !== null &&
    (typeof key === "number" ||
      typeof key === "string" ||
      typeof key === "symbol")
  ) {
    Reflect.set(obj, key, value);
  } else {
    throw new Error(`Cannot set key ${key} on ${obj}`);
  }
}
export async function fetchAndDecode(filename: string) {
  const response = await fetch(
    `file://${Deno.env.get("MASS_TEST_VECTORS")}/vectors/${filename}.cbor`,
  );
  const bytes = await response.bytes();
  return decode(bytes) as Map<string, unknown>;
}

export function extractEntriesFromHAMT(
  hamtNode: unknown,
): Map<number, unknown> {
  if (!hamtNode || !Array.isArray(hamtNode) || hamtNode.length < 2) {
    return new Map();
  }

  const entries = hamtNode[1];
  const result = new Map<number, unknown>();

  if (Array.isArray(entries)) {
    for (const entry of entries) {
      if (Array.isArray(entry) && entry.length >= 2) {
        // Check if this is a leaf node or another HAMT node
        if (entry.length > 2 && entry[2] !== null) {
          // This is another HAMT node, recurse into it
          const subEntries = extractEntriesFromHAMT(entry[2]);
          // Merge the results
          for (const [subKey, subValue] of subEntries.entries()) {
            result.set(subKey, subValue);
          }
        } else {
          // This is a leaf node
          const key = entry[0];
          const value = entry[1];
          // Convert key (Uint8Array) to number (8-byte big endian)
          const keyNum = new DataView(
            key.buffer,
            key.byteOffset,
            key.byteLength,
          )
            .getBigUint64(0, false);
          result.set(Number(keyNum), value);
        }
      }
    }
  }
  return result;
}

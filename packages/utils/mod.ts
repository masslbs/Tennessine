// SPDX-FileCopyrightext: 2024 Mass Labs
//
// SPDX-License-Identifier: MIT

import { bytesToBigInt, bytesToNumber, toBytes } from "viem";
import { type CodecValue, decode } from "./codec.ts";
export * as codec from "./codec.ts";
export * from "./reflection.ts";
export * from "./getBurnerWallet.ts";

export function randUint64(): number {
  return bytesToNumber(randomBytes(4));
}

export function randomBytes(n: number) {
  const b = new Uint8Array(n);
  crypto.getRandomValues(b);
  return b;
}

export function hexToBase64(hex: string) {
  const binString = Array.from(
    toBytes(hex),
    (byte) => String.fromCodePoint(byte),
  ).join("");
  return btoa(binString);
}

// This is used to get the string value from an array buffer
export function decodeBufferToString(buffer: Uint8Array) {
  const textDecoder = new TextDecoder();
  return textDecoder.decode(buffer);
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

type TestVector = Map<
  string,
  Array<Map<string, Map<string, Map<string, Map<string, CodecValue>>>>>
>;

export async function fetchAndDecode(filename: string): Promise<TestVector> {
  const response = await fetch(
    `file://${Deno.env.get("MASS_TEST_VECTORS")}/vectors/${filename}.cbor`,
  );
  const bytes = await response.bytes();
  return decode(bytes) as TestVector;
}

export function extractEntriesFromHAMT(
  hamtNode: unknown,
): CodecValue {
  if (!hamtNode || !Array.isArray(hamtNode) || hamtNode.length < 2) {
    return new Map();
  }

  const entries = hamtNode[1];
  const result = new Map<number | Uint8Array, CodecValue>();

  if (Array.isArray(entries)) {
    for (const entry of entries) {
      if (Array.isArray(entry) && entry.length >= 2) {
        // Check if this is a leaf node or another HAMT node
        if (entry.length > 2 && entry[2] !== null) {
          // This is another HAMT node, recurse into it
          const subEntries = extractEntriesFromHAMT(entry[2]);
          // Merge the results
          if (!(subEntries instanceof Map)) {
            throw new TypeError("Expected subEntries to be a Map");
          }
          for (const [subKey, subValue] of subEntries.entries()) {
            if (typeof subKey !== "number") {
              throw new TypeError("Expected subKey to be a number");
            }
            result.set(subKey, subValue);
          }
        } else {
          // This is a leaf node
          const key = entry[0];
          const value = entry[1];
          if (key.length === 8) {
            // Convert key (Uint8Array) to number (8-byte big endian)
            const keyNum = new DataView(
              key.buffer,
              key.byteOffset,
              key.byteLength,
            )
              .getBigUint64(0, false);
            result.set(Number(keyNum), value);
          } else {
            result.set(key, value);
          }
        }
      }
    }
  }
  return result;
}

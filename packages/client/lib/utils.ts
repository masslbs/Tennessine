import { Buffer } from "buffer";
import { bytesToHex, toBytes } from "viem";

export function requestId() {
  return randomBytes(16);
}

export function eventId() {
  return randomBytes(32);
}

export function randomBytes(n: number) {
  const b = new Uint8Array(n);
  crypto.getRandomValues(b);
  return b;
}

export function convertFirstCharToLowerCase(str: string) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export function snakeToCamel(str: string) {
  return str.replace(/_([a-z])/g, (match, letter) => `${letter.toUpperCase()}`);
}

function camelToSnake(str: string) {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function formatArray(array: Uint8Array[] | number[]) {
  if (typeof array[0] === "number") {
    return array.map((num) => BigInt(num as number));
  } else {
    return array.map((m) => bytesToHex(m as Uint8Array));
  }
}

// TODO: there are a lot of assumptions backed in here that should be commented
export function formatMessageForSigning(
  obj: Record<string, Uint8Array | string | number | Uint8Array[] | number[]>,
) {
  const snakeCase: Record<
    string,
    string | `0x${string}`[] | BigInt | BigInt[]
  > = {};
  for (const [key, value] of Object.entries(obj)) {
    // TODO: Refactor this. Nested ternary operators are hard to read and a nightmare to change.
    snakeCase[camelToSnake(key)] = Array.isArray(value)
      ? formatArray(value)
      : typeof value === "string"
        ? value
        : typeof value === "number"
          ? BigInt(value)
          : bytesToHex(value);
  }
  return snakeCase;
}

export function getRandomStoreId() {
  return bytesToHex(randomBytes(32));
}

export function generatePk() {
  return bytesToHex(randomBytes(32));
}

export function hexToBase64(hex: string) {
  const u8 = new Uint8Array(toBytes(hex));
  return Buffer.from(u8).toString("base64");
}

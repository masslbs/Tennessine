import { Buffer } from "buffer";
import { bytesToHex, toBytes } from "viem";

export type NetworkMessage = {
  [k: string]:
    | Uint8Array
    | string
    | number
    | Uint8Array[]
    | number[]
    | NetworkMessage;
};

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

// TODO: there are a lot of assumptions baked in here that should be commented
export function formatMessageForSigning(obj: NetworkMessage) {
  const snakeCase: any = {};
  const convert = (value: any) => {
    if (Array.isArray(value)) {
      return formatArray(value);
    } else if (typeof value === "string") {
      return value;
    } else if (typeof value === "number") {
      return BigInt(value);
    } else if (value instanceof Uint8Array) {
      return bytesToHex(value);
    } else if (typeof value === "object") {
      return formatMessageForSigning(value);
    } else {
      console.warn(value);
      throw new Error(`unhandled type in signing conversion`);
    }
  };
  for (const [key, value] of Object.entries(obj)) {
    snakeCase[camelToSnake(key)] = convert(value);
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

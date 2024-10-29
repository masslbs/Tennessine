// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: MIT

import { Buffer } from "buffer";
import {
  bytesToHex,
  toBytes,
  parseUnits,
  numberToBytes,
  hexToBytes,
  formatUnits,
} from "viem";

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
  fieldName: string
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

//This is used to get the string value from an array buffer
export function decodeBufferToString(buffer: Uint8Array) {
  const textDecoder = new TextDecoder();
  return textDecoder.decode(buffer);
}

export function stringifyToBuffer(data: any) {
  return new TextEncoder().encode(JSON.stringify(data));
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

interface AdressObj {
  address: `0x${string}`;
  chainId: number;
  callAsContract?: boolean;
  name?: string;
}

// TODO: what does this do?
export function addressToUint256(addressObject: AdressObj) {
  return {
    ...addressObject,
    address: { raw: hexToBytes(addressObject.address) },
  }
}

export function addressesToUint256(addressObject: AdressObj[]) {
  if (!Array.isArray(addressObject)) {
    throw new Error("addressesToUint256 expects an array of AdressObj");
  }
  return addressObject.map((c) => {
    return {
      ...c,
      address: { raw: hexToBytes(c.address) },
    };
  });
}

export const zeroAddress: `0x${string}` =
  "0x0000000000000000000000000000000000000000";
export const usdcAddress: `0x${string}` =
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
export const anvilPrivateKey =
  "0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6";
export const anvilPrivateKey2 =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
export const anvilAddress = "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720";

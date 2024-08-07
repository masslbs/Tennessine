// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: MIT

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

export const bufferToJSON = (metadata: Uint8Array) => {
  return JSON.parse(new TextDecoder().decode(metadata));
};

export const stringifyToBuffer = (data: any) => {
  return new TextEncoder().encode(JSON.stringify(data));
};

export const zeroAddress = "0x0000000000000000000000000000000000000000";
export const anvilAddress =
  "0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6";

// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: MIT

import { Buffer } from "buffer";
import { bytesToHex, toBytes } from "viem";

type Metadata = {
  name: string;
  description: string;
  image: string;
};

export function requestId() {
  return randomBytes(16);
}

export function eventId() {
  return randomBytes(32);
}

export const parseMetadata = (metadata: Uint8Array) => {
  const textDecoder = new TextDecoder();
  const result = textDecoder.decode(metadata);
  const _meta: Metadata = JSON.parse(result);
  return _meta;
};

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

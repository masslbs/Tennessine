// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: MIT

import { Buffer } from "buffer";
import {
  bytesToHex,
  formatUnits,
  hexToBytes,
  numberToBytes,
  parseUnits,
  toBytes,
} from "viem";
import * as Sentry from "@sentry/nextjs";
import { bytesToBigInt } from "@ethereumjs/util";

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
    } else { // everything but debug get's reported directly
      if (error) { // if we have an error, we capture that and add the message and namespace as extras
        Sentry.captureException(error, {
          extra: {
            message,
            namespace,
          },
        });
      } else { // if we don't have an error, we just capture the message
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

//This is used to get the string value from an array buffer
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
  };
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

export function random256BigInt() {
  return bytesToBigInt(randomBytes(32));
}

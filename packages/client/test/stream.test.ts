import { describe, assert, expect, test } from "vitest";
import { ReadableEventStream } from "../src/stream";
import { privateKeyToAccount } from "viem/accounts";
import { hexToBytes } from "viem";
import testVectorsData from "./testVectors.json" with { type: "json" };

import schema, { PBObject, PBMessage, PBInstance } from "@massmarket/schema";

let reqIdCounter: number = 1;
function sequentialReqId() {
  const reqIdSize = 16;
  const bytes = new Uint8Array(16);
  let bigint = BigInt(reqIdCounter);
  for (let i = 0; i < reqIdSize; i++) {
    bytes[reqIdSize - 1 - i] = Number(bigint & BigInt(0xff));
    bigint >>= BigInt(reqIdSize);
  }
  reqIdCounter++;
  return bytes;
}
const account = privateKeyToAccount(
  "0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6",
);

async function signMessage(message: PBObject) {
  const shopEventBytes = schema.ShopEvent.encode(message).finish();
  const sig = await account.signMessage({
    message: { raw: shopEventBytes },
  });
  const signedEvent = {
    signature: hexToBytes(sig),
    event: {
      type_url: "type.googleapis.com/market.mass.ShopEvent",
      value: shopEventBytes,
    },
  };
  return signedEvent;
}

class MockClient {
  encodeAndSendNoWait(
    encoder: PBMessage,
    object: PBObject = {},
  ): Promise<PBInstance> {
    return Promise.resolve(encoder.encode(object).finish());
  }
}

describe("Stream", async () => {
  test("Stream Creation", async () => {
    const testCreateItem = {
      updateItem: {
        eventId: Buffer.from([1, 2, 3, 4]),
        price: "1000",
        metadata: Buffer.from([1, 2, 3, 4]),
      },
    };
    const signedMessage = await signMessage(testCreateItem);
    const pushEvent = {
      requestId: Uint8Array.from([1, 2, 3, 4]),
      events: [signedMessage],
    };
    const client = new MockClient();
    const stream = new ReadableEventStream(client);
    stream.enqueue(pushEvent);
    for await (const evt of stream.stream) {
      assert.deepEqual(
        evt.event.updateItem,
        schema.UpdateItem.create(testCreateItem.updateItem),
      );
      expect(evt.signer).toEqual(account.address);
      break;
    }

    stream.enqueue(pushEvent);
    for await (const _ of stream.stream) {
      // should not emit after close
      assert.fail();
    }
  });

  test("Multiple Stream Creation", async () => {
    const testCreateItem = {
      updateItem: {
        eventId: Buffer.from([1, 2, 3, 4]),
        price: "1000",
        metadata: Buffer.from([1, 2, 3, 4]),
      },
    };

    const signedMessage = await signMessage(testCreateItem);
    const events = [];

    for (let index = 0; index < 50; index++) {
      events.push(signedMessage);
    }
    const pushEvent = {
      requestId: Uint8Array.from([1, 2, 3, 4]),
      events,
    };
    const client = new MockClient();
    const stream = new ReadableEventStream(client);
    stream.enqueue(pushEvent);
    let count = 0;
    for await (const evt of stream.stream) {
      count++;
      if (count === pushEvent.events.length) break;
    }
  });

  test("Multiple Stream Creation with test vectors", async () => {
    const events = [];
    for (let index = 0; index < testVectorsData.events.length; index++) {
      const evt = testVectorsData.events[index];
      events.push({
        signature: hexToBytes(("0x" + evt.signature) as `0x${string}`),
        event: {
          type_url: "type.googleapis.com/market.mass.ShopEvent",
          value: hexToBytes(("0x" + evt.encoded) as `0x${string}`),
        },
      });
    }

    const pushReq = new schema.EventPushRequest({
      requestId: sequentialReqId(),
      events,
    });

    const client = new MockClient();
    const stream = new ReadableEventStream(client);
    stream.enqueue(pushReq);
    let count = 0;
    for await (const evt of stream.stream) {
      count++;
      if (count === pushReq.events.length) break;
    }
    expect(count).toEqual(testVectorsData.events.length);
  });

  test("Stream Cancel ", () => {
    assert.doesNotThrow(async () => {
      const testCreateItem = {
        updateItem: {
          eventId: Buffer.from([1, 2, 3, 4]),
          price: "1000",
          metadata: Buffer.from([1, 2, 3, 4]),
        },
      };
      const signedMessage = await signMessage(testCreateItem);
      const pushEvent = {
        requestId: Uint8Array.from([1, 2, 3, 4]),
        events: [signedMessage, signedMessage],
      };
      const client = new MockClient();
      const stream = new ReadableEventStream(client);
      stream.enqueue(pushEvent);
      const reader = stream.stream.getReader();
      await reader.read();
      reader.cancel();
    });
  });
});

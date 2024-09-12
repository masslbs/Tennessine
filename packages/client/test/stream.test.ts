// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: MIT

import { describe, assert, expect, test } from "vitest";
import { ReadableEventStream } from "../src/stream";
import { privateKeyToAccount } from "viem/accounts";
import { hexToBytes } from "viem";

import schema, {
  testVectors,
  PBObject,
  PBMessage,
  PBInstance,
} from "@massmarket/schema";
import { randomBytes } from "@massmarket/utils";

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

async function chunkArray(array: any[], chunkSize: number) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
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

  test("Stream with lots of events", async () => {
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

  test("Stream filled with test vectors", async () => {
    const events = [];
    for (let index = 0; index < testVectors.events.length; index++) {
      const evt = testVectors.events[index];
      events.push({
        signature: hexToBytes(evt.signature as `0x${string}`),
        event: {
          type_url: "type.googleapis.com/market.mass.ShopEvent",
          value: hexToBytes(evt.encoded as `0x${string}`),
        },
      });
    }

    const pushReq = new schema.EventPushRequest({
      requestId: randomBytes(16),
      events,
    });

    const client = new MockClient();
    const stream = new ReadableEventStream(client);
    stream.enqueue(pushReq);
    // TODO: we need a way to close the stream once all requests have been pushed
    let count = 0;
    for await (const evt of stream.stream) {
      count++;
      // this might never happen if events are omitted by ReadableEventStream
      // TODO: this might also exit to early if events would be duplicated...
      if (count === pushReq.events.length) break;
    }
    expect(count).toEqual(testVectors.events.length);
  });

  // TODO: should add version of the test above that creates random chunking of the test vectors
  // and assert that they are all returned in order as individual events

  test("Stream with random chunking of test vectors", async () => {
    const events = [];
    for (let index = 0; index < testVectors.events.length; index++) {
        const evt = testVectors.events[index];
      events.push({
        signature: hexToBytes(evt.signature as `0x${string}`),
        event: {
          type_url: "type.googleapis.com/market.mass.ShopEvent",
          value: hexToBytes(evt.encoded as `0x${string}`),
        },
      });
    }

    const client = new MockClient();
    const stream = new ReadableEventStream(client);

    const chunkedEvents = await chunkArray(events, Math.floor(Math.random() * events.length) + 1);
    for (const chunk of chunkedEvents) {
      stream.enqueue(new schema.EventPushRequest({
        requestId: randomBytes(16),
        events: chunk,
      }));

      await new Promise(resolve => setTimeout(resolve, 10));
    }

    let count = 0;
    let receivedEvents = [];

    for await (const evt of stream.stream) {
      receivedEvents.push(evt);
      count++;
      if (count === events.length) break;
    }

    for (let i = 0; i < events.length; i++) {

      expect(receivedEvents.length).toEqual(events.length);
      expect(schema.ShopEvent.decode(events[i].event.value)).toEqual(receivedEvents[i].event);

    }
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

  test("Stream error should bubble up", async () => {
    const signedMessage = await signMessage({
      updateItem: {
        eventId: Buffer.from([1, 2, 3, 4]),
        price: "1000",
        metadata: Buffer.from([1, 2, 3, 4]),
      },
    });

    const pushEvent = {
      requestId: Uint8Array.from([1, 2, 3, 4]),
      events: [signedMessage],
    };
    const client = new MockClient();
    const stream = new ReadableEventStream(client);
    stream.enqueue(pushEvent);

    const errorTest = async () => {
      for await (const evt of stream.stream) {
        throw new Error("Store update failed");
      }
    };

    await expect(errorTest).rejects.toThrowError();
  });
});

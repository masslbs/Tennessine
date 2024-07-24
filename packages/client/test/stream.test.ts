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

  test("Stream with lot's of events", async () => {
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
        signature: hexToBytes(("0x" + evt.signature) as `0x${string}`),
        event: {
          type_url: "type.googleapis.com/market.mass.ShopEvent",
          value: hexToBytes(("0x" + evt.encoded) as `0x${string}`),
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

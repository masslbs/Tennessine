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
import { anvilPrivateKey, priceToUint256, objectId } from "@massmarket/utils";

const account = privateKeyToAccount(anvilPrivateKey);

async function signMessage(message: PBObject) {
  const shopEventBytes = schema.ShopEvent.encode(message).finish();
  const sig = await account.signMessage({
    message: { raw: shopEventBytes },
  });
  const signedEvent = {
    event: {
      signature: { raw: hexToBytes(sig) },
      event: {
        type_url: "type.googleapis.com/market.mass.ShopEvent",
        value: shopEventBytes,
      },
    },
  };
  return signedEvent;
}

class MockClient {
  encodeAndSendNoWait(object: PBObject = {}): Promise<PBInstance> {
    return Promise.resolve(object);
  }
}

describe("Stream", async () => {
  const price = priceToUint256("10.99");

  test("Stream Creation", async () => {
    const testCreateItem = {
      listing: {
        id: objectId(),
        price: {
          raw: price,
        },
        metadata: schema.ListingMetadata.create({
          title: "",
          description: "",
          images: [""],
        }),
      },
    };
    const signedMessage = await signMessage(testCreateItem);
    const pushEvent = {
      events: [signedMessage],
    };
    const client = new MockClient();
    const stream = new ReadableEventStream(client);
    const testItem = schema.Listing.create(testCreateItem.listing);
    stream.enqueue(pushEvent);
    for await (const evt of stream.stream) {
      assert.deepEqual(evt.event.listing.metadata, testItem.metadata);
      expect(Buffer.from(evt.event.listing.price.raw)).toEqual(
        Buffer.from(testItem.price.raw),
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
      createItem: {
        price: price,
        metadata: {
          title: "",
          description: "",
          image: "",
        },
      },
    };

    const signedMessage = await signMessage(testCreateItem);
    const events = [];

    for (let index = 0; index < 50; index++) {
      events.push(signedMessage);
    }
    const pushEvent = {
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
        event: {
          signature: { raw: hexToBytes(evt.signature as `0x${string}`) },
          event: {
            type_url: "type.googleapis.com/market.mass.ShopEvent",
            value: hexToBytes(evt.encoded as `0x${string}`),
          },
        },
      });
    }

    const pushReq = new schema.SubscriptionPushRequest({
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
        updateListing: {
          eventId: Buffer.from([1, 2, 3, 4]),
          price: Buffer.from([1, 2, 3, 4]),
          metadata: {
            title: "",
            description: "",
            image: "",
          },
        },
      };
      const signedMessage = await signMessage(testCreateItem);
      const pushEvent = {
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
      updateListing: {
        eventId: Buffer.from([1, 2, 3, 4]),
        price: Buffer.from([1, 2, 3, 4]),
        metadata: {
          title: "",
          description: "",
          image: "",
        },
      },
    });

    const pushEvent = {
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

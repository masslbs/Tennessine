// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: MIT

import assert from "node:assert";
import { Buffer } from "node:buffer";
import { describe, test } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { privateKeyToAccount } from "jsr:@wevm/viem/accounts";
import { hexToBytes } from "jsr:@wevm/viem";
import schema, { testVectors } from "@massmarket/schema";
import {
  anvilPrivateKey,
  objectId,
  priceToUint256,
  randomBytes,
} from "@massmarket/utils";
import { ReadableEventStream } from "./stream.ts";

const account = privateKeyToAccount(anvilPrivateKey);

async function signMessage(message: schema.IShopEvent) {
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

class StubClient {
  encodeAndSendNoWait(_: schema.IEnvelope = {}): schema.RequestId {
    return schema.RequestId.create({ raw: 0 });
  }
}

describe("Stream", () => {
  const price = priceToUint256("10.99");

  test("Stream Creation", async () => {
    const testCreateItem = {
      listing: {
        id: { raw: objectId() },
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
      requestId: schema.RequestId.create({ raw: 0 }),
      events: [
        schema.SubscriptionPushRequest.SequencedEvent.create(signedMessage),
      ],
    };
    const client = new StubClient();
    const stream = new ReadableEventStream(client);
    const testItem = schema.Listing.create(testCreateItem.listing);
    stream.enqueue(pushEvent);
    for await (const evt of stream.stream) {
      assert.deepEqual(evt.event.listing.metadata, testItem.metadata);
      expect(Buffer.from(evt.event.listing.price.raw)).toEqual(
        Buffer.from(testItem.price!.raw!),
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
      listing: {
        price: {
          raw: price,
        },
        metadata: {
          title: "",
          description: "",
          images: [""],
        },
      },
    };

    const signedMessage = await signMessage(testCreateItem);
    const events: schema.SubscriptionPushRequest.SequencedEvent[] = [];

    for (let index = 0; index < 50; index++) {
      events.push(
        schema.SubscriptionPushRequest.SequencedEvent.create(signedMessage),
      );
    }
    const pushEvent = {
      requestId: schema.RequestId.create({ raw: 0 }),
      events,
    };
    const client = new StubClient();
    const stream = new ReadableEventStream(client);
    stream.enqueue(pushEvent);
    let count = 0;
    for await (const _ of stream.stream) {
      count++;
      if (count === pushEvent.events.length) break;
    }
  });

  test("Stream filled with test vectors", async () => {
    const events = [];
    for (let index = 0; index < testVectors.events.length; index++) {
      const evt = testVectors.events[index];
      events.push(
        schema.SubscriptionPushRequest.SequencedEvent.create({
          event: {
            signature: { raw: hexToBytes(evt.signature as `0x${string}`) },
            event: {
              type_url: "type.googleapis.com/market.mass.ShopEvent",
              value: hexToBytes(evt.encoded as `0x${string}`),
            },
          },
          seqNo: index,
        }),
      );
    }

    const pushReq = {
      requestId: schema.RequestId.create({ raw: 0 }),
      events,
    };

    const client = new StubClient();
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
          id: { raw: objectId() },
          price: { raw: priceToUint256("10.99") },
          metadata: {
            title: "",
            description: "",
            images: [""],
          },
        },
      };
      const signedMessage = await signMessage(testCreateItem);
      const sequencedEvent =
        schema.SubscriptionPushRequest.SequencedEvent.create(signedMessage);
      const pushEvent = {
        requestId: schema.RequestId.create({ raw: 0 }),
        events: [sequencedEvent, sequencedEvent],
      };
      const client = new StubClient();
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
        id: { raw: objectId() },
        price: { raw: priceToUint256("10.99") },
        metadata: {
          title: "",
          description: "",
          images: [""],
        },
      },
    });
    const pushEvent = {
      requestId: schema.RequestId.create({ raw: 0 }),
      events: [signedMessage],
    };
    const client = new StubClient();
    const stream = new ReadableEventStream(client);
    const sequencedEvent =
      schema.SubscriptionPushRequest.SequencedEvent.create(signedMessage);
    stream.enqueue({
      requestId: pushEvent.requestId,
      events: [sequencedEvent],
    });
    let called = false;
    try {
      for await (const _ of stream.stream) {
        throw new Error("Store update failed");
      }
    } catch (e) {
      expect((e as Error).message).toEqual("Store update failed");
      called = true;
    }
    assert(called);
  });
});

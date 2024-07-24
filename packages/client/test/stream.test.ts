import { describe, assert, expect, test, vi } from "vitest";
import { ReadableEventStream } from "../src/stream";
import { privateKeyToAccount } from "viem/accounts";
import { hexToBytes } from "viem";
import { Level } from "level";
import { StateManager } from "@massmarket/stateManager";
import { EventEmitter } from "events";
import testVectorsData from "./testVectors.json" with { type: "json" };
import schema, {
  PBObject,
  PBMessage,
  PBInstance,s
  google,
} from "@massmarket/schema";

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

class MockClient extends EventEmitter {
  private eventStream;
  vectors;

  constructor() {
    super();
    this.eventStream = new ReadableEventStream(this);
    this.vectors = testVectorsData;
  }
  encodeAndSendNoWait(
    encoder: PBMessage,
    object: PBObject = {},
  ): Promise<PBInstance> {
    return Promise.resolve(encoder.encode(object).finish());
  }
  createEventStream() {
    return this.eventStream.stream;
  }

  async connect() {
    const events = [];
    for (let index = 0; index < this.vectors.events.length; index++) {
      const evt = this.vectors.events[index];
      const decoded = schema.ShopEvent.decode(hexToBytes("0x" + evt.encoded));
      console.log({ decoded, index });

      const signedEvent = {
        signature: hexToBytes("0x" + evt.signature),
        event: {
          type_url: "type.googleapis.com/market.mass.ShopEvent",
          value: hexToBytes("0x" + evt.encoded),
        },
      };
      events.push(signedEvent);
    }

    const pushReq = {
      requestId: sequentialReqId(),
      events,
    };
    console.log("all events length", events.length);

    this.eventStream.enqueue(pushReq);
  }
}

describe("Stream", async () => {
  const db = new Level(`./test`, {
    valueEncoding: "json",
  });
  db.clear();
  const listingStore = db.sublevel("listingStore", {
    valueEncoding: "json",
  });
  const tagStore = db.sublevel("tagStore", {
    valueEncoding: "json",
  });
  const shopManifestStore = db.sublevel("shopManifestStore", {
    valueEncoding: "json",
  });
  const orderStore = db.sublevel("orderStore", {
    valueEncoding: "json",
  });

  test("Stream Creation", async () => {
    const client = new MockClient();
    const stateManager = new StateManager(
      client,
      listingStore,
      tagStore,
      shopManifestStore,
      orderStore,
    );

    await client.connect();

    // await vi.waitUntil(async () => {
    //   return stateManager.eventCount == client.vectors.events.length;
    // });

    const storeData = await shopManifestStore.iterator().all();
    console.log({ storeData });
    // stream.enqueue(pushEvent);
    // for await (const _ of stream.stream) {
    //   // should not emit after close
    //   assert.fail();
    // }
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

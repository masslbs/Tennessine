// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: MIT

import { recoverMessageAddress } from "viem";
import { ReadableStream } from "web-streams-polyfill";
import Long from "long";

import schema from "@massmarket/schema";

import { type RelayClient, SequencedEventWithRecoveredSigner } from "./mod.ts";
import { assert, assertField } from "../utils/mod.ts";

// TODO: better name. it's basically a push request but with class values instead of interfaces
type SequencedEventsWithRequestId = {
  requestId: schema.RequestId;
  events: schema.SubscriptionPushRequest.SequencedEvent[];
};

/**
 * This class is a Simple wrapper around a ReadableStream that expose the controller
 * so that a third party can enqueue events into the stream.
 */
export class ReadableEventStream {
  public stream;
  private resolve!: (val: any) => void;
  private nextPushReq: Promise<schema.SubscriptionPushRequest.ISequencedEvent>;
  // TODO: this isn't thread safe
  private queue: SequencedEventsWithRequestId[] = [];

  constructor(public client: Pick<RelayClient, "encodeAndSendNoWait">) {
    const self = this;

    this.nextPushReq =
      new Promise<schema.SubscriptionPushRequest.ISequencedEvent>((resolve) => {
        this.resolve = resolve;
      });

    this.stream = new ReadableStream<SequencedEventWithRecoveredSigner>({
      start(_controller) {},
      // if pull returns a promise it will not be called again untill the promise is resolved regardless of the highwatermark
      // here we are using a recursive pull that will never resolve so that we have full control over when it is being called
      // and when to ask for the next chunk of data
      async pull(controller) {
        const pushReq = self.queue.shift();
        if (pushReq) {
          const requestId = pushReq.requestId;
          for (const anyEvt of pushReq.events) {
            assert(anyEvt.event, "event is required");
            assert(
              anyEvt.seqNo < Long.fromNumber(Number.MAX_SAFE_INTEGER),
              "seqNo is required",
            );
            const shopSeqNo = Number(anyEvt.seqNo ?? 0); // this is stupid. protobuf zero value is not 0. it's undefined
            assert(anyEvt.event.event, "event.event is required");
            assert(anyEvt.event.signature, "event.signature is required");
            assert(anyEvt.event.event.value, "event.event.value is required");
            assertField(anyEvt.event.signature, "event.signature");
            const event = schema.ShopEvent.decode(anyEvt.event.event.value);
            const signer = await recoverMessageAddress({
              message: { raw: anyEvt.event.event.value },
              signature: anyEvt.event.signature.raw,
            });
            controller.enqueue(
              new SequencedEventWithRecoveredSigner(shopSeqNo, event, signer),
            );
          }
          // Send a response to the relay to indicate that we have processed the events
          self.client.encodeAndSendNoWait({
            requestId,
            response: {},
          });
        }
        await self.nextPushReq;
        return this.pull!(controller);
      },
    });
  }

  // This method is meant to be used by the client to enqueue events into the stream
  enqueue(pushReq: SequencedEventsWithRequestId) {
    this.queue.push(pushReq);
    this.resolve(null);
    this.nextPushReq =
      new Promise<schema.SubscriptionPushRequest.ISequencedEvent>((resolve) => {
        this.resolve = resolve;
      });
  }
}

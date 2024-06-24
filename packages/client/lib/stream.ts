import { recoverMessageAddress } from "viem";
import schema from "@massmarket/schema";
import { RelayClient } from "./";

/**
 * This class is a Simple wrapper around a ReadableStream that expose the controller
 * so that a third party can enqueue events into the stream.
 */
export class ReadableEventStream {
  public stream;
  public requestId: Uint8Array | null = null;
  private controller!: ReadableStreamDefaultController<schema.ShopEvent>;
  private closed = false;

  constructor(public client: RelayClient) {
    const self = this;
    this.stream = new ReadableStream(
      {
        start(controller) {
          self.controller = controller;
        },
        pull() {
          if (self.requestId) {
            // Send a response to the relay to indicate that we have processed the events
            self.client.encodeAndSend(schema.EventPushResponse, {
              requestId: self.requestId,
            });
            self.requestId = null;
          }
        },
        cancel() {
          self.closed = true;
        },
      },
      { highWaterMark: 0 },
    );
  }

  async enqueue(pushReq: schema.EventPushRequest) {
    this.requestId = pushReq.requestId;
    for (const anyEvt of pushReq.events) {
      const event = schema.ShopEvent.decode(anyEvt.event.value);
      const signer = await recoverMessageAddress({
        message: { raw: anyEvt.event.value },
        signature: anyEvt.signature,
      });
      if (!this.closed) {
        this.controller.enqueue({ event, signer });
      }
    }
  }
}

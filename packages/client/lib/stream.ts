import schema from "@massmarket/schema";
import { RelayClient } from "./";

/**
 * This class is a Simple wrapper around a ReadableStream that expose the controller
 * so that a third party can enqueue events into the stream.
 */
export class ReadableEventStream {
  public stream: ReadableStream<schema.ShopEvent>;
  public requestId: Uint8Array | null = null;
  private controller!: ReadableStreamDefaultController<schema.ShopEvent>;

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
      },
      { highWaterMark: 0 },
    );
  }

  enqueue(pushReq: schema.EventPushRequest) {
    this.requestId = pushReq.requestId;
    for (const anyEvt of pushReq.events) {
      let evt = schema.ShopEvent.decode(anyEvt.value!);
      this.controller.enqueue(evt);
    }
  }
}

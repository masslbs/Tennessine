import { EventEmitter } from "events";
import { Level } from "level";
import { RelayClient } from "@massmarket/client";

export class StateManager extends EventEmitter {
  constructor(
    protected db: Level<string, Uint8Array>,
    protected client: any,
  ) {
    super();
  }

  // getStream
  // listings
  // publicKeys
  // taggs
}

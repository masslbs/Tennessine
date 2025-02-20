import * as v from "jsr:@valibot/valibot";
import {
  Graph,
  Link,
  type LinkValue,
  type StoreInterface,
} from "@nullradix/merkle-dag-builder";
import jsonpointer from "npm:@sagold/json-pointer";
import { getSubSchema } from "./validation.ts";
import { assert } from "jsr:@std/assert";
import EventTree from "@massmarket/eventTree";
import type { RelayClient } from "@massmarket/client";

export type Path = string | string[];
// export interface Op {
//   op: "set" | "delete";
//   path: string | string[];
//   value: LinkValue;
// }
// export type Patch<T> = { path: Path; value: T }[];

export interface IStateMetadata {
  root: Link;
  height: number;
}

export default class DataBase<T extends v.GenericSchema, VT = v.InferInput<T>> {
  readonly events = new EventTree();
  readonly states: Map<
    string,
    IStateMetadata
  > = new Map();
  readonly graph: Graph;
  readonly clients: Set<RelayClient> = new Set();
  // todo: change to op
  #streamsControllers: ReadableStreamDefaultController<unknown>[] = [];
  constructor(
    public params: {
      schema: T;
      store: StoreInterface;
      id: number;
    },
  ) {
    this.graph = new Graph(params);
  }

  async open(id = "local") {
    const storedState = await this.graph.getMetaData(id) as
      | { height: number; root: Uint8Array }
      | undefined;

    const state = storedState
      ? {
        height: storedState.height,
        root: new Link({ hash: storedState.root }),
      }
      : {
        height: 0,
        root: new Link({ value: v.getDefaults(this.params.schema) }),
      };

    this.states.set(id, state);
    return state;
  }

  createWriteStream(_id: string) {
    return new WritableStream({
      write: (_chunk) => {
        // todo: ecrecover?
        //  - build mmr - get root hash
        // todo: Validate Schema
        // todo: Validate pubkey is in signing keyset
      },
    });
  }
  createReadStream() {
    return new ReadableStream(
      {
        start: (controller: ReadableStreamDefaultController) => {
          this.#streamsControllers.push(controller);
        },
      },
    );
  }

  async addConnection(client: RelayClient) {
    const id = client.relayEndpoint.tokenId;
    this.clients.add(client);
    const state = await this.open(id);
    // TODO: remove and implement dynamic subscriptions
    // we only need to subscribe when the event tree is subscribed to
    const remoteReadable = client.createSubscriptionStream("/", state.height);
    const ourWritable = this.createWriteStream(id);
    remoteReadable.pipeTo(ourWritable);

    // pipe our changes to the relay
    const remoteWritable = client.createWriteStream();
    const ourReadable = this.createReadStream();
    ourReadable.pipeTo(remoteWritable);
  }

  // TODO: rename LinkValue to NodeValue ?
  async set(path: Path, value: LinkValue, id = "local") {
    const p: string[] = jsonpointer.split(path);
    const schema = getSubSchema(this.params.schema, p);
    const state = this.states.get(id);
    assert(state);
    // validate against the schema
    v.parse(schema, value);
    const result = await this.graph.get(state.root, path);
    //ignore sets that do not change the value
    // TODO: rename node to value?
    if (result.node !== value) {
      state.root = this.graph.set(state.root, path, value);
      this.events.emit(path, value);
      // send patch to peers
      this.#streamsControllers.forEach((controller) =>
        // TODO: this needs to be a signed OP
        controller.enqueue({ path, value })
      );
    }
  }

  async get(path: Path, id = "local"): Promise<LinkValue> {
    const root = this.states.get(id)?.root;
    assert(root);
    const res = await this.graph.get(root, path);
    return res.node;
  }
}

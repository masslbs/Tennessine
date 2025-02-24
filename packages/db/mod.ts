import * as v from "@valibot/valibot";
import {
  Graph,
  Link,
  type LinkValue,
  type StoreInterface,
} from "@nullradix/merkle-dag-builder";
import jsonpointer from "npm:@sagold/json-pointer";
import { assert } from "jsr:@std/assert";
import EventTree from "@massmarket/eventTree";
import type { RelayClient } from "@massmarket/client";
import { getSubSchema } from "@massmarket/schema/utils";
import { type BaseObjectSchema, PatchSchema } from "@massmarket/schema/cbor";

export type Path = string | string[];

export interface IStateMetadata {
  root: Link;
  seqNum: number;
}

export default class DataBase<
  T extends v.GenericSchema<v.InferInput<typeof BaseObjectSchema>>,
> {
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
      | { seqNum: number; root: Uint8Array }
      | undefined;

    const state = storedState
      ? {
        seqNum: storedState.seqNum,
        root: new Link({ hash: storedState.root }),
      }
      : {
        seqNum: 0,
        root: new Link({ value: v.getDefaults(this.params.schema) }),
      };
    this.states.set(id, state);
    return state;
  }

  createWriteStream(id: string) {
    return new WritableStream<v.InferInput<typeof PatchSchema>>({
      write: async (patch) => {
        // validate the Operation's schema
        v.parse(PatchSchema, patch);
        const root = this.states.get(id)?.root;
        assert(root, "State not found");
        const validityRange = await this.graph.get(root, [
          "account",
          patch.account,
          patch.keycard,
        ]);
        // TODO: Validate keycard for a given time range
        if (!validityRange) {
          throw new Error("Invalid keycard");
        }
        for (const op of patch.ops) {
          const OpValschema = getSubSchema(this.params.schema, op.path);
          // validate the Operation's value if any
          v.parse(OpValschema, op);
          // apply the operation
          if (op.op === "add") {
            this.graph.set(root, op.path, op.value);
            // TODO
          } else {
            throw new Error("Unimplemented operation type");
          }
        }
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
    this.events.meta.once((_subArray) => {
      // TODO:  implement dynamic subscriptions
      // currently we subscribe to the root when any event is subscribed to
      const remoteReadable = client.createSubscriptionStream("/", state.seqNum);
      const ourWritable = this.createWriteStream(id);
      remoteReadable.pipeTo(ourWritable);
    });

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

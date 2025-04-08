import { assert, equal } from "@std/assert";

import { DAG, type RootValue } from "@massmarket/merkle-dag-builder";
import type { AbstractStore } from "@massmarket/store";
import EventTree from "@massmarket/eventTree";
import type { Patch, PushedPatchSet, RelayClient } from "@massmarket/client";
import { type codec, get, type Hash, set } from "@massmarket/utils";
import { BaseClass } from "@massmarket/schema/utils";
import { WritableStream } from "web-streams-polyfill";

type HashOrValue = Hash | codec.CodecValue;

interface IStoredState {
  // holds a map of subscription paths to sequence numbers
  // example: { "/accounts/": 1000, "/orders/": 12222  }
  // This should actually be a radix tree. Since if we subscribe to the root path that sequence number will overwrite the children paths,
  // so for example if a subscription to the root path is made the map will be
  // {"/": 1000}
  // where the sequence number is the lowest sequence number of all children paths
  // TODO: we are currently using a string, but need to use CodecKey[]
  subscriptionTrees: Map<string, Map<string, number>>;
  keycardNonce: number;
  root: RootValue;
}

export default class StateManager {
  readonly events = new EventTree<codec.CodecValue>(new Map());
  readonly graph: DAG;
  readonly clients: Set<RelayClient> = new Set();
  readonly id: bigint;
  #streamsWriters: Set<WritableStreamDefaultWriter<Patch[]>> = new Set();
  // very simple cache, we always want a reference to the same object
  #state?: IStoredState;
  #defaultState: RootValue;
  constructor(
    params: {
      store: AbstractStore;
      id: bigint;
      defaultState?: RootValue;
    },
  ) {
    this.id = params.id;
    this.graph = new DAG(params.store);
    this.#defaultState = params?.defaultState ?? new Map();
  }

  get root(): RootValue {
    assert(this.#state, "open not finished");
    return this.#state.root;
  }

  async open() {
    const storedState = await this.graph.store.objStore.get(this.id);
    const restored: IStoredState = storedState instanceof Map
      ? Object.fromEntries(storedState)
      : {
        subscriptionTrees: new Map(),
        keycardNonce: 0,
        root: this.#defaultState,
        // TODO: add class for shop at some point
        // root: v.getDefaults(this.params.schema) as CborValue,
      };
    this.#state = restored;
    this.events.emit(this.#state.root as HashOrValue);
  }

  async close() {
    const state = this.#state;
    this.#state = undefined;
    assert(state, "open not finished");
    const closingClients = [...this.clients].map((client) => {
      state.keycardNonce = client.keyCardNonce;
      return client.disconnect();
    });
    this.clients.clear();
    // wait for root to be resolved
    state.root = await state.root;
    return Promise.all([
      ...closingClients,
      this.graph.store.objStore.set(
        this.id,
        new Map(Object.entries(state)),
      ),
    ]);
  }

  createWriteStream(remoteId: string, subscriptionPath: codec.Path) {
    const state = this.#state;
    assert(state, "open not finished");
    const subscriptionTree = state.subscriptionTrees.get(remoteId) ?? new Map();
    return new WritableStream<PushedPatchSet>({
      write: async (patchSet) => {
        // validate the Operation's schema
        const _validityRange = await this.graph.get(state.root, [
          "Account",
          patchSet.signer,
        ]) as Map<string, string>;

        // TODO: Validate keycard for a given time range
        //   throw new Error("Invalid keycard");
        for (const patch of patchSet.patches) {
          let operation;
          // TODO validate the Operation's value if any
          // const OpValschema = getSubSchema(this.params.schema, patch.Path);
          // v.parse(OpValschema, value);
          //
          // apply the operation
          //
          // console.log("Applying patch:", patch);
          if (patch.Op === "add") {
            // const addKey = patch.Path[patch.Path.length - 1];
            // path = patch.Path.slice(0, -1);
            operation = (parent: codec.CodecValue, key: codec.CodecKey) => {
              assert(
                parent,
                `The Value at the path ${patch.Path.join("/")} does not exist`,
              );
              if (parent instanceof Array && typeof key === "number") {
                parent.splice(key, 0, patch.Value);
              } else {
                set(parent, key, patch.Value);
              }
            };
          } else if (patch.Op === "replace") {
            operation = patch.Value;
          } else if (patch.Op === "append") {
            operation = (parent: codec.CodecValue, step: codec.CodecKey) => {
              const value = get(parent, step);
              if (Array.isArray(value)) {
                value.push(patch.Value);
              } else {
                throw new Error(
                  `tying to append to non-array, path ${patch.Path.join("/")}`,
                );
              }
            };
          } else if (patch.Op === "remove") {
            // const deleteKey = patch.Path[patch.Path.length - 1];
            // path = patch.Path.slice(0, -1);
            operation = (
              parent: codec.CodecValue,
              deleteKey: codec.CodecKey,
            ) => {
              console.log("Deleting key from Map:", deleteKey, parent);
              if (parent instanceof Map) {
                const f = parent.entries().find(([k]) => equal(k, deleteKey));
                if (f) parent.delete(f[0]);
              } else if (
                parent instanceof Array && typeof deleteKey === "number"
              ) {
                parent.splice(deleteKey, 1);
              } else {
                throw new Error(
                  `Invalid current value ${parent} for path: ${patch.Path}`,
                );
              }
              return parent;
            };
          } else if (patch.Op === "increment") {
            operation = (_parent: codec.CodecValue, _step: codec.CodecKey) => {
            };
          } else if (patch.Op === "decrement") {
            operation = (_parent: codec.CodecValue, _step: codec.CodecKey) => {
            };
          } else {
            console.error({ patch });
            throw new Error(`Unimplemented operation type: ${patch.Op}`);
          }

          state.root = await this.graph.set(
            state.root,
            patch.Path,
            operation,
          );
        }

        subscriptionTree.set(
          subscriptionPath.toString(),
          patchSet.sequence,
        );
        const r = await state.root;
        this.events.emit(r);
        // TODO: check stateroot
        // TODO: we are saving the patches here
        // incase we want to replay the log, but we have no way to get them out
        // this.graph.store.objStore.append(
        //   [patchSet.signer, "patches"],
        //   patchSet.patches,
        // );
      },
    });
  }

  addConnection(client: RelayClient) {
    assert(this.#state, "open not finished");
    client.keyCardNonce = this.#state.keycardNonce;
    const id = client.relayEndpoint.tokenId;
    this.clients.add(client);
    // TODO:  implement dynamic subscriptions
    // currently we subscribe to the root when any event is subscribed to
    const remoteReadable = client.createSubscriptionStream(
      [],
      this.#state.subscriptionTrees.get(id)?.get("") ?? 0,
    );
    const ourWritable = this.createWriteStream(
      id,
      [],
    );
    const remoteWritable = client.createWriteStream();
    const writer = remoteWritable.getWriter();
    this.#streamsWriters.add(writer);
    const connection = remoteReadable.pipeTo(ourWritable);
    return { connection };
  }

  #sendPatch(patch: Patch) {
    // send patch to peers
    return Promise.all(
      this.#streamsWriters.keys().map((writer) => writer.write([patch]))
        .toArray(),
    );
  }

  // TODO: these need to be implemented in createWriteStream first
  // async increment(path: codec.Path, value: codec.CodecValue) {
  //   const state = this.#state;
  //   assert(state, "open not finished");
  //   await this.#sendPatch({ Op: "increment", Path: path, Value: value });
  //   state.root = await this.graph.set(state.root, path, value);
  //   this.events.emit(state.root);
  // }

  // async decrement(path: codec.Path, value: codec.CodecValue) {
  //   const state = this.#state;
  //   assert(state, "open not finished");
  //   await this.#sendPatch({ Op: "decrement", Path: path, Value: value });
  //   state.root = await this.graph.set(state.root, path, value);
  //   this.events.emit(state.root);
  // }

  async set(path: codec.Path, value: codec.CodecValue) {
    if (BaseClass.isBaseClass(value)) {
      value = value.asCBORMap() as codec.CodecValue;
    }
    const state = this.#state;
    assert(state, "open not finished");
    let sendpromise: Promise<void[]>;
    state.root = this.graph.set(state.root, path, (parent, p) => {
      const v = get(parent, p);
      set(parent, p, value);
      const op = v === undefined ? "add" : "replace";
      sendpromise = this.#sendPatch(
        { Op: op, Path: path, Value: value },
      );
    });
    const r = await state.root;
    this.events.emit(r);
    return sendpromise!;
  }

  get(
    path: codec.Path,
  ): Promise<codec.CodecValue | undefined> {
    // wait for any pending writes to complete
    const state = this.#state;
    assert(state, "open not finished");
    return this.graph.get(state.root, path);
  }
}

import { assert } from "@std/assert";

import { DAG, type RootValue } from "@massmarket/merkle-dag-builder";
import type { AbstractStore } from "@massmarket/store";
import EventTree from "@massmarket/eventTree";
import type { Patch, PushedPatchSet, RelayClient } from "@massmarket/client";
import { type codec, get, type Hash, set } from "@massmarket/utils";
import { BaseClass } from "@massmarket/schema/utils";

type HashOrValue = Hash | codec.CodecValue;

interface IStoredState {
  // holds a map of subscription paths to sequence numbers
  // example: { "/accounts/": 1000, "/orders/": 12222  }
  // This should actually be a radix tree. Since if we subscribe to the root path that sequence number will overwrite the children paths,
  // so for example if a subscription to the root path is made the map will be
  // {"/": 1000}
  // where the sequence number is the lowest sequence number of all children paths
  // TODO: we are currently using a string, but need to use CodecKey[]
  subscriptionSequenceNumber: number;
  keycardNonce: number;
  root: Promise<codec.CodecValue>;
}

export default class StateManager {
  readonly events = new EventTree<codec.CodecValue>(new Map());
  readonly graph: DAG;
  client?: RelayClient;
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
  }

  async close() {
    const state = this.#state;
    this.#state = undefined;
    assert(state, "open not finished");
    let clientClosing = Promise.resolve<unknown>(undefined);
    if (this.client) {
      state.keycardNonce = this.client.keyCardNonce;
      clientClosing = this.client.disconnect();
    }
    // wait for root to be resolved
    const realState = {
      ...state,
      root: await state.root,
    };
    return Promise.all([
      clientClosing,
      this.graph.store.objStore.set(
        this.id,
        new Map(Object.entries(realState)),
      ),
    ]);
  }

  createWriteStream() {
    const state = this.#state;
    assert(state, "open not finished");
    return new WritableStream<PushedPatchSet>({
      write: async (patchSet) => {
        // TODO: validate the Operation's schema
        // const _validityRange = await this.graph.get(state.root, [
        //   "Account",
        //   patchSet.signer,
        // ]) as Map<string, string>;

        // TODO: Validate keycard for a given time range
        //   throw new Error("Invalid keycard");
        for (const patch of patchSet.patches) {
          // TODO validate the Operation's value if any
          if (patch.Op === "add") {
            state.root = this.graph.add(
              state.root,
              patch.Path,
              patch.Value,
            );
          } else if (patch.Op === "replace") {
            state.root = this.graph.set(
              state.root,
              patch.Path,
              patch.Value,
            );
          } else if (patch.Op === "append") {
            state.root = this.graph.append(
              state.root,
              patch.Path,
              patch.Value,
            );
          } else if (patch.Op === "remove") {
            state.root = this.graph.remove(
              state.root,
              patch.Path,
            );
          } else if (patch.Op === "increment") {
            state.root = this.graph.addNumber(
              state.root,
              patch.Path,
              patch.Value,
            );
          } else if (patch.Op === "decrement") {
            state.root = this.graph.addNumber(
              state.root,
              patch.Path,
              -patch.Value,
            );
          } else {
            throw new Error(`Unimplemented operation type: ${patch.Op}`);
          }
        }

        state.subscriptionSequenceNumber = patchSet.sequence;
        // we want to wait to resolve the promise before emitting the new state
        const realState = await state.root;
        this.events.emit(realState);
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

  #addClientsWriteStream(client: RelayClient) {
    const remoteWritable = client.createWriteStream();
    const writer = remoteWritable.getWriter();
    writer.closed.catch((_error) => {
      // is this an error we can recover from?
      // if so do the following
      this.#streamsWriters.delete(writer);
      this.#addClientsWriteStream(client);
    });
    this.#streamsWriters.add(writer);
  }

  addConnection(client: RelayClient) {
    assert(this.#state, "open not finished");
    client.keyCardNonce = this.#state.keycardNonce;
    this.client = client;
    // TODO:  implement dynamic subscriptions
    // currently we subscribe to the root when any event is subscribed to
    const remoteReadable = client.createSubscriptionStream(
      this.#state.subscriptionSequenceNumber,
    );
    const ourWritable = this.createWriteStream();
    this.#addClientsWriteStream(client);
    const connection = remoteReadable.pipeTo(ourWritable);
    return { connection };
  }

  #sendPatch(patch: Patch) {
    // send patch to peers
    return Promise.all(
      [...this.#streamsWriters].map((writer) => writer.write([patch])),
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

  async set(path: codec.Path, value: codec.CodecValue | BaseClass) {
    if (BaseClass.isBaseClass(value)) {
      value = value.asCBORMap() as codec.CodecValue;
    }
    const state = this.#state;
    assert(state, "open not finished");
    const oldStateRoot = state.root;
    state.root = this.graph.set(state.root, path, async (parent, p) => {
      const v = get(parent, p);
      set(parent, p, value);
      const op = v === undefined ? "add" : "replace";
      await this.#sendPatch(
        { Op: op, Path: path, Value: value },
      );
    });
    try {
      // TODO (@nullradix 2025-04-28) If we revert the state
      // here, we would potentaily be reverting multiple operations
      // for example, not awaiting here
      // dag.set(path, bad-value)
      // dag.set(path, good-value)
      // would lead to the both sets failing
      // we could take care of this in the merkle-dag builder by catching
      // the error there (??)
      const r = await state.root;
      this.events.emit(r);
    } catch (e) {
      state.root = oldStateRoot;
      throw e;
    }
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

import { DAG } from "@massmarket/merkle-dag-builder";
import type { AbstractStore } from "@massmarket/store";
import EventTree from "@massmarket/eventTree";
import type { Patch, PushedPatchSet, RelayClient } from "@massmarket/client";
import type { codec, Hash } from "@massmarket/utils";

// move to schema
const DefaultObject = new Map(Object.entries({
  Tags: new Map(),
  Orders: new Map(),
  Accounts: new Map(),
  Inventory: new Map(),
  Listings: new Map(),
  Manifest: new Map(),
  SchemeVersion: 1,
}));

type HashOrValue = Hash | codec.CodecValue;

interface IStoredState {
  // holds a map of subscription paths to sequence numbers
  // example: { "/accounts/": 1000, "/orders/": 12222  }
  // This should actually be a radix tree. Since if we subscribe to the root path that sequence number will overwrite the children paths,
  // so for example if a subscription to the root path is made the map will be
  // {"/": 1000}
  // where the sequence number is the lowest sequence number of all children paths
  // TODO: we are currently using a string, but need to use CodecKey[]
  subscriptionTree: Map<string, number>;
  keycardNonce: number;
  root: HashOrValue | Promise<HashOrValue>;
}

export default class StateManager {
  readonly events = new EventTree<codec.CodecValue>(DefaultObject);
  readonly graph: DAG;
  readonly clients: Set<RelayClient> = new Set();
  #streamsControllers: Set<ReadableStreamDefaultController<Patch[]>> =
    new Set();
  // very simple cache, we always want a reference to the same object
  #stateCache?: IStoredState;
  constructor(
    public params: {
      store: AbstractStore;
      objectId: bigint;
    },
  ) {
    this.graph = new DAG(params.store);
  }

  async #open(): Promise<IStoredState> {
    if (this.#stateCache) return this.#stateCache;
    const storedState = await this.graph.store.objStore.get([
      this.params.objectId,
    ]);
    const restored = storedState instanceof Map
      ? Object.fromEntries(storedState)
      : {
        subscriptionTree: new Map(),
        keycardNonce: 0,
        root: new Map(DefaultObject),
        // TODO: add class for shop at some point
        // root: v.getDefaults(this.params.schema) as CborValue,
      };
    this.#stateCache = restored;
    return restored;
  }

  async #close() {
    const state = this.#stateCache;
    console.log("Closing state:", state);
    if (!state) throw new Error(`State closed before it was opened`);
    // wait for root to be resolved
    state.root = await state.root;
    return this.graph.store.objStore.set([
      this.params.objectId,
    ], new Map(Object.entries(state)));
  }

  createWriteStream(subscriptionPath: codec.Path) {
    // the remote state, ie the relay
    let state: IStoredState;
    // TODO: handle patch rejection
    return new WritableStream<PushedPatchSet>({
      start: async () => {
        state = await this.#open();
      },
      close: () => {
        return this.#close();
      },
      abort(reason) {
        console.error("WriteStream aborted:", reason);
      },
      write: async (patchSet) => {
        // validate the Operation's schema
        const _validityRange = await this.graph.get(state.root, [
          "account",
          patchSet.signer,
        ]) as Map<string, string>;

        // TODO: Validate keycard for a given time range
        // if (!validityRange.get("node")) {
        //   throw new Error("Invalid keycard");
        // }
        for (const patch of patchSet.patches) {
          // TODO validate the Operation's value if any
          // const OpValschema = getSubSchema(this.params.schema, patch.Path);
          // v.parse(OpValschema, value);
          //
          // apply the operation
          if (patch.Op === "add" || patch.Op === "replace") {
            const value = patch.Value;
            state.root = this.graph.set(
              state.root,
              patch.Path,
              value,
            );
          } else if (patch.Op === "append") {
            const value = await this.graph.get(state.root, patch.Path);
            if (Array.isArray(value)) {
              value.push(patch.Value);
            } else {
              throw new Error("Invalid path");
            }
            state.root = this.graph.set(
              state.root,
              patch.Path,
              value,
            );
          } else if (patch.Op === "remove") {
            const deleteKey = patch.Path[patch.Path.length - 1];
            const path = patch.Path.slice(0, -1);
            const value = await this.graph.get(
              state.root,
              path,
            );
            if (value instanceof Map) {
              value.delete(deleteKey);
            } else {
              console.error({ value, patch });
              throw new Error(
                `Invalid current value (type: ${typeof value}) for path: ${patch.Path}`,
              );
            }
            state.root = this.graph.set(
              state.root,
              patch.Path,
              value,
            );
          } else {
            console.error({ patch });
            throw new Error(`Unimplemented operation type: ${patch.Op}`);
          }
          state.subscriptionTree.set(
            subscriptionPath.toString(),
            patchSet.sequence,
          );
          const obj = await state.root;
          this.events.emit(obj!);
        }
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

  createReadStream(): ReadableStream<Patch[]> {
    return new ReadableStream<Patch[]>({
      start: (
        controller: ReadableStreamDefaultController,
      ) => {
        this.#streamsControllers.add(controller);
      },
    });
  }

  async addConnection(client: RelayClient) {
    this.clients.add(client);
    const remoteState = await this.#open();
    client.keyCardNonce = remoteState.keycardNonce;
    // TODO:  implement dynamic subscriptions
    // currently we subscribe to the root when any event is subscribed to
    const remoteReadable = client.createSubscriptionStream(
      "/",
      remoteState.subscriptionTree.get("/") ?? 0,
    );
    const ourWritable = this.createWriteStream([]);
    const remote = remoteReadable.pipeTo(ourWritable);

    // pipe our changes to the relay
    const remoteWritable = client.createWriteStream();
    const ourReadable = this.createReadStream();
    const ours = ourReadable.pipeTo(remoteWritable);
    return {
      remote,
      ours,
    };
  }

  #sendPatch(state: IStoredState, patch: Patch) {
    // send patch to peers
    this.#streamsControllers.forEach((controller) => {
      controller.enqueue([
        patch,
      ]);
    });
    return state;
  }

  async increment(path: codec.Path, value: codec.CodecValue) {
    const state = await this.#open();
    this.#sendPatch(state, { Op: "increment", Path: path });
    state.root = await this.graph.set(state.root, path, value);
    this.events.emit(state.root);
  }

  async decrement(path: codec.Path, value: codec.CodecValue) {
    const state = await this.#open();
    this.#sendPatch(state, { Op: "decrement", Path: path });
    state.root = await this.graph.set(state.root, path, value);
    this.events.emit(state.root);
  }

  async set(path: codec.Path, value: codec.CodecValue) {
    const state = await this.#open();
    let op;
    state.root = await this.graph.set(state.root, path, (oldValue) => {
      op = oldValue === undefined ? "add" : "replace";
      return value;
    });
    this.events.emit(state.root);
    return this.#sendPatch(
      state,
      { Op: op!, Path: path, Value: value },
    );
  }

  async get(
    path: codec.Path,
  ): Promise<codec.CodecValue | undefined> {
    // wait for any pending writes to complete
    const state = await this.#open();
    return this.graph.get(state.root, path);
  }
}

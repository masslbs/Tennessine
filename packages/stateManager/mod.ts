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
  seqNum: number;
  root: HashOrValue | Promise<HashOrValue>;
}

export default class StateManager {
  readonly events = new EventTree<codec.CodecValue>(DefaultObject);
  readonly graph: DAG;
  readonly clients: Set<RelayClient> = new Set();
  #streamsControllers: Set<ReadableStreamDefaultController<Patch[]>> =
    new Set();
  // very simple cache, we always want a reference to the same object
  #stateCache: Map<string, IStoredState> = new Map();
  constructor(
    public params: {
      store: AbstractStore;
      objectId: bigint;
    },
  ) {
    this.graph = new DAG(params.store);
  }

  async #open(view = "local"): Promise<IStoredState> {
    if (this.#stateCache.has(view)) return this.#stateCache.get(view)!;
    const storedState = await this.graph.store.objStore.get([
      this.params.objectId,
      view,
    ]);
    const restored = storedState instanceof Map
      ? Object.fromEntries(storedState)
      : {
        seqNum: 0,
        root: new Map(DefaultObject),
        // TODO: add class for shop at some point
        // root: v.getDefaults(this.params.schema) as CborValue,
      };
    this.#stateCache.set(view, restored);
    return restored;
  }

  async #close(view = "local") {
    const state = this.#stateCache.get(view);
    if (!state) throw new Error(`State not found for view ${view}`);
    // wait for root to be resolved
    state.root = await state.root;
    return this.graph.store.objStore.set([
      this.params.objectId,
      view,
    ], new Map(Object.entries(state)));
  }

  createWriteStream(id: string) {
    // the remote state, ie the relay
    let state: IStoredState;
    let localState: IStoredState;
    // TODO: handle patch rejection
    return new WritableStream<PushedPatchSet>({
      start: async () => {
        [localState, state] = await Promise.all([
          this.#open(),
          this.#open(id),
        ]);
      },
      close: async () => {
        await Promise.all([
          this.#close(),
          this.#close(id),
        ]);
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
            state.root = this.graph.set(state.root, patch.Path, value);
            localState.root = this.graph.set(
              localState.root,
              patch.Path,
              value,
            );
            // TODO
          } else if (patch.Op === "append") {
            const value = await this.graph.get(state.root, patch.Path);
            if (Array.isArray(value)) {
              value.push(patch.Value);
            } else {
              throw new Error("Invalid path");
            }
          } else if (patch.Op === "remove") {
            const current = await this.graph.get(state.root, patch.Path);
            const deleteKey = patch.Path[patch.Path.length - 1];
            if (current instanceof Map) {
              current.delete(deleteKey);
            } else {
              console.error({ current, patch });
              throw new Error(
                `Invalid current value (type: ${typeof current}) for path: ${patch.Path}`,
              );
            }
          } else {
            console.error({ patch });
            throw new Error(`Unimplemented operation type: ${patch.Op}`);
          }
          const obj = await localState.root;
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
    const id = client.relayEndpoint.tokenId;
    this.clients.add(client);
    const state = await this.#open(id);
    client.keyCardNonce = state.seqNum;
    // TODO:  implement dynamic subscriptions
    // currently we subscribe to the root when any event is subscribed to
    const remoteReadable = client.createSubscriptionStream("/", state.seqNum);
    const ourWritable = this.createWriteStream(id);
    const remote = remoteReadable.pipeTo(ourWritable).catch((error) => {
      console.error("Error piping remote stream:", error);
      return error;
    });

    // pipe our changes to the relay
    const remoteWritable = client.createWriteStream();
    const ourReadable = this.createReadStream();
    const ours = ourReadable.pipeTo(remoteWritable);
    return {
      remote,
      ours,
    };
  }

  async #sendPatch(patch: Patch) {
    const state = await this.#open();
    state.seqNum += 1;
    // send patch to peers
    this.#streamsControllers.forEach((controller) => {
      controller.enqueue([
        patch,
      ]);
    });
    return state;
  }

  async increment(path: codec.Path, value: codec.CodecValue) {
    const state = await this.#sendPatch({ Op: "increment", Path: path });
    state.root = await this.graph.set(state.root, path, value);
    this.events.emit(state.root);
  }

  async decrement(path: codec.Path, value: codec.CodecValue) {
    const state = await this.#sendPatch({ Op: "decrement", Path: path });
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

    await this.#sendPatch(
      { Op: op!, Path: path, Value: value },
    );
    this.events.emit(state.root);
  }

  async get(
    path: codec.Path,
    id = "local",
  ): Promise<codec.CodecValue | undefined> {
    // wait for any pending writes to complete
    const state = await this.#open(id);
    return this.graph.get(state.root, path);
  }
}

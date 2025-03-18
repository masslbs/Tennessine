import { DAG, type StoreInterface } from "@massmarket/merkle-dag-builder";
import EventTree from "@massmarket/eventTree";
import type { PushedPatchSet, RelayClient } from "@massmarket/client";
import type { codec, Hash } from "@massmarket/utils";

/*
replace: not optional
add: optional only
*/

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
  readonly events = new EventTree();
  readonly graph: DAG;
  readonly clients: Set<RelayClient> = new Set();
  #streamsControllers: Set<ReadableStreamDefaultController> = new Set();
  // very simple cache, we always want a reference to the same object
  #stateCache: Map<string, Promise<IStoredState>> = new Map();
  constructor(
    public params: {
      store: StoreInterface;
      objectId: bigint;
    },
  ) {
    this.graph = new DAG(params.store);
  }

  loadState(view = "local"): Promise<IStoredState> {
    const state = this.#stateCache.get(view);
    if (state) return state;
    else {
      const pStoredState = this.graph.store.objStore.get([
        this.params.objectId,
        view,
      ]).then((storedState) => {
        if (storedState instanceof Map) {
          return Object.fromEntries(storedState);
        } else {
          return {
            seqNum: 0,
            root: new Map(DefaultObject),
            // TODO: add class for shop at some point
            // root: v.getDefaults(this.params.schema) as CborValue,
          };
        }
      });
      this.#stateCache.set(view, pStoredState);
      return pStoredState;
    }
  }

  async getStateRoot(view = "local") {
    const state = await this.#stateCache.get(view);
    if (!state) throw new Error(`State not found for view ${view}`);
    return state.root;
  }

  async #saveState(view = "local") {
    const state = await this.#stateCache.get(view);
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
          this.loadState(),
          this.loadState(id),
        ]);
      },
      close: async () => {
        await Promise.all([
          this.#saveState(),
          this.#saveState(id),
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
          const value = patch.Value;
          // TODO validate the Operation's value if any
          // const OpValschema = getSubSchema(this.params.schema, patch.Path);
          // v.parse(OpValschema, value);
          //
          // apply the operation
          if (patch.Op === "add" || patch.Op === "replace") {
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
              value.push(value);
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
          this.events.emit(patch.Path, value);
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

  createReadStream(): ReadableStream {
    return new ReadableStream({
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
    const state = await this.loadState(id);
    client.keyCardNonce = state.seqNum;
    // TODO:  implement dynamic subscriptions
    // currently we subscribe to the root when any event is subscribed to
    const remoteReadable = client.createSubscriptionStream("/", state.seqNum);
    const ourWritable = this.createWriteStream(id);
    const remote = remoteReadable.pipeTo(ourWritable).catch((error) => {
      console.error("Error piping remote stream:", error);
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

  async set(path: codec.Path, value: codec.CodecValue, id = "local") {
    const state = await this.loadState(id);
    state.root = this.graph.set(state.root, path, value);
    state.seqNum += 1;
    state.root = await this.graph.merklelize(state.root);
    this.events.emit(path, value);
    // send patch to peers
    this.#streamsControllers.forEach((controller) => {
      controller.enqueue([
        { Op: "add", Path: path, Value: value },
      ]);
    });
    return this.#saveState();
  }

  async get(
    path: codec.Path,
    id = "local",
  ): Promise<codec.CodecValue | undefined> {
    // wait for any pending writes to complete
    const state = await this.loadState(id);
    return this.graph.get(state.root, path);
  }
}

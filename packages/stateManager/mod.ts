import * as v from "@valibot/valibot";
import {
  type CborValue,
  DAG,
  type Hash,
  type StoreInterface,
} from "@massmarket/merkle-dag-builder";
import EventTree from "@massmarket/eventTree";
import type { PushedPatchSet, RelayClient } from "@massmarket/client";
// import { getSubSchema, } from "@massmarket/schema/utils";
import { codec } from "@massmarket/utils";
import type { BaseObjectSchema, TPatch } from "@massmarket/schema/cbor";

interface IStoredState {
  seqNum: number;
  root: CborValue | Hash | Promise<CborValue | Hash>;
}

export default class StateManager<
  T extends v.GenericSchema<v.InferInput<typeof BaseObjectSchema>>,
> {
  readonly events = new EventTree();
  readonly graph: DAG;
  readonly clients: Set<RelayClient> = new Set();
  readonly mutations: Map<string, Promise<void>> = new Map();
  #streamsControllers: Set<ReadableStreamDefaultController<TPatch[]>> =
    new Set();
  constructor(
    public params: {
      schema: T;
      store: StoreInterface;
      objectId: bigint;
    },
  ) {
    this.graph = new DAG(params.store);
  }

  async loadState(view = "local"): Promise<IStoredState> {
    const storedState = await this.graph.store.objStore.get([
      this.params.objectId,
      view,
    ]);

    if (storedState instanceof Map) {
      return Object.fromEntries(storedState);
    } else {
      return {
        seqNum: 0,
        root: new Map(),
        // TODO: add class for shop at some point
        // root: v.getDefaults(this.params.schema) as CborValue,
      };
    }
  }

  async #saveState(state: IStoredState, view = "local") {
    // wait for root to be resolved
    state.root = await state.root;
    return this.graph.store.objStore.set([
      this.params.objectId,
      view,
    ], new Map(Object.entries(state)));
  }

  createWriteStream(id: string) {
    // TODO: handle patch rejection
    return new WritableStream<PushedPatchSet>({
      write: async (patchSet) => {
        // validate the Operation's schema
        const state = await this.loadState(id);
        const localState = await this.loadState("local");
        const validityRange = await this.graph.get(state.root, [
          "account",
          patchSet.signer,
        ]) as Map<string, string>;

        // TODO: Validate keycard for a given time range
        if (!validityRange.get("node")) {
          throw new Error("Invalid keycard");
        }
        for (const patch of patchSet.patches) {
          const OpValschema = getSubSchema(this.params.schema, patch.Path);
          // decode the value
          const value = patch.Value;
          // validate the Operation's value if any
          v.parse(OpValschema, value);
          // apply the operation
          if (patch.Op === "add") {
            state.root = this.graph.set(state.root, patch.Path, value);
            localState.root = this.graph.set(
              localState.root,
              patch.Path,
              value,
            );
            // TODO
          } else {
            throw new Error("Unimplemented operation type");
          }
        }
        // TODO: check stateroot
        // save the patch
        // TODO: seqentail reads are faster then random,
        this.graph.store.objStore.append(
          [patchSet.signer, "patches"],
          patchSet,
        );
      },
    });
  }

  createReadStream(): ReadableStream<TPatch[]> {
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
    // TODO:  implement dynamic subscriptions
    // currently we subscribe to the root when any event is subscribed to
    const remoteReadable = client.createSubscriptionStream("/", state.seqNum);
    const ourWritable = this.createWriteStream(id);
    remoteReadable.pipeTo(ourWritable);

    // pipe our changes to the relay
    const remoteWritable = client.createWriteStream();
    const ourReadable = this.createReadStream();
    ourReadable.pipeTo(remoteWritable);
  }

  // TODO: rename LinkValue to NodeValue ?
  async set(path: Path, value: CborType, id = "local") {
    const ongoingWriteOp = this.mutations.get(id);
    const { promise, resolve, reject } = Promise.withResolvers<void>();
    this.mutations.set(id, promise);
    if (ongoingWriteOp) {
      // wait for any pending writes to complete
      await ongoingWriteOp;
    }
    const state = await this.loadState(id);
    const result = await this.graph.get(state.root, path);
    //ignore sets that do not change the value
    // TODO: rename node to value?
    if (result !== value) {
      state.root = this.graph.set(state.root, path, value);
      state.seqNum += 1;
      const root = await this.graph.merklelize(state.root);
      // TODO: all the setMetaData ops should be collected
      const metaPromise = this.#saveState({
        seqNum: state.seqNum,
        root,
      });
      this.events.emit(path, value);
      // send patch to peers
      this.#streamsControllers.forEach((controller) => {
        controller.enqueue([
          { Path: path, Value: codec.encode(value), Op: "add" },
        ]);
      });
      return metaPromise.then(resolve).catch(reject);
    }
  }

  async get(path: Path, id = "local"): Promise<LinkValue> {
    // wait for any pending writes to complete
    await this.mutations.get(id);
    const state = await this.loadState(id);
    console.log(`stateManager.get(${path})`);
    console.log(`state:`, state);
    const res = await this.graph.get(state.root, path);
    return res;
  }
}

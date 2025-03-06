import { type CborType, decodeCbor, encodeCbor } from "@std/cbor";
import * as v from "@valibot/valibot";
import jsonpointer from "@sagold/json-pointer";
import {
  Graph,
  Link,
  type LinkValue,
  type StoreInterface,
} from "@massmarket/merkle-dag-builder";
import EventTree from "@massmarket/eventTree";
import type { RelayClient } from "@massmarket/client";
import { getSubSchema } from "@massmarket/schema/utils";
import type {
  BaseObjectSchema,
  TPatchSet,
  TRecoveredPatchSet,
} from "@massmarket/schema/cbor";

export type Path = string | string[];
export type IStoredState = { seqNum: number; root: Uint8Array };

export default class DataBase<
  T extends v.GenericSchema<v.InferInput<typeof BaseObjectSchema>>,
> {
  readonly events = new EventTree();
  readonly graph: Graph;
  readonly clients: Set<RelayClient> = new Set();
  mutations: Map<string, Promise<void>> = new Map();
  #streamsControllers: ReadableStreamDefaultController<TPatchSet>[] = [];
  constructor(
    public params: {
      schema: T;
      store: StoreInterface;
      objectId: bigint;
    },
  ) {
    this.graph = new Graph(params);
  }

  async loadState(view = "local") {
    const storedState = await this.graph.getMetaData([
      this.params.objectId,
      view,
    ]) as
      | IStoredState
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
    return state;
  }

  #saveState(state: IStoredState, view = "local") {
    return this.graph.setMetaData([
      this.params.objectId,
      view,
    ], state);
  }

  createWriteStream(id: string) {
    // TODO: handle patch rejection
    return new WritableStream<TRecoveredPatchSet>({
      write: async (patchSet) => {
        // validate the Operation's schema
        const state = await this.loadState(id);
        const localState = await this.loadState("local");
        const validityRange = await this.graph.get(state.root, [
          "account",
          patchSet.Signer.toString(),
        ]);
        // TODO: Validate keycard for a given time range
        if (!validityRange) {
          throw new Error("Invalid keycard");
        }
        for (const patch of patchSet.Patches) {
          const OpValschema = getSubSchema(this.params.schema, patch.Path);
          // decode the value
          const value = decodeCbor(patch.Value);
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
        this.graph.setMetaData(
          [patchSet.Signer, patchSet.Header.KeyCardNonce],
          patchSet,
        );
      },
    });
  }

  createReadStream() {
    return new ReadableStream<
      TPatchSet
    >({
      start: (
        controller: ReadableStreamDefaultController<
          TPatchSet
        >,
      ) => {
        this.#streamsControllers.push(controller);
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
    const p: string[] = jsonpointer.split(path);
    // TODO: it would be nice to get the type instead of just generic
    const schema = getSubSchema(this.params.schema, p);
    // validate against the schema
    v.parse(schema, value);

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
    if (result.node !== value) {
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
        controller.enqueue({
          Header: {
            ShopID: this.params.objectId,
            KeyCardNonce: 0,
            Timestamp: new Date(),
            RootHash: root,
          },
          Patches: [{ Path: p, Value: encodeCbor(value), Op: "add" }],
        });
      });
      return metaPromise.then(resolve).catch(reject);
    }
  }

  async get(path: Path, id = "local"): Promise<LinkValue> {
    // wait for any pending writes to complete
    await this.mutations.get(id);
    const state = await this.loadState(id);
    const res = await this.graph.get(state.root, path);
    return res.node;
  }
}

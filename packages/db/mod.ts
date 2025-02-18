import * as v from "jsr:@valibot/valibot";
import type { Blockstore } from "npm:interface-blockstore";
import EventTree from "@massmarket/eventTree";
import {
  Graph,
  type Link,
  type SubObjects,
} from "jsr:@nullradix/ipld-cbor-graph-builder@3.0.0";
import jsonpointer from "npm:@sagold/json-pointer";

import { getSubSchema } from "./validation.ts";

export type Path = string | string[];
export interface Op<T> {
  op: "set" | "delete";
  path: string | string[];
  value: SubObjects<T>;
}
export type Patch<T> = { path: Path; value: T }[];

export default class DataBase<T extends v.GenericSchema, VT = v.InferInput<T>> {
  readonly events = new EventTree();
  readonly states: Map<string, Graph>;
  readonly #streamsControllers = new Map<
    string,
    ReadableStreamDefaultController
  >();

  readonly schema!: T;
  readonly blockstore!: Blockstore;
  readonly signingKey!: string;
  readonly getKeySet!: (key: string) => boolean;
  readonly root!: Link<VT>;
  // readonly signingKey: string,
  // readonly getKeySet: (key: string) => string,
  // storage could be updated with the patches, for
  // but reading can needs to be a k/v lookup
  constructor(params: {
    schema: T;
    blockstore: Blockstore;
    signingKey: string;
    /* A callback function to check if the a key is in the set */
    getKeySet: (key: string) => boolean;
    root: Link<VT>;
  }) {
    Object.assign(this, params);
    this.states = new Map([
      [
        "local",
        new Graph({ blockstore: params.blockstore }),
      ],
    ]);
  }

  applyOp(op: Op<VT>, id = "local") {
    return this.states.get(id)?.set(this.root, op.path, op.value);
  }

  async set(path: Path, value: SubObjects<VT>) {
    const p: string[] = jsonpointer.split(path);
    const schema = getSubSchema(this.schema, p);
    // validate against the schema
    v.parse(schema, value);
    // to do, reuse the encoded value in sendPatch
    const r = await this.applyOp({ op: "set", path: p, value });
    // ignore sets that do not change the value
    if (r.value !== value) {
      this.events.emit(path, value);
      // send patch to peers
      for (const [controller, rid] in this.#streamsControllers) {
        controller.enqueue(patch);
      }
    }
  }

  get(path: Path): VT {
    return this.states.get("local")!.get(path);
  }

  verifyPatch(patch: Patch<VT>) {
    return true;
  }

  #verifySignature(signature: string) {
    // get the keys that are valid from the tree,
  }

  batch(patch: Patch<VT>) {
    // validate the patch
    // apply the patch
    // emit the event
  }

  async applyRemotePatch(patch: Patch<VT>, id = "remote") {
    this.verifyPatchScheme(patch);
    await this.verifyPatchSignature(patch);
    for (const op of patch) {
      const schema = this.getSchema(op.path);
      const result = await this.#applyOpRemote(op, id);
      schema.verify(result);
    }
    const root = this.merklize(id);
    assertEqual(root, patch.root, "Root hash should match");
    // apply the patch to the local state
    for (const op of patch) {
      await this.#applyOp(op, "local");
      this.events.emit({ path, value });
    }

    // broadcast patch to all other peers via streams
    // skipping the stream that sent the patch
    for (const [controller, rid] in this.streamsControllers) {
      if (rid !== id) {
        controller.enqueue(patch);
      }
    }
  }

  createBidirectionalStream(id: string) {
    assertEqual(this.state.has(id), false);
    this.states.set(id, new Graph());
    const self = this;
    return {
      // ingress
      writeable: new WritableStream({
        write(patch: Patch<VT>) {
          return self.applyPatch(patch);
        },
      }),
      // egress
      readable: new ReadableStream({
        async start(controller) {
          // for await (const value of this.storage.query()) {
          //   controller.enqueue(value);
          // }
          // controller.close();
        },
      }),
    };
  }
}

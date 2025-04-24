import { assert } from "@std/assert";
import {
  type codec,
  get,
  type Hash,
  isHash,
  remove,
  set,
} from "@massmarket/utils";
import {
  type AbstractStore,
  ContentAddressableStore,
  type ObjectStore,
} from "@massmarket/store";
import {
  getOrExtend,
  getTimestamp,
  type TimestampTree,
} from "./timestampTree.ts";

class ContentAddressableStoreWithTimeStamp {
  objStore: ObjectStore;
  constructor(public castore: ContentAddressableStore) {
    this.objStore = castore.objStore;
  }

  get(hash: Hash): Promise<NodeValue> {
    return Promise.all([
      this.castore.get(hash),
      this.castore.objStore.get([hash, "timestamps"]),
    ]) as Promise<NodeValue>;
  }

  async set(node: NodeValue): Promise<Hash> {
    const hash = await this.castore.set(node[0]);
    await this.castore.objStore.set([hash, "timestamps"], node[1]);
    return hash;
  }
}

export type NodeValue = [
  value: codec.CodecValue,
  timestamps: TimestampTree,
];

export type RootValue =
  | NodeValue
  | Hash
  | Promise<NodeValue | Hash>;

export class DAG<TimeStampT extends codec.CodecValue> {
  createNewRoot(
    value: codec.CodecValue = new Map(),
    timestamp: TimeStampT = this.defaultTimeStamp(),
  ): RootValue {
    const timeStampTree: TimestampTree = [new Map(), timestamp];
    return [value, timeStampTree];
  }
  /** the store that the graph is stored in */
  public store: ContentAddressableStoreWithTimeStamp;

  /**
   * Creates a new graph
   */
  constructor(
    store: AbstractStore,
    public timeStampComparator: (old: TimeStampT, n: TimeStampT) => boolean = (
      old,
      n,
    ) => old! <= n!,
    public defaultTimeStamp: () => TimeStampT = () => 0 as TimeStampT,
  ) {
    this.store = new ContentAddressableStoreWithTimeStamp(
      new ContentAddressableStore(store),
    );
  }

  // this loads a hash from the store
  async #loadHash(
    hash: Hash,
  ): Promise<NodeValue> {
    const node = await this.store.get(hash);
    if (!node[0]) {
      throw new Error(`Hash not found: ${hash}`);
    }
    return node;
  }

  /**
   * An async generator that walks a given path
   */
  async *walk(
    root: RootValue,
    path: codec.Path,
    clone = false,
  ): AsyncGenerator<{
    root: NodeValue;
    value: codec.CodecValue;
    timestampTree: TimestampTree;
    step?: codec.CodecValue;
  }> {
    if (root instanceof Promise) {
      root = await root;
    } else if (isHash(root)) {
      root = (await this.#loadHash(root))!;
    }
    if (clone) {
      root = structuredClone(root);
    }
    // we know that the root is a nodvalue now
    root = root as NodeValue;
    let timestampTree = root[1];
    let rootNode = root[0];
    yield {
      root,
      value: rootNode,
      timestampTree: timestampTree,
    };
    for (const step of path) {
      const nextNodeValue = get(rootNode, step);
      timestampTree = getOrExtend(timestampTree, step, clone);

      if (nextNodeValue !== undefined) {
        // load hash links
        if (isHash(nextNodeValue)) {
          // replace the hash with the value it loaded
          root = await this.#loadHash(nextNodeValue);
          if (root) {
            root = structuredClone(root);
          }
          timestampTree = root[1];
          set(rootNode, step, root[0]);
        }
        rootNode = nextNodeValue;
        yield {
          root,
          value: nextNodeValue,
          timestampTree: timestampTree,
        };
      } else {
        return;
      }
    }
  }

  /**
   * traverses an object's path and returns the resulting value, if any, in a Promise
   */
  async get(
    root: RootValue,
    path: codec.Path,
  ): Promise<codec.CodecValue | undefined> {
    const walk = await Array.fromAsync(
      this.walk(root, path),
    );

    if (walk.length === path.length + 1) {
      return walk.pop()!.value;
    }
  }

  /**
   * sets a value on a root object given its path
   */
  async set(
    root: RootValue,
    path: codec.Path,
    value:
      | codec.CodecValue
      | ((
        parent: codec.CodecValue,
        key: codec.CodecKey,
      ) => Promise<void> | void),
    timestamp: TimeStampT = this.defaultTimeStamp(),
  ): Promise<NodeValue | Hash> {
    assert(path.length);
    if (timestamp === undefined) {
      if (this.defaultTimeStamp) {
        timestamp = this.defaultTimeStamp();
      } else {
        throw new Error(
          "either the timestamp, or the defaultTimeStamp should be set",
        );
      }
    }
    const last = path[path.length - 1];
    path = path.slice(0, -1);
    const walk = await Array.fromAsync(
      this.walk(root, path, true),
    );

    if (walk.length === path.length + 1) {
      const { value: parent, timestampTree } = walk[walk.length - 1];
      if (
        this.timeStampComparator(
          getTimestamp(timestampTree) as TimeStampT,
          timestamp,
        )
      ) {
        if (typeof value === "function") {
          await value(parent, last);
        } else {
          set(parent, last, value);
        }
        return walk[0].root;
      } else {
        return root;
      }
    } else {
      throw new Error(`Path ${path.join(".")} does not exist`);
    }
  }

  /**
   * adds a value to a root object given its path. if the parent value is an array the added value will be sliced into the array
   */
  add(
    root: RootValue,
    path: codec.Path,
    value: codec.CodecValue,
    timestamp: TimeStampT = this.defaultTimeStamp(),
  ): Promise<NodeValue | Hash> {
    return this.set(
      root,
      path,
      (parent: codec.CodecValue, key: codec.CodecKey) => {
        assert(
          parent,
          `The Value at the path ${path.join("/")} does not exist`,
        );
        if (parent instanceof Array && typeof key === "number") {
          parent.splice(key, 0, value);
        } else {
          set(parent, key, value);
        }
      },
      timestamp,
    );
  }

  /**
   * appends a value to an array. If the value at the given path is not an array, it will throw an error
   */
  append(
    root: RootValue,
    path: codec.Path,
    value: codec.CodecValue,
    timestamp: TimeStampT = this.defaultTimeStamp(),
  ): Promise<NodeValue | Hash> {
    return this.set(
      root,
      path,
      (parent: codec.CodecValue, step: codec.CodecKey) => {
        const arr = get(parent, step);
        if (Array.isArray(arr)) {
          arr.push(value);
        } else {
          throw new Error(
            `tying to append to non-array, path ${path.join("/")}`,
          );
        }
      },
      timestamp,
    );
  }

  /**
   * removes a value. If the parent is an array, it will remove the value at the given index. If the parent is an object, it will delete the key.
   */
  remove(
    root: RootValue,
    path: codec.Path,
    timestamp: TimeStampT = this.defaultTimeStamp(),
  ): Promise<NodeValue | Hash> {
    return this.set(
      root,
      path,
      (parent: codec.CodecValue, step: codec.CodecKey) => {
        remove(parent, step);
      },
      timestamp,
    );
  }

  /**
   * adds a number to a value at the given path. If the value at the path is not a number, it will throw an error.
   */
  addNumber(
    root: RootValue,
    path: codec.Path,
    amount: number,
    timestamp: TimeStampT = this.defaultTimeStamp(),
  ): Promise<NodeValue | Hash> {
    return this.set(
      root,
      path,
      (parent: codec.CodecValue, step: codec.CodecKey) => {
        const currentValue = get(parent, step);
        if (typeof currentValue === "number") {
          set(parent, step, currentValue + amount);
        } else {
          throw new Error(
            `tying to add number to non-number, path ${path.join("/")}`,
          );
        }
      },
      timestamp,
    );
  }

  /**
   * flush an object to the store and create a merkle root
   */
  async merklelize(
    root: RootValue,
  ): Promise<Hash> {
    if (root instanceof Promise) {
      root = await root;
    } else if (isHash(root)) {
      return root;
    }
    return this.store.set(root as NodeValue);
  }
}

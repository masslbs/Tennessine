import { assert } from "@std/assert";
import { type codec, get, type Hash, isHash, set } from "@massmarket/utils";
import { type AbstractStore, ContentAddressableStore } from "@massmarket/store";

export type RootValue =
  | codec.CodecValue
  | Promise<codec.CodecValue>;

export class DAG {
  /** the store that the graph is stored in */
  public store: ContentAddressableStore;

  /**
   * Creates a new graph
   */
  constructor(store: AbstractStore) {
    this.store = new ContentAddressableStore(store);
  }

  // this loads a hash from the store
  async #loadHash(
    hash: Hash,
    clone = false,
  ): Promise<codec.CodecValue> {
    const val = await this.store.get(hash);
    if (!val) {
      throw new Error(`Hash not found: ${hash}`);
    }
    if (clone) {
      // we assume the store shares objects as a caching mechanism
      // (TODO: it doesn't yet though)
      // so we need to clone the object to avoid modifying the original
      return structuredClone(val);
    } else {
      return val;
    }
  }

  /**
   * An async generator that walks a given path
   */
  async *walk(
    root: RootValue,
    path: codec.CodecKey[],
    clone = false,
  ): AsyncGenerator<{
    value: codec.CodecValue;
    step?: codec.CodecValue;
  }> {
    if (root instanceof Promise) {
      root = await root;
    }
    if (isHash(root)) {
      root = (await this.#loadHash(root, clone))!;
    }
    if (clone) {
      root = structuredClone(root);
    }
    yield {
      value: root,
    };
    for (const step of path) {
      let value = get(root, step) as codec.CodecValue;
      if (value !== undefined) {
        // load hash links
        if (isHash(value)) {
          // replace the hash with the value it loaded
          value = await this.#loadHash(value, clone);
          set(root, step, { "/": value });
        }
        root = value;
        yield {
          value,
          step,
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
    path: codec.CodecKey[],
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
    path: codec.CodecKey[],
    value:
      | codec.CodecValue
      | ((
        parent: codec.CodecValue,
        key: codec.CodecKey,
      ) => Promise<void> | void),
  ): Promise<codec.CodecValue> {
    assert(path.length);
    const last = path[path.length - 1];
    path = path.slice(0, -1);
    const walk = await Array.fromAsync(
      this.walk(root, path, true),
    );

    if (walk.length === path.length + 1) {
      const parent = walk[walk.length - 1].value;
      if (typeof value === "function") {
        await value(parent, last);
      } else {
        set(parent, last, value);
      }
    } else {
      throw new Error(`Path ${path.join(".")} does not exist`);
    }
    return walk[0].value;
  }

  /**
   * flush an object to the store and create a merkle root
   */
  async merklelize(
    root: RootValue,
  ): Promise<Hash> {
    if (root instanceof Promise) {
      root = await root;
    }
    return this.store.set(root);
  }
}

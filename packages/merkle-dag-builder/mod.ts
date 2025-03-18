import { assert } from "@std/assert/assert";
import { codec, get, type Hash, hash, isHash, set } from "@massmarket/utils";

/** The interface for a store that is used to store and retrieve blocks */
export interface StoreInterface {
  get(key: Uint8Array): Promise<Uint8Array | undefined>;
  set(key: Uint8Array, value: Uint8Array): Promise<void>;
  append(key: Uint8Array, value: Uint8Array): Promise<void>;
}

// store's objects, as long as they can be encoded as CBOR
export class ObjectStore {
  store: StoreInterface;
  constructor(store: StoreInterface) {
    this.store = store;
  }

  async get(
    key: codec.CodecValue,
  ): Promise<codec.CodecValue | undefined> {
    if (!(key instanceof Uint8Array)) {
      key = codec.encode(key);
    }
    const val = await this.store.get(key as Uint8Array);
    return val ? codec.decode(val) : undefined;
  }

  async set(key: codec.CodecValue, value: codec.CodecValue): Promise<void> {
    if (!(key instanceof Uint8Array)) {
      key = codec.encode(key);
    }
    const ev = codec.encode(value);
    await this.store.set(key as Uint8Array, ev);
  }

  append(key: codec.CodecValue, value: codec.CodecValue): Promise<void> {
    if (!(key instanceof Uint8Array)) {
      key = codec.encode(key);
    }

    const ev = codec.encode(value);
    return this.store.append(key as Uint8Array, ev);
  }
}

export class ContentAddressableStore {
  objStore: ObjectStore;
  constructor(store: StoreInterface) {
    this.objStore = new ObjectStore(store);
  }

  get(key: Hash): Promise<codec.CodecValue | undefined> {
    return this.objStore.get(key);
  }

  async set(value: codec.CodecValue): Promise<Hash> {
    if (isHash(value)) {
      return value;
    } else {
      const ev = codec.encode(value);
      const keyb = await hash(ev);
      const key = new Uint8Array(keyb);
      await this.objStore.store.set(key, ev);
      return key;
    }
  }
}

export type RootValue =
  | codec.CodecValue
  | Hash
  | Promise<codec.CodecValue | Hash>;

export class DAG {
  /** the store that the graph is stored in */
  public store: ContentAddressableStore;

  /**
   * Creates a new graph
   */
  constructor(store: StoreInterface) {
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
    modify = false,
  ): AsyncGenerator<{
    value: codec.CodecValue;
    step?: codec.CodecValue;
  }> {
    if (root instanceof Promise) {
      root = await root;
    }
    if (isHash(root)) {
      root = (await this.#loadHash(root, modify))!;
    }
    yield {
      value: root,
    };
    for (const step of path) {
      const value = get(root, step);
      if (value !== undefined) {
        root = value;
        // load hash links
        if (isHash(root)) {
          root = await this.#loadHash(root, modify);
        }
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
    value: codec.CodecValue,
  ): Promise<codec.CodecValue> {
    assert(path.length);
    const last = path[path.length - 1];
    path = path.slice(0, -1);
    const walk = await Array.fromAsync(
      this.walk(root, path, true),
    );

    if (walk.length === path.length + 1) {
      const parent = walk[walk.length - 1].value;
      set(parent, last, value);
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

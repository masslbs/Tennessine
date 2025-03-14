import { any, decode, encode } from "@whiteand/cbor";
import { assert } from "@std/assert/assert";

/** The interface for a store that is used to store and retrieve blocks */
export interface StoreInterface {
  get(key: Uint8Array): Promise<Uint8Array | undefined>;
  set(key: Uint8Array, value: Uint8Array): Promise<void>;
}

// Types that can be used as keys to a map
export type CborKey =
  | number
  | bigint
  | string
  | boolean
  | ArrayLike<8>;

// Types that can be encoded / decoded as CBOR values
export type CborValue =
  | CborKey
  | ArrayLike<CborValue>
  | Map<CborValue, CborValue>;

export const codec = {
  encode(val: CborValue) {
    return encode((e) => any.encode(val, e));
  },
  decode(data: Uint8Array): CborValue {
    return decode(data, (d: Uint8Array) => any.decode(d), undefined).unwrap();
  },
};

export type Hash = Uint8Array;

export async function hash(data: BufferSource): Promise<Hash> {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", data));
}

// TODO: we need a some way to denote whether the value is a hash
export function isHash(node: CborValue): node is Hash {
  return node instanceof Uint8Array && node.length === 32;
}

function get(obj: CborValue, key: CborKey): CborValue | undefined {
  if (obj instanceof Map) {
    return obj.get(key);
  } else if (
    typeof obj === "object" && obj !== null &&
    (typeof key === "number" ||
      typeof key === "string" ||
      typeof key === "symbol")
  ) {
    return Reflect.get(obj, key);
  } else {
    throw new Error(`Cannot get key ${key} from ${obj}`);
  }
}

function set(obj: CborValue, key: CborKey, value: CborValue): void {
  if (obj instanceof Map) {
    obj.set(key, value);
  } else if (
    typeof obj === "object" && obj !== null &&
    (typeof key === "number" ||
      typeof key === "string" ||
      typeof key === "symbol")
  ) {
    Reflect.set(obj, key, value);
  } else {
    throw new Error(`Cannot set key ${key} on ${obj}`);
  }
}

// store's objects, as long as they can be encoded as CBOR
export class ObjectStore {
  store: StoreInterface;
  constructor(store: StoreInterface) {
    this.store = store;
  }

  async get(
    key: CborValue,
  ): Promise<CborValue | undefined> {
    if (!(key instanceof Uint8Array)) {
      key = codec.encode(key);
    }
    const val = await this.store.get(key as Uint8Array);
    return val ? codec.decode(val) : undefined;
  }

  async set(key: CborValue, value: CborValue): Promise<void> {
    if (!(key instanceof Uint8Array)) {
      key = codec.encode(key);
    }
    const ev = codec.encode(value);
    await this.store.set(key as Uint8Array, ev);
  }
}

export class ContentAddressableStore {
  objStore: ObjectStore;
  constructor(store: StoreInterface) {
    this.objStore = new ObjectStore(store);
  }

  get(key: Hash): Promise<CborValue | undefined> {
    return this.objStore.get(key);
  }

  async set(value: CborValue): Promise<Hash> {
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

export type RootValue = CborValue | Hash | Promise<CborValue | Hash>;

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
  ): Promise<CborValue> {
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
    path: CborKey[],
    modify = false,
  ): AsyncGenerator<{
    value: CborValue;
    step?: CborKey;
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
    path: CborKey[],
  ): Promise<CborValue | undefined> {
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
    path: CborKey[],
    value: CborValue,
  ): Promise<CborValue> {
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
      throw new Error("Path does not exist");
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

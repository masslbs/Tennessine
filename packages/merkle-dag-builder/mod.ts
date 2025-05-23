import { assert } from "@std/assert";
import { getLogger } from "@logtape/logtape";
import {
  type codec,
  get,
  type Hash,
  isHash,
  remove,
  set,
} from "@massmarket/utils";
import { type AbstractStore, ContentAddressableStore } from "@massmarket/store";

const logger = getLogger(["mass-market", "merkle-dag-builder"]);

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
      logger.info`Hash not found: ${hash}`;
      throw new Error(`Hash not found`);
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
      logger.info`Path ${path.join(".")} does not exist`;
      throw new Error(`Path does not exist`);
    }
    return walk[0].value;
  }

  /**
   * adds a value to a root object given its path. if the parent value is an array the added value will be sliced into the array
   */
  add(
    root: RootValue,
    path: codec.CodecKey[],
    value: codec.CodecValue,
  ): Promise<codec.CodecValue> {
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
    );
  }

  /**
   * appends a value to an array. If the value at the given path is not an array, it will throw an error
   */
  append(
    root: RootValue,
    path: codec.CodecKey[],
    value: codec.CodecValue,
  ): Promise<codec.CodecValue> {
    return this.set(
      root,
      path,
      (parent: codec.CodecValue, step: codec.CodecKey) => {
        const arr = get(parent, step);
        if (Array.isArray(arr)) {
          arr.push(value);
        } else {
          logger.info`Trying to append to non-array, path ${path.join("/")}`;
          throw new Error(`Trying to append to non-array`);
        }
      },
    );
  }

  /**
   * removes a value. If the parent is an array, it will remove the value at the given index. If the parent is an object, it will delete the key.
   */
  remove(
    root: RootValue,
    path: codec.CodecKey[],
  ): Promise<codec.CodecValue> {
    return this.set(
      root,
      path,
      (parent: codec.CodecValue, step: codec.CodecKey) => {
        remove(parent, step);
      },
    );
  }

  /**
   * adds a number to a value at the given path. If the value at the path is not a number, it will throw an error.
   */
  addNumber(
    root: RootValue,
    path: codec.CodecKey[],
    amount: number,
  ): Promise<codec.CodecValue> {
    return this.set(
      root,
      path,
      (parent: codec.CodecValue, step: codec.CodecKey) => {
        const currentValue = get(parent, step);
        if (typeof currentValue === "number") {
          set(parent, step, currentValue + amount);
        } else {
          logger.info`Trying to add number to non-number, path ${
            path.join("/")
          }`;
          throw new Error(`Trying to add number to non-number`);
        }
      },
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
    }
    return this.store.set(root);
  }
}

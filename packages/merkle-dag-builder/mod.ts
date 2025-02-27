import jsonpointer from "@sagold/json-pointer";
import shallowClone from "shallow-clone";
import { assert } from "@std/assert";
import {
  type CborPrimitiveType,
  type CborTag,
  type CborType,
  decodeCbor,
  encodeCbor,
} from "@std/cbor";
import LockMap from "@nullradix/lockmap";
import { blake3 } from "@noble/hashes/blake3";

/** The interface for a store that is used to store and retrieve blocks */
export interface StoreInterface {
  get(key: Uint8Array): Promise<Uint8Array | undefined>;
  set(key: Uint8Array, value: Uint8Array): Promise<void>;
}

export type LinkValue =
  | Link
  | CborPrimitiveType
  | CborTag<CborType>
  | Map<CborType, LinkValue>
  | LinkValue[]
  | {
    [k: string]: LinkValue;
  };

// narrowing functions
function isObject<T>(obj: T): obj is T & Record<string, T> {
  return obj === Object(obj);
}
// TODO: we need a some way to denote whether the value is a hash
function isHash(node: LinkValue): node is Uint8Array {
  return node instanceof Uint8Array && node.length === 32;
}

/**
 * A class that represents a merkle link in a merkle tree / DAG
 */
export class Link {
  /** if the value in the link and been modified */
  public modified: boolean;
  public hash?: Uint8Array;
  /** the value stored in the link */
  public value?: LinkValue;
  /** on going mutation operations effecting the value of the link */
  public mutation: Promise<void> | false = false;
  /**
   *  A promise that resolve when all the pending write operating started from this Link has finished.
   * The difference between this and `mutation` is that this is a promise that resolves when all the
   *  pending write operations have finished and mutation is a promise that resolves when the current mutation on this Link has finished.
   */
  public pendingWriteOperation: Promise<void> = Promise.resolve();
  /**
   * If no hash is provided the link is considered modified and when merklelized is called
   * the value will be encoded and hashed to create a new hash. If a hash is provided the value
   * and a value, it will be assumed that the value corresponds to the hash
   */
  constructor(params: {
    hash?: Uint8Array;
    value?: LinkValue;
  }) {
    assert(params.hash || params.value, "must provide a cid or value");
    Object.assign(this, params);
    this.modified = !this.hash;
  }

  /** acquires a mutation lock, preventing traversal of the link until the lock is resolved */
  mutationLock(): Omit<PromiseWithResolvers<void>, "promise"> {
    const { promise, resolve, reject } = Promise.withResolvers<void>();
    this.mutation = promise;
    return { resolve, reject };
  }

  /** creates a clone of the link */
  clone(): Link {
    return new Link({ hash: this.hash, value: shallowClone(this.value) });
  }
}

/** This is returned from the walk generator */
export interface WalkResult {
  /** the last merkle link that has been traversed through */
  link: Link;
  /** the current node in the graph */
  node: LinkValue;
  /** the parent of the current node */
  parent: LinkValue;
  /** the name of the edge that was traversed */
  name: string;
  /** the remaining path to traverse */
  remainderPath: jsonpointer.JsonPath;
}

export class Graph {
  #loading = new LockMap<string>();
  /** the store that the graph is stored in */
  public store: StoreInterface;

  /**
   * Creates a new graph
   * @param params.root - the root of the graph, which is always a merkle {@link Link}
   */
  constructor(
    params: Partial<Graph> & {
      store: StoreInterface;
    },
  ) {
    Object.assign(this, params);
    this.store = params.store;
  }

  // this loads a hash from the store
  async #loadHash(hash: Uint8Array): Promise<Link> {
    // #loading is a map of hashes that we have already requested. We don't want
    // to rerequiest something that we already started loading
    const hashString = hash.toString();
    let loadingOp = this.#loading.get(hashString);
    if (loadingOp) {
      return loadingOp;
    } else {
      const { resolve } = this.#loading.lock(hashString);
      loadingOp = this.#loading.get(hashString);
      const raw = await this.store.get(hash);
      const value = decodeCbor(raw!);
      const link = new Link({ value, hash });
      resolve(link);
      return link;
    }
  }

  /** This method stores data in the underlying store, but keys it outside the merkle graph */
  setMetaData(key: CborType, value: CborType): Promise<void> {
    return this.store.set(encodeCbor(key), encodeCbor(value));
  }

  /** This method retrieves data in the underlying store */
  async getMetaData<T extends CborType = CborType>(
    key: CborType,
  ): Promise<T | undefined> {
    const cbor = await this.store.get(encodeCbor(key));
    if (cbor) {
      return decodeCbor(cbor) as T;
    }
  }

  /** An async generator that walks a given path, returning a `node`, the node's `parent`, the `name` of the edge and `remainderPath` for each edge traversed in the graph */
  async *walk(
    root: Link,
    path: string | string[],
    mutate = false,
  ): AsyncGenerator<WalkResult> {
    const remainderPath = jsonpointer.split(path);
    if (!root.value) {
      root = await this.#loadHash(root.hash!);
    }
    let name,
      resolve,
      parent: LinkValue,
      link = root,
      node: LinkValue = root.value!;

    try {
      // only wait if there is a mutation in progress
      // we don't want the mutationLock to be triggered on nextTick
      if (link.mutation) await link.mutation;
      if (mutate) {
        resolve = link.mutationLock().resolve;
      }
      yield {
        link,
        node,
        parent,
        name: "",
        remainderPath,
      };
      while (remainderPath.length) {
        name = remainderPath.shift()!;
        parent = node;
        if (isObject(parent)) {
          node = parent[name];
          if (isHash(node)) {
            const val = await this.#loadHash(node);
            node = parent[name] = val;
          }
          if (node instanceof Link) {
            await node.mutation;
            if (mutate) {
              resolve!();
              resolve = node.mutationLock().resolve;
            }
            link = node;
            node = link.value!;
          }
          yield {
            link,
            node,
            parent,
            name,
            remainderPath,
          };
        } else {
          break;
        }
      }
    } finally {
      // unlock any pending mutations
      if (mutate) resolve!();
    }
  }

  /**
   * traverses an object's path and returns the resulting value, if any, in a Promise
   */
  async get(
    root: Link,
    path: string | string[],
  ): Promise<WalkResult> {
    const last = (await Array.fromAsync(this.walk(root, path))).pop()!;
    return last;
  }

  /**
   * sets a value on a root object given its path
   */
  set(
    root: Link,
    path: string | string[],
    value: LinkValue,
  ): Link {
    const pathArray = jsonpointer.split(path);
    const newRoot = root.clone();
    // need to track the parents since we are cloning the nodes
    // the generator will not have access to the cloned nodes
    let parent: LinkValue = false;
    newRoot.pendingWriteOperation = (async () => {
      for await (
        let {
          link,
          name,
          node,
          remainderPath,
        } of this.walk(newRoot, pathArray, true)
      ) {
        // clone as we go along the path!
        if (isObject(parent)) {
          // if the node is the link
          if (node === link.value) {
            link = link.clone();
            Reflect.set(parent, name, link);
            node = link.value!;
          } else {
            // todo handle other types of objects such as arrays
            node = shallowClone(node);
            Reflect.set(parent, name, node);
          }
        }
        if (!remainderPath.length) {
          Reflect.set(parent as object, name, value);
        } else if (!isObject(node)) {
          // we should check for arrays here too
          let extnode: LinkValue = {};
          Reflect.set(parent as object, name, extnode);
          // extend the path for the left over path names
          const last = remainderPath!.pop()!;
          for (const n of remainderPath!) {
            extnode = extnode[n] = {};
          }
          extnode[last] = value;
        } else {
          // parent is an object
          parent = node;
        }
      }
    })();
    return newRoot;
  }

  /**
   * flush an object to the store and create a merkle root
   */
  async merklelize(
    root: Link,
  ): Promise<Uint8Array> {
    if (root.modified) {
      const value = root.value!;
      await this.#merklelizeLeaves(value);
      const buf = encodeCbor(value as CborType);
      root.hash = blake3(buf);
      root.modified = false;
      await this.store.set(root.hash, buf);
    }
    return root.hash!;
  }

  #merklelizeLeaves(node: LinkValue) {
    if (isObject(node)) {
      return Promise.all(
        Object.entries(node).map(async ([key, value]) => {
          if (value instanceof Link) {
            await value.mutation;
            const hash = await this.merklelize(value);
            node[key] = hash;
          } else if (isObject(value)) {
            await this.#merklelizeLeaves(value);
          }
        }),
      );
    }
  }
}

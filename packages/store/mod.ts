import { codec, type Hash, hash, isHash } from "@massmarket/utils";
import type { AbstractStore } from "./abstract.ts";

export * from "./mem.ts";
// export * from "./jollytoad.ts";
export * from "./level.ts";
export * from "./abstract.ts";

export interface ObjectStoreEntry {
  key: codec.CodecValue;
  value: codec.CodecValue;
  date: Date;
}

export interface ObjectStoreNotFoundEntry {
  key: codec.CodecValue;
  value: undefined;
  date: undefined;
}

/*
 * ObjectStore stores objects store's objects, as long as they can be encoded as CBOR
 * It is a key-value store Where
 * - Keys can be any value that can be encoded as CBOR
 * - Values can be any value that can be encoded as CBOR
 */
export class ObjectStore {
  store: AbstractStore;
  constructor(store: AbstractStore) {
    this.store = store;
  }

  async get(
    key: codec.CodecValue,
  ): Promise<ObjectStoreEntry | ObjectStoreNotFoundEntry> {
    if (!(key instanceof Uint8Array)) {
      key = codec.encode(key);
    }
    const entry = await this.store.get(key as Uint8Array);
    if (entry.value) {
      return {
        key,
        value: codec.decode(entry.value),
        date: new Date(entry.date),
      };
    } else {
      return {
        key,
        value: undefined,
        date: undefined,
      };
    }
  }

  async set(
    entry: ObjectStoreEntry,
  ): Promise<void> {
    let key = entry.key;
    if (!(key instanceof Uint8Array)) {
      key = codec.encode(key);
    }
    const ev = codec.encode(entry.value);
    await this.store.set({
      key: key as Uint8Array,
      value: ev,
      date: entry.date,
    });
  }
}

/**
 * ContentAddressableStore is a content-addressable store.
 * Values are stored as CBOR-encoded data.
 */
export class ContentAddressableStore {
  objStore: ObjectStore;
  constructor(store: AbstractStore) {
    this.objStore = new ObjectStore(store);
  }

  get(key: Hash): Promise<ObjectStoreEntry | ObjectStoreNotFoundEntry> {
    return this.objStore.get(key);
  }

  async set(entry: Omit<ObjectStoreEntry, "key">): Promise<Hash> {
    if (isHash(entry.value)) {
      return entry.value;
    } else {
      const ev = codec.encode(entry.value);
      const keyb = await hash(ev);
      const key = new Uint8Array(keyb);
      await this.objStore.set({
        key,
        ...entry,
      });
      return key;
    }
  }
}

import { codec, type Hash, hash, isHash } from "@massmarket/utils";
import type { AbstractStore } from "./abstract.ts";

export * from "./mem.ts";
// export * from "./jollytoad.ts";
export * from "./level.ts";
export * from "./abstract.ts";

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
  ): Promise<codec.CodecValue | undefined> {
    if (!(key instanceof Uint8Array)) {
      key = codec.encode(key);
    }
    const storeData = await this.store.get(key as Uint8Array);
    return storeData ? codec.decode(storeData.value) : undefined;
  }

  async set(key: codec.CodecValue, value: codec.CodecValue): Promise<void> {
    if (!(key instanceof Uint8Array)) {
      key = codec.encode(key);
    }
    const ev = codec.encode(value);
    await this.store.set({
      key: key as Uint8Array,
      value: ev,
      date: new Date(),
    });
  }

  append(key: codec.CodecValue, value: codec.CodecValue): Promise<void> {
    if (!(key instanceof Uint8Array)) {
      key = codec.encode(key);
    }

    const ev = codec.encode(value);
    return this.store.append({
      key: key as Uint8Array,
      value: ev,
      date: new Date(),
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
      await this.objStore.store.set({
        key,
        value: ev,
        date: new Date(),
      });
      return key;
    }
  }
}

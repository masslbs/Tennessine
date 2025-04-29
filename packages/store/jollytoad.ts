import type { StorageModule } from "@jollytoad/store-common/types";
import { getItem, setItem, setStore } from "@jollytoad/store";
import { AbstractStore } from "./abstract.ts";

export class JollyToadStore extends AbstractStore {
  constructor(
    storageModule: StorageModule | Promise<StorageModule> = import(
      "$store"
    ),
  ) {
    super();
    setStore(storageModule);
  }

  async get(
    key: Uint8Array,
  ): Promise<Uint8Array | undefined> {
    const result = await getItem(Array.from(key));
    if (Array.isArray(result)) {
      return new Uint8Array(result);
    }
  }

  set(key: Uint8Array, value: Uint8Array): Promise<void> {
    return setItem(Array.from(key), Array.from(value));
  }
}

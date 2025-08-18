import type { StorageModule } from "@jollytoad/store-common/types";
import { getItem, setItem, setStore } from "@jollytoad/store";
import { AbstractStore, type StoreData } from "./abstract.ts";

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
  ): Promise<StoreData | undefined> {
    const result = await getItem(Array.from(key));
    if (result && typeof result === "object") {
      return {
        key: new Uint8Array(result.key),
        value: new Uint8Array(result.value),
        date: new Date(result.date),
      };
    }
  }

  set(data: StoreData): Promise<void> {
    const serialized = {
      key: Array.from(data.key),
      value: Array.from(data.value),
      date: data.date.toISOString(),
    };
    return setItem(Array.from(data.key), serialized);
  }
}

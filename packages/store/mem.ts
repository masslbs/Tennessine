import {
  AbstractStore,
  type StoreEntry,
  type StoreEntryNotFound,
} from "./abstract.ts";

export class MemStore extends AbstractStore {
  #data: Map<string, StoreEntry> = new Map();

  get(
    key: Uint8Array,
  ): Promise<StoreEntry | StoreEntryNotFound> {
    const entry = this.#data.get("key" + key.toString());
    if (entry) {
      return Promise.resolve(entry);
    } else {
      return Promise.resolve({
        key,
        value: undefined,
        date: undefined,
      });
    }
  }

  set(data: StoreEntry): Promise<void> {
    this.#data.set("key" + data.key.toString(), data);
    return Promise.resolve();
  }
}

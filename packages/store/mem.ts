import { AbstractStore, type StoreData } from "./abstract.ts";

export class MemStore extends AbstractStore {
  #data: Map<string, StoreData> = new Map();

  get(
    key: Uint8Array,
  ): Promise<StoreData | undefined> {
    return Promise.resolve(this.#data.get("key" + key.toString()));
  }

  set(data: StoreData): Promise<void> {
    this.#data.set("key" + data.key.toString(), data);
    return Promise.resolve();
  }
}

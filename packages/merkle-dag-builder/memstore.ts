import type { StoreInterface } from "./mod.ts";

export class MemStore implements StoreInterface {
  #data: Map<string, Uint8Array> = new Map();

  get(
    key: Uint8Array,
  ): Promise<Uint8Array | undefined> {
    return Promise.resolve(this.#data.get("key" + key.toString()));
  }

  set(key: Uint8Array, value: Uint8Array): Promise<void> {
    this.#data.set("key" + key.toString(), value);
    return Promise.resolve();
  }
}

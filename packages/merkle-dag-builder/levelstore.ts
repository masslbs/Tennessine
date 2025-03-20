import { Level } from "level";
import type { StoreInterface } from "./mod.ts";

export class LevelStore implements StoreInterface {
  #data = new Level<Uint8Array, Uint8Array>("./db", {
    valueEncoding: "view",
    keyEncoding: "view",
  });

  get(
    key: Uint8Array,
  ): Promise<Uint8Array | undefined> {
    return this.#data.get(key);
  }

  set(key: Uint8Array, value: Uint8Array): Promise<void> {
    return this.#data.put(key, value);
  }

  async append(key: Uint8Array, value: Uint8Array): Promise<void> {
    const existingValue = await this.get(key);
    if (existingValue) {
      return this.set(key, new Uint8Array([...existingValue, ...value]));
    } else {
      return this.set(key, value);
    }
  }
}

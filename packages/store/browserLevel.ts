import { BrowserLevel } from "browser-level";
import type { AbstractLevel } from "abstract-level";
import { AbstractStore } from "./abstract.ts";

export type AbstractLevelConstructor = new (
  ...params: ConstructorParameters<typeof AbstractLevel>
) => AbstractLevel<Uint8Array, Uint8Array>;

export class LevelStore extends AbstractStore {
  constructor(
    dbName: string,
    private level: Pick<
      AbstractLevel<Uint8Array, Uint8Array, Uint8Array>,
      "get" | "put"
    > = new BrowserLevel<
      Uint8Array,
      Uint8Array
    >(dbName, {
      valueEncoding: "view",
      keyEncoding: "view",
    }),
  ) {
    super();
  }

  async get(
    key: Uint8Array,
  ): Promise<Uint8Array | undefined> {
    const value = await this.level.get(key);
    if (value) return Uint8Array.from(value);
  }

  async set(key: Uint8Array, value: Uint8Array): Promise<void> {
    return this.level.put(key, value);
  }
}

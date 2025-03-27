import { MemoryLevel } from "memory-level";
import type { AbstractLevel } from "abstract-level";
import { AbstractStore } from "./abstract.ts";

export type AbstractLevelConstructor = new (
  ...params: ConstructorParameters<typeof AbstractLevel>
) => AbstractLevel<Uint8Array, Uint8Array>;

export class LevelStore extends AbstractStore {
  constructor(
    private level: Pick<
      AbstractLevel<Uint8Array, Uint8Array, Uint8Array>,
      "get" | "put"
    > = new MemoryLevel<
      Uint8Array,
      Uint8Array
    >({
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

  set(key: Uint8Array, value: Uint8Array): Promise<void> {
    return this.level.put(key, value);
  }
}

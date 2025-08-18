import { MemoryLevel } from "memory-level";
import type { AbstractLevel } from "abstract-level";
import { AbstractStore, type StoreData } from "./abstract.ts";

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
  ): Promise<StoreData | undefined> {
    try {
      const storedData = await this.level.get(key);
      if (storedData) {
        // Parse the stored JSON data
        const parsed = JSON.parse(new TextDecoder().decode(storedData));
        return {
          key: new Uint8Array(parsed.key),
          value: new Uint8Array(parsed.value),
          date: new Date(parsed.date),
        };
      }
    } catch {
      return undefined;
    }
  }

  set(data: StoreData): Promise<void> {
    // Serialize the StoreData to JSON for storage
    const serialized = {
      key: Array.from(data.key),
      value: Array.from(data.value),
      date: data.date.toISOString(),
    };
    const encoded = new TextEncoder().encode(JSON.stringify(serialized));
    return this.level.put(data.key, encoded);
  }
}

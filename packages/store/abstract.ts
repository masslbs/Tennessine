/** Data structure for store operations */
export type StoreData = {
  key: Uint8Array;
  value: Uint8Array;
  date: Date;
};

/** The interface for a store that is used to store and retrieve blocks */
export abstract class AbstractStore {
  abstract get(key: Uint8Array): Promise<StoreData | undefined>;
  abstract set(data: StoreData): Promise<void>;
  async append(data: StoreData): Promise<void> {
    const existing = await this.get(data.key);
    if (existing) {
      return this.set({
        key: data.key,
        value: new Uint8Array([...existing.value, ...data.value]),
        date: data.date,
      });
    } else {
      return this.set(data);
    }
  }
}

export type AbstractStoreConstructor = new (
  ...params: ConstructorParameters<typeof AbstractStore>
) => AbstractStore;

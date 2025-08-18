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
}

export type AbstractStoreConstructor = new (
  ...params: ConstructorParameters<typeof AbstractStore>
) => AbstractStore;

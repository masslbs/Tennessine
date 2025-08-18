/** Data structure for store operations */
export type StoreEntry = {
  key: Uint8Array;
  value: Uint8Array;
  date: Date;
};

export type StoreEntryNotFound = {
  key: Uint8Array;
  value: undefined;
  date: undefined;
};

/** The interface for a store that is used to store and retrieve blocks */
export abstract class AbstractStore {
  abstract get(key: Uint8Array): Promise<StoreEntry | StoreEntryNotFound>;
  abstract set(data: StoreEntry): Promise<void>;
}

export type AbstractStoreConstructor = new (
  ...params: ConstructorParameters<typeof AbstractStore>
) => AbstractStore;

/** The interface for a store that is used to store and retrieve blocks */
export abstract class AbstractStore {
  abstract get(key: Uint8Array): Promise<Uint8Array | undefined>;
  abstract set(key: Uint8Array, value: Uint8Array): Promise<void>;
  async append(key: Uint8Array, value: Uint8Array): Promise<void> {
    const existingValue = await this.get(key);
    if (existingValue) {
      return this.set(key, new Uint8Array([...existingValue, ...value]));
    } else {
      return this.set(key, value);
    }
  }
}

export type AbstractStoreConstructor = new (
  ...params: ConstructorParameters<typeof AbstractStore>
) => AbstractStore;

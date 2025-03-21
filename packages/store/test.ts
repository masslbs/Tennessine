import { assert, assertEquals } from "@std/assert";
import type { AbstractStoreConstructor } from "./mod.ts";

function generateRandomUint8Array(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

export default function Test(
  Store: AbstractStoreConstructor,
) {
  Deno.test(`${Store.name} - Basic operations`, async () => {
    const store = new Store();

    // Generate random key and value
    const key = generateRandomUint8Array(32);
    const value = generateRandomUint8Array(64);

    // Store the value
    await store.set(key, value);

    // Retrieve and verify the value
    const retrieved = await store.get(key);
    assert(retrieved !== undefined, "Retrieved value should not be undefined");
    assertEquals(
      retrieved,
      value,
      "Retrieved value should match stored value",
    );
  });

  Deno.test(`${Store.name} - Get non-existent key`, async () => {
    const store = new Store();

    // Try to get a key that hasn't been set
    const nonExistentKey = generateRandomUint8Array(32);
    const result = await store.get(nonExistentKey);

    assertEquals(
      result,
      undefined,
      "Getting non-existent key should return undefined",
    );
  });

  Deno.test(`${Store.name} - Overwrite existing key`, async () => {
    const store = new Store();

    const key = generateRandomUint8Array(32);
    const value1 = generateRandomUint8Array(64);
    const value2 = generateRandomUint8Array(64);

    // Store initial value
    await store.set(key, value1);

    // Overwrite with new value
    await store.set(key, value2);

    // Retrieve and verify the new value
    const retrieved = await store.get(key);
    assert(retrieved !== undefined, "Retrieved value should not be undefined");
    assertEquals(
      retrieved,
      value2,
      "Retrieved value should match the overwritten value",
    );
  });

  Deno.test(`${Store.name} - Multiple random key-value pairs`, async () => {
    const store = new Store();
    const pairCount = 100; // Test with 100 random pairs

    const pairs = Array.from({ length: pairCount }, () => ({
      key: generateRandomUint8Array(32),
      value: generateRandomUint8Array(64),
    }));

    // Store all pairs
    for (const pair of pairs) {
      await store.set(pair.key, pair.value);
    }

    // Verify all pairs
    for (const pair of pairs) {
      const retrieved = await store.get(pair.key);
      assert(
        retrieved !== undefined,
        "Retrieved value should not be undefined",
      );
      assertEquals(
        retrieved,
        pair.value,
        "Retrieved value should match stored value",
      );
    }
  });

  Deno.test(`${Store.name} - Collision resistance with similar keys`, async () => {
    const store = new Store();

    // Create two similar but different keys
    const key1 = new Uint8Array([1, 255]);
    const key2 = new Uint8Array([1, 255, 0]);

    const value1 = generateRandomUint8Array(64);
    const value2 = generateRandomUint8Array(64);

    await store.set(key1, value1);
    await store.set(key2, value2);

    const retrieved1 = await store.get(key1);
    const retrieved2 = await store.get(key2);

    assert(
      retrieved1 !== undefined,
      "Retrieved value 1 should not be undefined",
    );
    assert(
      retrieved2 !== undefined,
      "Retrieved value 2 should not be undefined",
    );
    assertEquals(retrieved1, value1, "First key should retrieve first value");
    assertEquals(retrieved2, value2, "Second key should retrieve second value");
  });

  Deno.test(`${Store.name} - Stress test with varying size data`, async () => {
    const store = new Store();
    const testCount = 50;

    const pairs = Array.from({ length: testCount }, () => {
      // Random sizes between 1 and 1024 bytes
      const keySize = Math.floor(Math.random() * 1024) + 1;
      const valueSize = Math.floor(Math.random() * 1024) + 1;

      return {
        key: generateRandomUint8Array(keySize),
        value: generateRandomUint8Array(valueSize),
      };
    });

    // Store all pairs
    await Promise.all(pairs.map((pair) => store.set(pair.key, pair.value)));

    // Verify all pairs
    for (const pair of pairs) {
      const retrieved = await store.get(pair.key);
      assert(
        retrieved !== undefined,
        "Retrieved value should not be undefined",
      );
      assertEquals(
        retrieved,
        pair.value,
        "Retrieved value should match stored value",
      );
    }
  });
}

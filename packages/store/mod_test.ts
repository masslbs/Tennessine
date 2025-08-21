import { assert, assertEquals, assertNotEquals } from "@std/assert";
import { ContentAddressableStore, ObjectStore } from "./mod.ts";
import { codec, type Hash } from "@massmarket/utils";
import { LevelStore } from "./level.ts";
import { MemStore } from "./mem.ts";

import Test from "./test.ts";

await Promise.all([MemStore, LevelStore].map(Test));

function generateRandomCodecValue(): codec.CodecValue {
  const types = [
    () => Math.random().toString(36).substring(7), // random string
    () => Math.floor(Math.random() * 1000000), // random number
    () => Math.random() > 0.5, // random boolean
    () => new Date(), // random date
    () => new Uint8Array(crypto.getRandomValues(new Uint8Array(10))), // random Uint8Array
    () =>
      Array.from(
        { length: Math.floor(Math.random() * 5) + 1 },
        () => Math.floor(Math.random() * 100),
      ), // random array of numbers
    () => {
      const map = new Map<codec.CodecKey, codec.CodecValue>();
      map.set("prop1", Math.random().toString(36).substring(7));
      map.set("prop2", Math.floor(Math.random() * 100));
      return map;
    }, // random Map
  ];

  return types[Math.floor(Math.random() * types.length)]();
}

Deno.test("ObjectStore - Basic operations", async () => {
  const store = new ObjectStore(new MemStore());

  const key = "test-key";
  const value = new Map<codec.CodecKey, codec.CodecValue>();
  value.set("hello", "world");
  value.set("number", 42);
  const date = new Date();

  // Set an entry
  await store.set({ key, value, date });

  // Get the entry back
  const retrieved = await store.get(key);
  assert(retrieved !== undefined, "Retrieved entry should not be undefined");
  // Key is encoded as Uint8Array internally, so we need to decode or compare properly
  if (retrieved.key instanceof Uint8Array) {
    assertEquals(codec.decode(retrieved.key), key, "Key should match");
  } else {
    assertEquals(retrieved.key, key, "Key should match");
  }
  assertEquals(retrieved.value, value, "Value should match");
  assertEquals(
    (retrieved.date as Date).getTime(),
    date.getTime(),
    "Date should match",
  );
});

Deno.test("ObjectStore - Different key types", async () => {
  const store = new ObjectStore(new MemStore());

  const complexMap = new Map<codec.CodecKey, codec.CodecValue>();
  complexMap.set("complex", "object");

  const testCases: Array<{ key: codec.CodecValue; value: codec.CodecValue }> = [
    { key: "string-key", value: "string value" },
    { key: 123, value: "number key" },
    { key: true, value: "boolean key" },
    { key: complexMap, value: "map key" },
    { key: [1, 2, 3], value: "array key" },
    { key: new Uint8Array([1, 2, 3]), value: "uint8array key" },
    { key: new Date(), value: "date key" },
  ];

  // Set all entries
  for (const testCase of testCases) {
    await store.set({
      key: testCase.key,
      value: testCase.value,
      date: new Date(),
    });
  }

  // Retrieve and verify all entries
  for (const testCase of testCases) {
    const retrieved = await store.get(testCase.key);
    assert(
      retrieved !== undefined,
      `Entry with key ${JSON.stringify(testCase.key)} should exist`,
    );
    assertEquals(
      retrieved.value,
      testCase.value,
      `Value should match for key ${JSON.stringify(testCase.key)}`,
    );
  }
});

Deno.test("ObjectStore - Different value types", async () => {
  const store = new ObjectStore(new MemStore());

  const objectMap = new Map<codec.CodecKey, codec.CodecValue>();
  objectMap.set("object", "value");
  const nestedMap = new Map<codec.CodecKey, codec.CodecValue>();
  nestedMap.set("deep", true);
  objectMap.set("nested", nestedMap);

  const arrayWithMap = new Array<codec.CodecValue>();
  arrayWithMap.push(1);
  arrayWithMap.push("two");
  const mapInArray = new Map<codec.CodecKey, codec.CodecValue>();
  mapInArray.set("three", 3);
  arrayWithMap.push(mapInArray);

  const testCases: codec.CodecValue[] = [
    "string value",
    42,
    3.14159,
    true,
    false,
    null,
    objectMap,
    arrayWithMap,
    new Uint8Array([1, 2, 3, 4]),
    new Date(),
  ];

  // Set all entries with different value types
  for (let i = 0; i < testCases.length; i++) {
    await store.set({
      key: `key-${i}`,
      value: testCases[i],
      date: new Date(),
    });
  }

  // Retrieve and verify all entries
  for (let i = 0; i < testCases.length; i++) {
    const retrieved = await store.get(`key-${i}`);
    assert(retrieved !== undefined, `Entry ${i} should exist`);
    assertEquals(retrieved.value, testCases[i], `Value ${i} should match`);
  }
});

Deno.test("ObjectStore - Get non-existent key", async () => {
  const store = new ObjectStore(new MemStore());

  const result = await store.get("non-existent-key");
  assertEquals(
    result.value,
    undefined,
    "Non-existent key should return undefined",
  );
});

Deno.test("ObjectStore - Overwrite existing key", async () => {
  const store = new ObjectStore(new MemStore());

  const key = "overwrite-key";
  const value1 = "first value";
  const value2 = "second value";
  const date1 = new Date(2023, 0, 1);
  const date2 = new Date(2023, 0, 2);

  // Set initial value
  await store.set({ key, value: value1, date: date1 });

  // Overwrite with new value
  await store.set({ key, value: value2, date: date2 });

  // Should get the new value
  const retrieved = await store.get(key);
  assert(retrieved !== undefined, "Retrieved entry should not be undefined");
  assertEquals(retrieved.value, value2, "Should get the overwritten value");
  assertEquals(
    retrieved.date!.getTime(),
    date2.getTime(),
    "Should get the new date",
  );
});

Deno.test("ObjectStore - Random data stress test", async () => {
  const store = new ObjectStore(new MemStore());
  const testCount = 100;

  const testEntries = Array.from({ length: testCount }, (_, i) => ({
    key: `stress-key-${i}`,
    value: generateRandomCodecValue(),
    date: new Date(Date.now() + i),
  }));

  // Set all entries
  for (const entry of testEntries) {
    await store.set(entry);
  }

  // Verify all entries
  for (const entry of testEntries) {
    const retrieved = await store.get(entry.key);
    assert(retrieved !== undefined, `Entry with key ${entry.key} should exist`);
    assertEquals(
      retrieved.value,
      entry.value,
      `Value should match for key ${entry.key}`,
    );
    assertEquals(
      retrieved.date!.getTime(),
      entry.date.getTime(),
      `Date should match for key ${entry.key}`,
    );
  }
});

Deno.test("ContentAddressableStore - Basic operations", async () => {
  const store = new ContentAddressableStore(new MemStore());

  const value = new Map<codec.CodecKey, codec.CodecValue>();
  value.set("message", "hello world");
  value.set("data", [1, 2, 3]);
  const date = new Date();

  // Set a value and get its hash
  const hash1 = await store.set({ value, date });
  assert(hash1 instanceof Uint8Array, "Hash should be a Uint8Array");
  assert(hash1.length > 0, "Hash should not be empty");

  // Get the value back using the hash
  const retrieved = await store.get(hash1);
  assert(retrieved !== undefined, "Retrieved entry should not be undefined");
  assertEquals(retrieved.value, value, "Value should match");
  assertEquals(retrieved.date!.getTime(), date.getTime(), "Date should match");
});

Deno.test("ContentAddressableStore - Same content produces same hash", async () => {
  const store = new ContentAddressableStore(new MemStore());

  const value = new Map<codec.CodecKey, codec.CodecValue>();
  value.set("identical", "content");
  value.set("array", [1, 2, 3]);
  const date1 = new Date(2023, 0, 1);
  const date2 = new Date(2023, 0, 2); // Different date

  // Set the same content twice with different dates
  const hash1 = await store.set({ value, date: date1 });
  const hash2 = await store.set({ value, date: date2 });

  // Hashes should be the same because content is identical
  assertEquals(hash1, hash2, "Same content should produce same hash");

  // The stored value should be the latest one (second entry)
  const retrieved = await store.get(hash1);
  assert(retrieved !== undefined, "Retrieved entry should not be undefined");
  assertEquals(retrieved.value, value, "Value should match");
  assertEquals(
    retrieved.date!.getTime(),
    date2.getTime(),
    "Should have the latest date",
  );
});

Deno.test("ContentAddressableStore - Different content produces different hashes", async () => {
  const store = new ContentAddressableStore(new MemStore());

  const value1 = new Map<codec.CodecKey, codec.CodecValue>();
  value1.set("content", "first");
  const value2 = new Map<codec.CodecKey, codec.CodecValue>();
  value2.set("content", "second");
  const date = new Date();

  const hash1 = await store.set({ value: value1, date });
  const hash2 = await store.set({ value: value2, date });

  assertNotEquals(
    hash1,
    hash2,
    "Different content should produce different hashes",
  );

  // Both values should be retrievable
  const retrieved1 = await store.get(hash1);
  const retrieved2 = await store.get(hash2);

  assert(retrieved1 !== undefined, "First entry should exist");
  assert(retrieved2 !== undefined, "Second entry should exist");
  assertEquals(retrieved1.value, value1, "First value should match");
  assertEquals(retrieved2.value, value2, "Second value should match");
});

Deno.test("ContentAddressableStore - Hash as value", async () => {
  const store = new ContentAddressableStore(new MemStore());

  // First, store some content and get its hash
  const originalValue = "original content";
  const date1 = new Date(2023, 0, 1);
  const originalHash = await store.set({ value: originalValue, date: date1 });

  // Now try to store that hash as a value (with a different date)
  const date2 = new Date(2023, 0, 2);
  const hashAsValueHash = await store.set({ value: originalHash, date: date2 });

  // The hash should be returned as-is since it's already a hash
  assertEquals(
    hashAsValueHash,
    originalHash,
    "Hash as value should return the same hash",
  );

  // The original content should still be retrievable
  const retrieved = await store.get(originalHash);
  assert(retrieved !== undefined, "Original entry should still exist");
  assertEquals(
    retrieved.value,
    originalValue,
    "Original value should be preserved",
  );
  // Note: When a hash is passed as value, ContentAddressableStore doesn't update
  // the stored entry - it just returns the hash. So the date remains unchanged.
  assertEquals(
    retrieved.date!.getTime(),
    date1.getTime(),
    "Date should remain unchanged when hash is used as value",
  );
});

Deno.test("ContentAddressableStore - Get non-existent hash", async () => {
  const store = new ContentAddressableStore(new MemStore());

  // Create a fake hash
  const fakeHash = new Uint8Array(32); // Assuming 32-byte hashes
  crypto.getRandomValues(fakeHash);

  const result = await store.get(fakeHash as Hash);
  assertEquals(
    result.value,
    undefined,
    "Non-existent hash should return undefined",
  );
});

Deno.test("ContentAddressableStore - Various data types", async () => {
  const store = new ContentAddressableStore(new MemStore());

  const complexMap = new Map<codec.CodecKey, codec.CodecValue>();
  const nestedMap = new Map<codec.CodecKey, codec.CodecValue>();
  const deepNestedMap = new Map<codec.CodecKey, codec.CodecValue>();
  deepNestedMap.set("object", "value");
  nestedMap.set("nested", deepNestedMap);
  complexMap.set("complex", nestedMap);

  const arrayWithMixedTypes: codec.CodecValue[] = [1, "two"];
  const mapInArray = new Map<codec.CodecKey, codec.CodecValue>();
  mapInArray.set("three", 3);
  arrayWithMixedTypes.push(mapInArray);
  arrayWithMixedTypes.push([4, 5]);

  const testValues: codec.CodecValue[] = [
    "simple string",
    12345,
    true,
    complexMap,
    arrayWithMixedTypes,
    new Uint8Array([1, 2, 3, 4, 5]),
    null,
    new Date(),
  ];

  const hashes: Hash[] = [];
  const date = new Date();

  // Store all values
  for (const value of testValues) {
    const hash = await store.set({ value, date });
    hashes.push(hash);
  }

  // All hashes should be different
  const uniqueHashes = new Set(hashes.map((h) => h.toString()));
  assertEquals(uniqueHashes.size, hashes.length, "All hashes should be unique");

  // All values should be retrievable
  for (let i = 0; i < testValues.length; i++) {
    const retrieved = await store.get(hashes[i]);
    assert(retrieved !== undefined, `Entry ${i} should exist`);
    assertEquals(retrieved.value, testValues[i], `Value ${i} should match`);
  }
});

Deno.test("ContentAddressableStore - Stress test with random data", async () => {
  const store = new ContentAddressableStore(new MemStore());
  const testCount = 50;

  const testEntries = Array.from({ length: testCount }, () => ({
    value: generateRandomCodecValue(),
    date: new Date(),
  }));

  const hashes: Hash[] = [];

  // Store all entries
  for (const entry of testEntries) {
    const hash = await store.set(entry);
    hashes.push(hash);
  }

  // Verify all entries can be retrieved
  for (let i = 0; i < testEntries.length; i++) {
    const retrieved = await store.get(hashes[i]);
    assert(retrieved !== undefined, `Entry ${i} should exist`);
    assertEquals(
      retrieved.value,
      testEntries[i].value,
      `Value ${i} should match`,
    );
  }
});

Deno.test("ObjectStore - Handle Maps as keys", async () => {
  const store = new ObjectStore(new MemStore());

  const mapKey = new Map<codec.CodecKey, codec.CodecValue>();
  mapKey.set("id", 123);
  mapKey.set("type", "user");
  const value = "value for map key";
  const date = new Date();

  await store.set({ key: mapKey, value, date });

  const retrieved = await store.get(mapKey);
  assert(retrieved !== undefined, "Retrieved entry should not be undefined");
  assertEquals(retrieved.value, value, "Value should match");
});

Deno.test("ObjectStore - Handle complex nested Maps", async () => {
  const store = new ObjectStore(new MemStore());

  const key = "nested-map-key";

  // Build nested structure carefully
  const preferencesMap = new Map<codec.CodecKey, codec.CodecValue>();
  preferencesMap.set("theme", "dark");
  preferencesMap.set("notifications", true);

  const profileMap = new Map<codec.CodecKey, codec.CodecValue>();
  profileMap.set("name", "Alice");
  profileMap.set("preferences", preferencesMap);

  const userMap = new Map<codec.CodecKey, codec.CodecValue>();
  userMap.set("id", 123);
  userMap.set("profile", profileMap);

  const nestedMapInArray = new Map<codec.CodecKey, codec.CodecValue>();
  nestedMapInArray.set("nested", "value");
  const dataArray: codec.CodecValue[] = [1, 2, nestedMapInArray];

  const metadataMap = new Map<codec.CodecKey, codec.CodecValue>();
  metadataMap.set("created", new Date("2023-01-01"));
  metadataMap.set("tags", ["test", "map"]);

  const value = new Map<codec.CodecKey, codec.CodecValue>();
  value.set("user", userMap);
  value.set("data", dataArray);
  value.set("metadata", metadataMap);

  const date = new Date();

  await store.set({ key, value, date });

  const retrieved = await store.get(key);
  assert(retrieved !== undefined, "Retrieved entry should not be undefined");
  assertEquals(
    retrieved.value,
    value,
    "Retrieved complex value should match stored value",
  );
});

Deno.test("ObjectStore - Multiple entries with different key types", async () => {
  const store = new ObjectStore(new MemStore());
  const date = new Date();

  const mapKey = new Map<codec.CodecKey, codec.CodecValue>();
  mapKey.set("id", 1);

  const entries = [
    { key: "string-key", value: "string-value" },
    { key: 42, value: "number-key-value" },
    { key: true, value: "boolean-key-value" },
    { key: [1, 2, 3], value: "array-key-value" },
    { key: mapKey, value: "map-key-value" },
    { key: new Date(), value: "date-key-value" },
  ];

  // Store all entries
  for (const entry of entries) {
    await store.set({ ...entry, date });
  }

  // Verify all entries can be retrieved
  for (const entry of entries) {
    const retrieved = await store.get(entry.key);
    assert(
      retrieved !== undefined,
      `Entry with key ${JSON.stringify(entry.key)} should exist`,
    );
    assertEquals(
      retrieved.value,
      entry.value,
      `Value should match for key ${JSON.stringify(entry.key)}`,
    );
  }
});

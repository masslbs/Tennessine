import { assert, assertEquals, assertRejects } from "@std/assert";
import { MemStore as Store } from "@massmarket/store/mem";
import type { CodecValue } from "@massmarket/utils/codec";
import { DAG, type RootValue } from "./mod.ts";
import { assertNotEquals } from "@std/assert/not-equals";
import { set } from "@massmarket/utils";

Deno.test("meta data", async (t) => {
  await t.step("testing storing and retrieving metadata", async () => {
    const store = new Store();
    const dag = new DAG(store);
    await dag.store.objStore.set({
      key: "pet",
      value: "cat",
      date: new Date(),
    });
    const val = await dag.store.objStore.get("pet");
    assertEquals(val?.value, "cat");
  });
});

const store = new Store();

Deno.test("basic set and get ", async (t) => {
  await t.step("Map with string keys", async () => {
    const root: RootValue = new Map();
    const graph = new DAG(
      store,
    );
    const newRoot = await graph.set(root, ["c"], "cat");
    assertNotEquals(root, newRoot);
    const val = await graph.get(newRoot, ["c"]);
    assertEquals(val, "cat");
  });

  await t.step("Map with Uint8Array keys", async () => {
    let root: RootValue = new Map();
    const graph = new DAG(
      store,
    );
    const addresses = new Map([
      [new Uint8Array([1, 2, 3]), "address1"],
      [new Uint8Array([4, 5, 6]), "address2"],
    ]);
    root = await graph.set(root, ["addresses"], addresses);
    const val = await graph.get(root, ["addresses"]);
    assertEquals(val, addresses);
    const key3 = new Uint8Array([7, 8, 9]);
    root = await graph.set(root, ["addresses", key3], "address3");
    const result = await graph.get(root, ["addresses", key3]);
    assertEquals(result, "address3");
  });

  await t.step("A path that does not exist (pathing into a map)", async () => {
    const root: RootValue = new Map();
    const graph = new DAG(
      store,
    );
    const val = await graph.get(root, ["d"]);
    assertEquals(val, undefined);
    assertRejects(() => graph.get(new Uint8Array(32), ["c"]), "invalid root");
    assertRejects(
      () => graph.set(root, ["c", "d", "c"], "catz"),
      "path does not exist",
    );
  });

  // Changed this to be undefined instead of throw
  await t.step(
    "A path that cannot not exist (trying to path through a string)",
    async () => {
      const root: RootValue = new Map();
      const graph = new DAG(
        store,
      );
      const r = await graph.get(root, ["c", "d"]);
      assertEquals(r, undefined);
    },
  );
});

Deno.test("upsert", async (t) => {
  await t.step("should upsert a value", async () => {
    const graph = new DAG(
      store,
    );

    const addresses: CodecValue | Promise<CodecValue> | undefined = new Map([
      [new Uint8Array([1, 2, 3]), "address1"],
      [new Uint8Array([4, 5, 6]), "address2"],
    ]);
    const newAddresses = await graph.set(
      addresses,
      ["addresses"],
      (oldAddress, path) => {
        assertEquals(oldAddress, addresses);
        set(oldAddress, path, "cat");
      },
    );
    const address = await graph.get(newAddresses, ["addresses"]);
    assertEquals(address, "cat");
  });
});

Deno.test("should merklize", async (t) => {
  let merkleRoot;
  let root: RootValue = new Map();
  const sharedStore = new Store();

  await t.step("should create a merkle root", async () => {
    const graph = new DAG(
      sharedStore,
    );

    merkleRoot = await graph.merklelize(root);
    assert(merkleRoot instanceof Uint8Array);
  });

  await t.step("should load from a merkle root", async () => {
    const graph = new DAG(
      sharedStore,
    );

    root = await graph.set(root, ["c"], "cat");
    merkleRoot = await graph.merklelize(root);
    const cat = await graph.get(merkleRoot, ["c"]);
    assert(cat === "cat");
  });
});

Deno.test.ignore(
  "stress test - setting and retrieving many values",
  async (t) => {
    const store = new Store();
    const dag = new DAG(store);
    const root: RootValue = new Map();

    await t.step("should handle many sequential sets and gets", async () => {
      const iterations = 1000;
      let currentRoot: RootValue = root;

      // Create test data with nested structures
      for (let i = 0; i < iterations; i++) {
        const path = [`level1_${i}`];
        const value = new Map<string, CodecValue>(
          [
            ["number", i],
            ["text", `value_${i}`],
            ["array", Array(10).fill(i)],
            [
              "nested",
              new Map<string, CodecValue>([
                ["a", i],
                ["b", `nested_${i}`],
                ["c", new Uint8Array([i % 256])],
              ]),
            ],
          ],
        );

        currentRoot = dag.set(currentRoot, path, value);
      }

      // Verify all values can be retrieved correctly
      for (let i = 0; i < iterations; i++) {
        const path = [`level1_${i}`];
        const retrieved = await dag.get(currentRoot, path);

        const rvalue = new Map<string, CodecValue>(
          [
            ["number", i],
            ["text", `value_${i}`],
            ["array", Array(10).fill(i)],
            [
              "nested",
              new Map<string, CodecValue>([
                ["a", i],
                ["b", `nested_${i}`],
                ["c", new Uint8Array([i % 256])],
              ]),
            ],
          ],
        );

        assertEquals(retrieved, rvalue);
      }
    });

    await t.step("should handle parallel sets and gets", async () => {
      const iterations = 100;
      let currentRoot: RootValue = new Map();

      // Parallel sets
      Array(iterations).fill(0).map((_, i) => {
        const path = [`parallel_${i}`];
        const value = `parallel_value_${i}`;
        currentRoot = dag.set(currentRoot, path, value);
      });

      // Parallel gets
      const getPromises = Array(iterations).fill(0).map(async (_, i) => {
        const path = [`parallel_${i}`];
        const value = await dag.get(currentRoot, path);
        assertEquals(value, `parallel_value_${i}`);
      });

      await Promise.all(getPromises);
    });

    await t.step("should handle large values", async () => {
      let currentRoot: CodecValue = new Map();
      const largeArray = Array(10000).fill(0).map((
        _,
        i,
      ) => (new Map<string, CodecValue>([
        ["index", i],
        ["data", `data_${i}`],
        ["buffer", new Uint8Array([i % 256])],
      ])));

      currentRoot = await dag.set(currentRoot, ["largeArray"], largeArray);
      const retrieved = await dag.get(currentRoot, ["largeArray"]);
      assertEquals(retrieved, largeArray);
    });
  },
);

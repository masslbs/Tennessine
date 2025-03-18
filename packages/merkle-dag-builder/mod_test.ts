import { assertEquals } from "@std/assert";
import { DAG, type RootValue } from "./mod.ts";
import { MemStore } from "./memstore.ts";
import { assert } from "@std/assert/assert";

Deno.test("meta data", async (t) => {
  await t.step("testing storing and retrieving metadata", async () => {
    const store = new MemStore();
    const dag = new DAG(store);
    await dag.store.objStore.set("pet", "cat");
    const val = await dag.store.objStore.get("pet");
    assertEquals(val, "cat");
  });
});

let root: RootValue = new Map();
const store = new MemStore();

Deno.test("basic set and get ", async (t) => {
  await t.step("Map with string keys", async () => {
    const graph = new DAG(
      store,
    );
    root = graph.set(root, ["c"], "cat");
    const val = await graph.get(root, ["c"]);
    assertEquals(val, "cat");
  });

  await t.step("Map with Uint8Array keys", async () => {
    const graph = new DAG(
      store,
    );
    const addresses = new Map([
      [new Uint8Array([1, 2, 3]), "address1"],
      [new Uint8Array([4, 5, 6]), "address2"],
    ]);
    root = graph.set(root, ["addresses"], addresses);
    const val = await graph.get(root, ["addresses"]);
    assertEquals(val, addresses);
    const key3 = new Uint8Array([7, 8, 9]);
    root = graph.set(root, ["addresses", key3], "address3");
    const result = await graph.get(root, ["addresses", key3]);
    assertEquals(result, "address3");
  });

  await t.step("A path that does not exist (pathing into a map)", async () => {
    const graph = new DAG(
      store,
    );
    const val = await graph.get(root, ["d"]);
    assertEquals(val, undefined);
  });

  // Changed this to be undefined instead of throw
  await t.step(
    "A path that cannot not exist (trying to path through a string)",
    async () => {
      const graph = new DAG(
        store,
      );
      const r = await graph.get(root, ["c", "d"]);
      assertEquals(r, undefined);
    },
  );
});

Deno.test("should merklize", async (t) => {
  let merkleRoot;
  await t.step("should create a merkle root", async () => {
    const graph = new DAG(
      store,
    );

    merkleRoot = await graph.merklelize(root);
    assert(merkleRoot instanceof Uint8Array);
  });

  await t.step("should load from a merkle root", async () => {
    const graph = new DAG(
      store,
    );

    merkleRoot = await graph.merklelize(root);
    const cat = await graph.get(merkleRoot, ["c"]);
    assert(cat === "cat");
  });
});

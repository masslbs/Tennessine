import { assertEquals, assertRejects } from "@std/assert";
import { Graph, Link } from "./mod.ts";
import { MemStore } from "./memstore.ts";

Deno.test("link", () => {
  const link = new Link({ value: "test" });
  assertEquals(link.value, "test");
  assertEquals(link.modified, true);
});

Deno.test("meta data", async (t) => {
  await t.step("testing storing and retrieving metadata", async () => {
    const store = new MemStore();
    const graph = new Graph({
      store,
    });
    await graph.setMetaData("pet", "cat");
    const val = await graph.getMetaData<string>("pet");
    assertEquals(val, "cat");
  });
});

Deno.test("race ", async (t) => {
  await t.step("testing race conditions", async () => {
    const store = new MemStore();
    let root = new Link({
      value: {
        c: "hello world",
      },
    });

    const graph = new Graph({
      store,
    });
    root = graph.set(root, "/c", "cat");
    const val = await graph.get(root, "c");
    assertEquals(val.node, "cat");
  });
});

Deno.test("testing graph builder", async (t) => {
  const store = new MemStore();
  let hash: Uint8Array;
  await t.step("basic setting and getting", async () => {
    type TA = {
      some: {
        thing: string | { lol: string };
      } | { lol: string };
    };
    let a = new Link({
      value: {
        some: {
          thing: "nested",
        },
      },
    });
    const b = {
      lol: "test",
    };
    const graph = new Graph({
      store,
    });
    a = graph.set(a, "/some/thing/else/here", b);
    const val = await graph.get(a, "/some/thing/else/here");
    assertEquals(b, val.node, "should set a value correctly");
    const expect = {
      some: {
        lol: "test",
      },
    };
    a = graph.set(a, "/some", b);
    await a.pendingWriteOperation;
    assertEquals(expect, a.value, "should set a value correctly");

    const some = await graph.get(a, "some");
    assertEquals(some!.node, {
      lol: "test",
    }, "should traverse objects");

    hash = await graph.merklelize(a);
    const result = await graph.get(a, "some/lol");
    assertEquals(result!.node, "test", "should traverse merkle links");
  });

  await t.step("loading a graph from a hash", async () => {
    const root = new Link({ hash });
    const graph = new Graph({
      store,
    });
    const result = await graph.get(root, "some/lol");
    assertEquals(result!.node, "test", "should traverse merkle links");
  });

  await t.step(
    "flushing the same root multiple time should have the same result",
    async () => {
      const store = new MemStore();
      const root = new Link({ value: ["test"] });
      const graph = new Graph({ store });
      const r1 = await graph.merklelize(root);
      const r2 = await graph.merklelize(root);
      assertEquals(r1, r2);
    },
  );

  await t.step(
    "setting a value as a merkle link",
    async () => {
      const store = new MemStore();
      let root = new Link({ value: {} });
      const graph = new Graph({
        store,
      });
      root = graph.set(
        root,
        "/some/thing/else/here",
        new Link({ value: "test" }),
      );
      let r = await graph.get(root, "/some/thing/else/here");
      assertEquals(r!.node, "test");

      const val = "a different value";
      root = graph.set(
        root,
        "/some/thing/else/here",
        val,
      );
      r = await graph.get(root, "/some/thing/else/here");
      assertEquals(r!.node, val);
    },
  );

  await t.step("blockstore failure", async () => {
    const store = new MemStore();
    const root = new Link({
      hash,
    });
    const graph = new Graph({
      store,
    });
    await assertRejects(() => graph.get(root, "/some"));
  });
});

Deno.test("testing nested links", async (t) => {
  const store = new MemStore();
  let hash: Uint8Array;

  const b = {
    lol: "test",
  };
  await t.step("writing and traversing", async () => {
    let a = new Link({
      value: {
        some: new Link({
          value: {
            thing: "nested",
          },
        }),
      },
    });

    const graph = new Graph({ store });
    a = graph.set(a, "/some/thing/else/here", b);
    const val = await graph.get(a, "/some/thing/else/here");
    assertEquals(val!.node, b, "should set a value correctly");
    hash = await graph.merklelize(a);
  });

  await t.step("loading a graph from a hash", async () => {
    const root = new Link({ hash });
    const graph = new Graph({ store });
    const p1 = graph.get(root, "some/thing/else/here");
    const p2 = graph.get(root, "some/thing/else/here");
    const [r1, r2] = await Promise.all([p1, p2]);
    assertEquals(r1!.node, b, "should traverse merkle links");
    assertEquals(r2!.node, b, "should traverse merkle links");
    assertEquals(
      r2.node === r1.node,
      true,
      "the node should be the same object",
    );
  });
});

Deno.test("testing shared node", async () => {
  const store = new MemStore();
  const b = new Link({
    value: {
      c: "hello world",
    },
  });
  const bb = new Link({
    value: {
      c: "hello world",
    },
  });
  const a = new Link({
    value: {
      d: b,
      f: bb, // if bb is changed to b then this tests fails, not sure if we should fix
    },
  });

  let root = a;
  const graph = new Graph({
    store,
  });
  let result = graph.get(root, "d");
  let result2 = graph.get(root, "f");
  let results = await Promise.all([result, result2]);
  assertEquals(results[0]!.node, {
    c: "hello world",
  });

  assertEquals(results[1]!.node, {
    c: "hello world",
  });

  root = graph.set(root, "/d/c", "doggg");

  await graph.get(root, "d");
  result = graph.get(root, "d");
  result2 = graph.get(root, "f");
  results = await Promise.all([result, result2]);

  assertEquals(results[0]!.node, {
    c: "doggg",
  });

  assertEquals(results[1]!.node, {
    c: "hello world",
  });
});

import { default as Tree, EventEmmiter } from "./mod.ts";
import { assertEquals } from "jsr:@std/assert";

Deno.test("Tree Event Testings", async (t) => {
  await t.step("basic eventemmiter, no tree", () => {
    const emmiter = new EventEmmiter<string>();
    let val;
    const func = (e: string) => {
      val = e;
    };
    emmiter.on(func);
    emmiter.emit("test");
    assertEquals(val, "test", "Event should be dispatched");
    emmiter.off(func);
    emmiter.emit("test2");
    assertEquals(val, "test", "Handler should be removed");
  });
  await t.step("Tree Events!", async () => {
    const tree = new Tree();
    assertEquals(tree.path, "/");
    const { promise, resolve } = Promise.withResolvers();
    let event = "test";
    const f = tree.on("a/b/c/d/e/f", resolve);
    f.emit(event);
    const val = await promise;
    assertEquals(val, event, "Event should be dispatched");

    const d = tree.get("/a/b/c/d")!;
    assertEquals(d.path, "/a/b/c/d");
    let val2;
    d.on((e) => {
      val2 = e;
    });
    event = "test2";
    f.emit(event);
    // const val2 = await promise;
    assertEquals(val2, event, "Event should be dispatched to parents");
  });
  await t.step("meta: subscription observations", () => {
    const tree = new Tree<string>();
    let subArray;
    tree.meta.on((e) => {
      subArray = e;
    });
    let val;
    const func = (e: string) => {
      val = e;
    };
    const f = tree.on("a/b/c/d/e/f", func);
    assertEquals(subArray, [{ subscribe: true, path: "/a/b/c/d/e/f" }]);

    tree.on("a/b", func);
    assertEquals(subArray, [
      { subscribe: true, path: "/a/b" },
      {
        subscribe: false,
        path: "/a/b/c/d/e/f",
      },
    ]);

    tree.off("a/b", func);

    assertEquals(subArray, [
      { subscribe: false, path: "/a/b" },
      {
        subscribe: true,
        path: "/a/b/c/d/e/f",
      },
    ]);

    f.off(func);
    assertEquals(subArray, [
      {
        subscribe: false,
        path: "/a/b/c/d/e/f",
      },
    ]);

    tree.emit("a/b/c/d/e/f", "test");
    assertEquals(val, undefined, "Event should not be dispatched");
  });
});

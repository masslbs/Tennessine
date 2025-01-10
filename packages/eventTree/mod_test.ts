import { Tree } from "./mod.ts";
import { assertEquals } from "jsr:@std/assert";

Deno.test("Tree Event Testings", async (t) => {
  await t.step("", async () => {
    const tree = new Tree();
    assertEquals(tree.path, "/");
    const f = tree.get("/a/b/c/d/e/f");
    const p = new Promise((resolve) => {
      f.addEventListener("test", resolve);
    });
    let event = new Event("test");
    f.dispatchEvent(event);
    const val = await p;
    assertEquals(val, event, "Event should be dispatched");

    const d = tree.get("/a/b/c/d");
    assertEquals(d.path, "/a/b/c/d");
    const pd = new Promise<Event>((resolve) => {
      d.addEventListener("test", resolve);
    });
    event = new Event("test");
    f.dispatchEvent(event);
    const val2 = await pd;
    assertEquals(val2, event, "Event should be dispatched to parents");
    console.log(Tree.getTarget(val2)!.path);
    assertEquals(Tree.getTarget(val2), f);
  });
});

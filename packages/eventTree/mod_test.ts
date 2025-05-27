import { default as Tree, EventEmmiter } from "./mod.ts";
import { assertEquals } from "@std/assert";
import type { codec } from "@massmarket/utils";

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
  await t.step("Tree Events!", () => {
    const tree = new Tree<codec.CodecValue>(0);
    let event;
    const handler = (e: codec.CodecValue) => {
      event = e;
    };
    // should be able to listen and unlisten
    tree.on(handler, ["some", "event"]);
    tree.off(handler, ["some", "event"]);

    // // shouldn't get an event
    const update = new Map([["some", new Map([["event", 1]])]]);
    tree.emit("something");
    assertEquals(event, undefined, "Event should not be dispatched");

    tree.on(handler, ["some", "event"]);

    let parentEvent;
    let calls = 0;
    tree.on((e) => {
      calls++;
      parentEvent = e;
    });

    tree.emit(update);
    assertEquals(event, 1, "Event should be dispatched");
    assertEquals(parentEvent, update, "Event should be dispatched");

    tree.emit(update);
    assertEquals(
      calls,
      1,
      "Event should not be dispatched again if the value is the same",
    );
    tree.off(handler, ["some", "event"]);
    const update2 = new Map([["some", new Map([["event", 2]])]]);
    tree.once((e) => {
      assertEquals(e, update2.get("some"));
    }, ["some"]);
    tree.emit(update2);
    assertEquals(event, 1, "off should work");
    assertEquals(parentEvent, update2);
    const update3 = new Map([["some", new Map([["event", 3]])]]);
    // makes sure once work once
    tree.emit(update3);
  });

  // await t.step("meta: subscription observations", () => {
  //   const tree = new Tree<string>();
  //   let subArray;
  //   tree.meta.on((e) => {
  //     subArray = e;
  //   });
  //   let _val;
  //   const func = (e: string) => {
  //     _val = e;
  //   };
  //   const _f = tree.on(["a", "b", "c", "d", "e", "f"], func);
  //   assertEquals(subArray, [{
  //     subscribe: true,
  //     path: ["a", "b", "c", "d", "e", "f"],
  //   }]);

  //   tree.on(["a", "b"], func);
  //   assertEquals(subArray, [
  //     { subscribe: true, path: ["a", "b"] },
  //     {
  //       subscribe: false,
  //       path: ["a", "b", "c", "d", "e", "f"],
  //     },
  //   ]);

  //   tree.off(["a", "b"], func);

  // assertEquals(subArray, [
  //   { subscribe: false, path: ["a", "b"] },
  //   {
  //     subscribe: true,
  //     path: ["a", "b", "c", "d", "e", "f"],
  //   },
  // ]);

  // f.off(func);
  // assertEquals(subArray, [
  //   {
  //     subscribe: false,
  //     path: ["a", "b", "c", "d", "e", "f"],
  //   },
  // ]);

  // tree.emit(["a", "b", "c", "d", "e", "f"], "test");
  // assertEquals(val, undefined, "Event should not be dispatched");
  // });
});

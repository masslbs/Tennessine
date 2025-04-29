import { assertEquals, assertThrows } from "@std/assert";
import { get, remove, set } from "./reflection.ts";

Deno.test("get - basic object access", () => {
  const obj = { name: "test", age: 25 };
  assertEquals(get(obj, "name"), "test");
  assertEquals(get(obj, "age"), 25);
  assertEquals(get(obj, "nonexistent"), undefined);
});

Deno.test("get - array access", () => {
  const arr = ["a", "b", "c"];
  assertEquals(get(arr, 0), "a");
  assertEquals(get(arr, 1), "b");
  assertEquals(get(arr, 3), undefined);
});

Deno.test("get - Map access", () => {
  const map = new Map<unknown, unknown>([
    ["key1", "value1"],
    [{ complex: "key" }, "value2"],
    [42, "value3"],
  ]);

  assertEquals(get(map, "key1"), "value1");
  // assertEquals(get(map, { complex: "key" }), "value2");
  assertEquals(get(map, 42), "value3");
  assertEquals(get(map, "nonexistent"), undefined);
});

Deno.test("get - primitive values", () => {
  assertEquals(get(42, "anything"), undefined);
  assertEquals(get(null, "anything"), undefined);
  assertEquals(get(undefined, "anything"), undefined);
});

Deno.test("set - basic object modification", () => {
  const obj: Record<string, unknown> = { name: "test" };
  set(obj, "name", "modified");
  set(obj, "age", 30);

  assertEquals(obj.name, "modified");
  assertEquals(obj.age, 30);
});

Deno.test("set - Map modification", () => {
  const map = new Map();
  set(map, "key1", "value1");
  // set(map, { complex: "key" }, "value2");

  assertEquals(map.get("key1"), "value1");
  // assertEquals(get(map, { complex: "key" }), "value2");
});

Deno.test("set - invalid operations", () => {
  assertThrows(
    () => set(42, "prop", "value"),
    Error,
    "Cannot set key prop on 42",
  );

  assertThrows(
    () => set(null, "prop", "value"),
    Error,
    "Cannot set key prop on null",
  );
});

Deno.test("remove - Map elements", () => {
  const b = [1, 2, 3];
  const map = new Map<unknown, string>([
    ["key1", "value1"],
    [new Uint8Array(b), "value2"],
  ]);

  remove(map, "key1");
  assertEquals(map.has("key1"), false);

  remove(map, new Uint8Array(b));
  assertEquals(map.size, 0);
});

Deno.test("remove - Array elements", () => {
  const arr = ["a", "b", "c"];
  remove(arr, 1);
  assertEquals(arr, ["a", "c"]);
});

Deno.test("remove - invalid operations", () => {
  assertThrows(
    () => remove({ prop: "value" }, "prop"),
    Error,
    "Cannot remove key prop from [object Object]",
  );

  assertThrows(
    () => remove(42, "anything"),
    Error,
    "Cannot remove key anything from 42",
  );
});

Deno.test("set - Map with existing complex key", () => {
  const map = new Map();
  const complexKey = new Uint8Array([1, 2, 3]);
  set(map, complexKey, "initial");
  set(map, new Uint8Array([1, 2, 3]), "updated");

  assertEquals(get(map, new Uint8Array([1, 2, 3])), "updated");
  assertEquals(map.size, 1); // Should not create duplicate entries
});

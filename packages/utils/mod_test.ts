import { assertEquals } from "@std/assert";
import * as Utils from "./mod.ts";

Deno.test("objectId should be the 8 bytes", () => {
  const id = Utils.objectId();
  assertEquals(id.length, 8);
});

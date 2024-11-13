import { assertEquals } from "jsr:@std/assert";
import { toHex } from "viem";
import * as Utils from "./mod.ts";

Deno.test("objectId should be the 8 bytes", () => {
  const id = Utils.objectId();
  assertEquals(id.length, 8);
});

Deno.test("padBytes should pad the message to the given length", () => {
  const msg = BigInt(123);
  assertEquals(toHex(msg), "0x7b");
  const padded = Utils.padUint256(msg);
  assertEquals(padded.length, 32);
  assertEquals(
    toHex(padded),
    "0x000000000000000000000000000000000000000000000000000000000000007b",
  );
});

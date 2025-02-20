import { assertEquals } from "jsr:@std/assert";
import { StoreSchema } from "./schema.ts";
import { MemStore } from "@nullradix/merkle-dag-builder/memstore";
import { Link } from "@nullradix/merkle-dag-builder";
import Database from "./mod.ts";

Deno.test("Database Testings", async (t) => {
  await t.step("create a database", () => {
    const root = new Link({ value: "root" });
    const store = new MemStore();
    const _db = new Database({ store, schema: StoreSchema, root });
  });

  await t.step("add a relay and set a key and retrieve it", async () => {
    const _root = new Link({ value: "root" });
    const store = new MemStore();
    const db = new Database({
      store,
      schema: StoreSchema,
      id: 1111,
    });
    await db.open();
    db.set("key", "value");
    const value = await db.get("key");
    assertEquals(value, "value");
  });
});

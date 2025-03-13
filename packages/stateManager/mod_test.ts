import { ShopSchema } from "@massmarket/schema/cbor";
import { MemStore } from "@massmarket/merkle-dag-builder/memstore";
import StateManager from "./mod.ts";
import { assertEquals } from "@std/assert";
import { decodeCbor } from "@std/cbor";

const ManifestOkayTest = await fetch(
  `file://${Deno.env.get("MASS_TEST_VECTORS")}/vectors/ManifestOkay.cbor`,
);

const ManifestOkayTestBytes = await ManifestOkayTest.bytes();
const manifest = decodeCbor(ManifestOkayTestBytes);

Deno.test("Database Testings", async (t) => {
  await t.step("create a database and a Manifest", async () => {
    const store = new MemStore();
    const db = new StateManager({
      store,
      schema: ShopSchema,
      objectId: manifest.ShopID,
    });
    db.set("Manifest", manifest);
    const result = await db.get("Manifest");
    assertEquals(result, manifest);
  });

  await t.step("add a relay and set a key and retrieve it", async () => {
    // const _root = new Link({ value: "root" });
    // const store = new MemStore();
    // const db = new Database({
    //   store,
    //   schema: ShopSchema,
    //   id: 1111,
    // });
    // await db.open();
    // db.set("key", "value");
    // const value = await db.get("key");
    // assertEquals(value, "value");
  });
});

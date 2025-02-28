// import { assertEquals } from "jsr:@std/assert";
import { ShopSchema } from "@massmarket/schema/cbor";
import { MemStore } from "@massmarket/merkle-dag-builder/memstore";
// import { Link } from "@massmarket/merkle-dag-builder";
import Database from "./mod.ts";
const manifest = {
  "ShopID": BigInt(
    2463539455n,
  ),
  "Payees": {
    1337: {
      "0x0000000000000000000000000000000000000000": {
        isContract: true,
        description: "My main wallet",
      },
    },
  },
  "AcceptedCurrencies": {
    1337: {
      "0x0000000000000000000000000000000000000000": null,
      "0x0000000000000000000000000000000000000001": null,
      "0x0000000000000000000000000000000000000002": null,
    },
    2: {
      "0x0000000000000000000000000000000000000000": null,
    },
  },
  "PricingCurrency": {
    "ChainID": 1337,
    "Address": "0x0000000000000000000000000000000000000000",
  },
  "ShippingRegions": {
    "default": {
      "Country": "DE",
      "Postcode": "",
      "City": "",
      "PriceModifiers": null,
    },
  },
};

Deno.test("Database Testings", async (t) => {
  await t.step("create a database", async () => {
    const store = new MemStore();
    const db = new Database({
      store,
      schema: ShopSchema,
      objectId: manifest.ShopID,
    });
    await db.set("Manifest", manifest);
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

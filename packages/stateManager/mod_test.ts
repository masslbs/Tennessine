import { hexToBytes } from "npm:viem";

import { ShopSchema } from "@massmarket/schema/cbor";
import { MemStore } from "@massmarket/merkle-dag-builder/memstore";
import StateManager from "./mod.ts";
import { assertEquals } from "@std/assert";
import { decodeCbor } from "@std/cbor";

// const ManifestOkayTest = await fetch(
//   `file://${Deno.env.get("MASS_TEST_VECTORS")}/vectors/ManifestOkay.cbor`,
// );

// const ManifestOkayTestBytes = await ManifestOkayTest.bytes();
// const manifest = decodeCbor(ManifestOkayTestBytes);

const manifest = new Map([
  ["ShopID", 2463539455555n],
  [
    "Payees",
    new Map([
      [
        1337,
        new Map([
          [
            hexToBytes("0x0000000000000000000000000000000000000000"),
            new Map([
              ["isContract", true],
              ["description", "My main wallet"],
            ]),
          ],
        ]),
      ],
    ]),
  ],
  [
    "AcceptedCurrencies",
    new Map([
      [
        1337,
        new Map([
          [hexToBytes("0x0000000000000000000000000000000000000000"), null],
          [hexToBytes("0x0000000000000000000000000000000000000001"), null],
          [hexToBytes("0x0000000000000000000000000000000000000002"), null],
        ]),
      ],
      [
        2,
        new Map([
          [hexToBytes("0x0000000000000000000000000000000000000000"), null],
        ]),
      ],
    ]),
  ],
  [
    "PricingCurrency",
    new Map([
      ["ChainID", 1337],
      ["Address", "0x0000000000000000000000000000000000000000"],
    ]),
  ],
  [
    "ShippingRegions",
    new Map([
      [
        "default",
        new Map([
          ["Country", "DE"],
          ["Postcode", ""],
          ["City", ""],
          ["PriceModifiers", null],
        ]),
      ],
    ]),
  ],
]);

// const listing1 = {
//   "ID": 234,
//   "Name": "testingvalue",
//   "Metadata": {
//     "Title": "testingvalue",
//     "Description": "testingvalue",
//     "Images": ["testingvalue"],
//   },
//   "Price": 100,
//   "ViewState": 1,
//   "Options": [],
//   "StockStatus": "In Stock",
// };


const listing1 = {
  "ID": 234,
  "Name": "testingvalue",
  "Metadata": {
    "Title": "testingvalue",
    "Description": "testingvalue",
    "Images": ["testingvalue"],
  },
  "Price": 100,
  "ViewState": 1,
  "Options": [],
  "StockStatus": "In Stock",
};

Deno.test("Database Testings", async (t) => {
  await t.step("create a database and a Manifest", async () => {
    const store = new MemStore();
    const db = new StateManager({
      store,
      schema: ShopSchema,
      objectId: manifest.get("ShopID") as bigint,
    });
    await db.set(["Manifest"], manifest);
    // db.set(['Listings', "234"], listings1)
    const result = await db.get(["Manifest"]);
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

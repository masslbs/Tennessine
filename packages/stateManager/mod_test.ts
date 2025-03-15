import { hexToBytes } from "@wevm/viem";
import { assertEquals } from "@std/assert";
import { MemStore } from "@massmarket/merkle-dag-builder/memstore";
import type { codec } from "@massmarket/utils";
import { createTestClients } from "@massmarket/client/test";
import StateManager from "./mod.ts";

// const ManifestOkayTest = await fetch(
//   `file://${Deno.env.get("MASS_TEST_VECTORS")}/vectors/ManifestOkay.cbor`,
// );

// const ManifestOkayTestBytes = await ManifestOkayTest.bytes();
// const manifest = decodeCbor(ManifestOkayTestBytes);

const manifest = new Map<string, codec.CodecValue>([
  ["ShopID", 2463539455555n],
  [
    "Payees",
    new Map([
      [
        1337,
        new Map([
          [
            hexToBytes("0x0000000000000000000000000000000000000000"),
            new Map<string, codec.CodecValue>([
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
    new Map<string, codec.CodecValue>([
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


const store = new MemStore();
Deno.test("Database Testings", async (t) => {
  await t.step("create a database and a Manifest", async () => {
    const sm = new StateManager({
      store,
      objectId: manifest.get("ShopID") as bigint,
    });
    const { resolve, promise } = Promise.withResolvers();
    sm.events.on(["Manifest"], resolve);
    await sm.set(["Manifest"], manifest);
    const result = await sm.get(["Manifest"]);
    assertEquals(result, manifest);
    const pr = await promise;
    assertEquals(result, pr);
  });


  await t.step("add a relay and set a key and retrieve it", async () => {
    const { relayClient } = await createTestClients();
    const sm = new StateManager({
      store,
      objectId: relayClient.shopId,
    });
    // connect to the relay
    const { resolve, promise } = Promise.withResolvers();
    sm.events.on(["Manifest"], (manifestPatch) => {
      console.log(manifestPatch);
      resolve(manifestPatch);
    });

    await sm.addConnection(relayClient);
    await promise;
    await sm.set(
      ["Manifest", "ShippingRegions", "default"],
      new Map([
        ["City", ""],
        ["Country", "DE"],
        ["PostalCode", ""],
        ["PriceModifiers", null],
      ]),
    );
    const value = await sm.get(["Manifest", "ShippingRegions", "default"]);
    assertEquals(value, "value");
  });
});

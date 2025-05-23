import StateManager from "./mod.ts";
import { MemStore } from "@massmarket/store";
import type { PushedPatchSet } from "@massmarket/client";
import type { CodecValue, Path } from "@massmarket/utils/codec";
import { extractEntriesFromHAMT, fetchAndDecode } from "@massmarket/utils";
import { assertEquals } from "@std/assert/equals";

Deno.test("Database Testings", async (t) => {
  const testFiles = [
    "ManifestOkay",
    "ListingOkay",
    "OrderOkay",
    "ShopOkay",
    "InventoryOkay",
    "UserFlows/SimpleShoppingTrip",
  ];

  const skippedTest = new Set(
    [
      // similar array issue to below. How to deal with appending to an "empty" array
      "TestGenerateVectorsShopOkay/append-listing-image",
      "TestGenerateVectorsShopOkay/add-tag",
      "TestGenerateVectorsShopOkay/append-listing-to-tag",
      "TestGenerateVectorsShopOkay/append-listing-to-tag2",
    ],
  );

  const skippedAfterCheck = new Set(
    [
      /* Related to Issue #342: figure out how to handle big IDs
      "Listings" => Map(3) {
        -       18446744073709551615n => Map(4) {
        +       18446744073709552000 => Map(4) {
      */
      "TestGenerateVectorsShopOkay/biggest_item_ID",
      "TestGenerateVectorsShopOkay/add-order",
      "TestGenerateVectorsShopOkay/add-order2",
      "TestGenerateVectorsShopOkay/biggest_order_ID",
      "TestGenerateVectorsShopOkay/biggest_item_ID#01",

      "TestGenerateVectorsManifestOkay/remove_a_payee", // this removes the last payee from the manifest. The stateManager leaves an empty Map, while the tests do not.
      "TestGenerateVectorsManifestOkay/remove_a_shipping_region", // same
      "TestGenerateVectorsListingOkay/remove_an_image", // same but with an array
      "TestGenerateVectorsListingOkay/replace_expectedInStockBy", // the tests vectors automatically remove an instock field
      "TestGenerateVectorsListingOkay/remove_stock_status", // removing the last item of an array
      "TestGenerateVectorsListingOkay/remove_an_option", // removing the last item from a map
    ],
  );

  for (const testFile of testFiles) {
    await t.step(testFile, async (tt) => {
      const rawTestVector = await fetchAndDecode(testFile) as Map<
        string,
        unknown
      >;
      const snapShots = rawTestVector.get("Snapshots") as Map<
        string,
        Map<string, CodecValue>
      >[];
      const rawPatchSet = rawTestVector.get("PatchSet") as Map<
        string,
        unknown
      >;
      const id = (rawPatchSet.get("Header") as Map<string, unknown>).get(
        "ShopID",
      ) as bigint;
      const testVectors = createtestvectors(
        snapShots,
        rawPatchSet,
      );
      let passing = true;
      for (const test of testVectors) {
        if (passing && !skippedTest.has(test.description)) {
          passing = await tt.step(test.description, async () => {
            const store = new MemStore();
            const before = test.snapshot.before;
            const after = test.snapshot.after;
            const sm = new StateManager({
              store,
              id,
              defaultState: before,
            });
            await sm.open();
            const stream = sm.createWriteStream();
            const writer = stream.getWriter();
            await writer.write(test.patchSet);
            await writer.close();
            if (skippedAfterCheck.has(test.description)) {
              console.log("Skipping state check!!!!!!!");
            } else {
              const r = await sm.root;
              assertEquals(r, after);
            }
            await sm.close();
          });
        }
      }
    });
  }
});

function createtestvectors(
  snapShots: Map<string, CodecValue>[],
  patchSet: Map<string, unknown>,
): {
  description: string;
  snapshot: {
    before: CodecValue;
    after: CodecValue;
  };
  patchSet: PushedPatchSet;
}[] {
  const header = patchSet.get("Header") as CodecValue;

  function fixListings(vector: Map<string, CodecValue>) {
    ["Orders", "Listings", "Accounts", "Inventory"].forEach((key) => {
      const val = extractEntriesFromHAMT(
        vector.get(key),
      ) as CodecValue;
      vector.set(key, val);
    });
    return vector;
  }

  return (patchSet.get("Patches") as Map<string, unknown>[]).map(
    (patch, i) => {
      const snapshot = snapShots[i] as Map<
        string,
        unknown
      >;
      const [before, after] = ["Before", "After"].map((key) => {
        const a = snapshot.get(key)! as Map<string, Map<string, CodecValue>>;
        const val = a.get("Value")!;
        return fixListings(val);
      });

      return {
        description: snapshot!.get("Name") as string,
        snapshot: {
          before,
          after,
        },
        patchSet: {
          patches: [{
            Op: patch.get("Op") as "add" | "remove" | "replace",
            Path: patch.get("Path") as Path,
            Value: patch.get("Value") as CodecValue,
          }],
          header,
          signer: "0xdeafbeef",
          sequence: 0,
        },
      };
    },
  );
}

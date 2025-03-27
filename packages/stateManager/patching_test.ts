import StateManager from "./mod.ts";
import { MemStore } from "@massmarket/store";
import type { Patch, PushedPatchSet } from "@massmarket/client";
import type { CodecValue, Path } from "@massmarket/utils/codec";
import { extractEntriesFromHAMT, fetchAndDecode } from "@massmarket/utils";

Deno.test("Database Testings", async (t) => {
  const testFiles = [
    // "ManifestOkay",
    "ListingOkay",
    // "OrderOkay",
    // "ShopOkay",
    // "InventoryOkay",
    // "UserFlows/SimpleShoppingTrip",
  ];

  for (const testFile of testFiles) {
    await t.step(testFile, async () => {
      const store = new MemStore();
      const testVector = await fetchAndDecode(testFile) as Map<
        string,
        unknown
      >;
      const snapShots = testVector.get("Snapshots") as Map<
        string,
        Map<string, CodecValue>
      >[];
      const root = snapShots[0].get("Before")!.get("Value") as Map<
        string,
        CodecValue
      >;
      const listings = extractEntriesFromHAMT(
        root!.get("Listings"),
      ) as CodecValue;
      root.set("Listings", listings);
      const rawPatchSet = testVector.get("PatchSet") as Map<string, unknown>;
      const objectId = (rawPatchSet.get("Header") as Map<string, unknown>).get(
        "ShopID",
      ) as bigint;

      const patchSet = patchSetToPushedPatchSet(
        rawPatchSet,
      );
      const db = new StateManager({
        store,
        objectId,
        root,
      });
      await db.open();

      const stream = db.createWriteStream("tests", []);
      const writer = stream.getWriter();
      // console.log(patchSet);
      await writer.write(patchSet);
      await writer.close();
    });
  }
});

function patchSetToPushedPatchSet(
  patchSet: Map<string, unknown>,
): PushedPatchSet {
  const patches = (patchSet.get("Patches") as Map<string, unknown>[]).map(
    (patch): Patch => {
      return {
        Op: patch.get("Op") as "add" | "remove" | "replace",
        Path: patch.get("Path") as Path,
        Value: patch.get("Value") as CodecValue,
      };
    },
  );
  return {
    signer: "0xdeafbeef",
    patches,
    header: patchSet.get("Header") as CodecValue,
    sequence: 0,
  };
}

import StateManager from "./mod.ts";
import { MemStore } from "@massmarket/store";
import type { Patch, PushedPatchSet } from "@massmarket/client";
import type { CodecValue, Path } from "@massmarket/utils/codec";
import { fetchAndDecode } from "@massmarket/utils";

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
      const manifestVector = await fetchAndDecode(testFile);
      const manifests = (manifestVector.get("Snapshots"))?.map((snapshot) => {
        return snapshot?.get("After")?.get("Value")?.get("Manifest");
      }) || [];
      const patchSet = patchSetToPushedPatchSet(
        manifestVector!.get("PatchSet") as unknown as Map<
          string,
          Map<string, unknown>[]
        >,
      );
      const db = new StateManager({
        store,
        objectId: (manifests as Map<string, bigint>[])[0].get("ShopID")!,
      });
      await db.open();
      await db.set(["Manifest"], (manifests as Map<string, bigint>[])[0]);

      const stream = db.createWriteStream("tests", []);
      const writer = stream.getWriter();
      console.log(patchSet);
      await writer.write(patchSet);

      await writer.close();
    });
  }
});

function patchSetToPushedPatchSet(
  patchSet: Map<string, Map<string, unknown>[]>,
): PushedPatchSet {
  const patches = patchSet.get("Patches")!.map((patch): Patch => {
    return {
      Op: patch.get("Op") as "add" | "remove" | "replace",
      Path: patch.get("Path") as Path,
      Value: patch.get("Value") as CodecValue,
    };
  });
  return {
    signer: "0xdeafbeef",
    patches,
    header: patchSet.get("Header") as CodecValue,
    sequence: 0,
  };
}

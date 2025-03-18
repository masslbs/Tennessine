import { MemStore } from "@massmarket/merkle-dag-builder/memstore";

import StateManager from "./mod.ts";
import { type Patch, PushedPatchSet } from "@massmarket/client";
import { type CodecValue } from "@massmarket/utils/codec";
import { fetchAndDecode } from "@massmarket/utils";

Deno.test("Database Testings", async (t) => {
  const testFiles = [
    "ManifestOkay",
    "ListingOkay",
    "OrderOkay",
    "ShopOkay",
    "InventoryOkay",
    "UserFlows/SimpleShoppingTrip",
  ];

  for (const testFile of testFiles) {
    await t.step(testFile, async () => {
      const store = new MemStore();
      const manifestVector = await fetchAndDecode(testFile);
      const manifests =
        manifestVector.get("Snapshots")?.map((snapshot: any) => {
          return snapshot.get("After").get("Value").get("Manifest");
        }) || [];
      const patchSet = patchSetToPushedPatchSet(manifestVector.get("PatchSet"));
      const db = new StateManager({
        store,
        objectId: manifests[0].get("ShopID") as bigint,
      });

      await db.set(["Manifest"], manifests[0]);

      const stream = db.createWriteStream("vector-test");
      const writer = stream.getWriter();
      await writer.write(patchSet);

      await writer.close();
    });
  }
});

function patchSetToPushedPatchSet(patchSet: Map<string, any>): PushedPatchSet {
  const patches = patchSet.get("Patches").map((patch: any): Patch => {
    return {
      Op: patch.get("Op"),
      Path: patch.get("Path"),
      Value: patch.get("Value"),
    };
  });
  return {
    signer: "0xdeafbeef",
    patches,
    header: patchSet.get("Header") as CodecValue,
    sequence: 0,
  };
}

import StateManager from "./mod.ts";
import { MemStore } from "@massmarket/store";
import type { PushedPatchSet } from "@massmarket/client";
import type { CodecValue, Path } from "@massmarket/utils/codec";
import { extractEntriesFromHAMT, fetchAndDecode } from "@massmarket/utils";
import { assertEquals } from "@std/assert/equals";

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
    await t.step(testFile, async (tt) => {
      const store = new MemStore();
      const rawTestVector = await fetchAndDecode(testFile) as Map<
        string,
        unknown
      >;
      const snapShots = rawTestVector.get("Snapshots") as Map<
        string,
        Map<string, CodecValue>
      >[];
      const rawPatchSet = rawTestVector.get("PatchSet") as Map<string, unknown>;
      const id = (rawPatchSet.get("Header") as Map<string, unknown>).get(
        "ShopID",
      ) as bigint;

      const testVectors = createtestvectors(
        snapShots,
        rawPatchSet,
      );
      for (const test of testVectors) {
        await tt.step(test.description, async () => {
          const before = test.snapshot.before;
          const after = test.snapshot.after;
          const sm = new StateManager({
            store,
            id,
          });
          await sm.open(before);
          const stream = sm.createWriteStream("tests", []);
          const writer = stream.getWriter();
          console.log("Before writing patch set", before);
          console.log("After writing patch set", after);
          console.log("Writing patch set", test.patchSet);
          await writer.write(test.patchSet);
          await writer.close();
          assertEquals(sm.root, after);
          await sm.close();
        });
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
    const listings = extractEntriesFromHAMT(
      vector.get("Listings"),
    ) as CodecValue;
    vector.set("Listings", listings);
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

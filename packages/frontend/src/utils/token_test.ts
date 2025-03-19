import { assertEquals } from "@std/assert";
import { compareAddedRemovedChains } from "./token.ts";
import { TokenAddress } from "../types.ts";

Deno.test("compareAddedRemovedChains", async (t) => {
  await t.step("should correctly identify added and removed chains", () => {
    const originalMap = new Map([
      [1, {
        "0x123": null,
        "0x456": null,
        "0x555": null,
      }],
      [2, {
        "0x789": null,
        "0x123": null,
      }],
    ]);

    const modifiedMap = new Map([
      [1, {
        "0x456": null,
        "0x789": null,
      }],
      [2, {
        "0x123": null,
        "0x777": null,
      }],
    ]);

    const result = compareAddedRemovedChains(originalMap, modifiedMap);

    assertEquals(result.removed, [
      { Address: "0x123" as TokenAddress, chainID: 1 },
      { Address: "0x555" as TokenAddress, chainID: 1 },
      { Address: "0x789" as TokenAddress, chainID: 2 },
    ]);
    assertEquals(result.added, [
      { Address: "0x789" as TokenAddress, chainID: 1 },
      { Address: "0x777" as TokenAddress, chainID: 2 },
    ]);
  });

  await t.step("should handle completely different arrays", () => {
    const originalMap = new Map([
      [1, {
        "0x123": null,
      }],
    ]);

    const modifiedMap = new Map([
      [2, {
        "0x456": null,
      }],
    ]);

    const result = compareAddedRemovedChains(originalMap, modifiedMap);

    assertEquals(result.removed, [
      { Address: "0x123" as TokenAddress, chainID: 1 },
    ]);
    assertEquals(result.added, [
      { Address: "0x456" as TokenAddress, chainID: 2 },
    ]);
  });
});

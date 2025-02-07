import { assertEquals } from "jsr:@std/assert";
import { compareAddedRemovedChains } from "./token.ts";
import { TokenAddr } from "../types.ts";

Deno.test("compareAddedRemovedChains", async (t) => {
  await t.step("should correctly identify added and removed chains", () => {
    const originalArray = [
      { address: "0x123" as TokenAddr, chainId: 1 },
      { address: "0x456" as TokenAddr, chainId: 1 },
    ];

    const modifiedArray = [
      { address: "0x456" as TokenAddr, chainId: 1 },
      { address: "0x789" as TokenAddr, chainId: 1 },
    ];

    const result = compareAddedRemovedChains(originalArray, modifiedArray);

    assertEquals(result.removed, [
      { address: "0x123" as TokenAddr, chainId: 1 },
    ]);
    assertEquals(result.added, [
      { address: "0x789" as TokenAddr, chainId: 1 },
    ]);
  });

  await t.step("should handle completely different arrays", () => {
    const originalArray = [
      { address: "0x123" as TokenAddr, chainId: 1 },
    ];

    const modifiedArray = [
      { address: "0x456" as TokenAddr, chainId: 2 },
    ];

    const result = compareAddedRemovedChains(originalArray, modifiedArray);

    assertEquals(result.removed, [
      { address: "0x123" as TokenAddr, chainId: 1 },
    ]);
    assertEquals(result.added, [
      { address: "0x456" as TokenAddr, chainId: 2 },
    ]);
  });
});

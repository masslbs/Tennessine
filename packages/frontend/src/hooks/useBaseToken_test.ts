import "../happyDomSetup.ts";
import { assertEquals } from "@std/assert";
import { cleanup, renderHook, waitFor } from "@testing-library/react";

import { allManifests } from "@massmarket/schema/testFixtures";
import { ChainAddress } from "@massmarket/schema";

import { createRouterWrapper } from "../testutils/mod.tsx";
import { useBaseToken } from "./useBaseToken.ts";

Deno.test("useBaseToken", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async (t) => {
  await t.step("should return correct base token information", async () => {
    const { wrapper, stateManager } = await createRouterWrapper();

    await stateManager.set(["Manifest"], allManifests[0]!);
    const chainCurrency = new ChainAddress(0, new Uint8Array(20));
    await stateManager.set(
      ["Manifest", "PricingCurrency"],
      // @ts-ignore TODO: add BaseClass to CodecValue
      chainCurrency,
    );

    const { result, unmount } = renderHook(() => useBaseToken(), {
      wrapper,
    });

    await waitFor(() => {
      const { baseToken } = result.current;

      assertEquals(baseToken.symbol, "ETH");
      assertEquals(baseToken.decimals, 18);
    });

    unmount();
  });

  cleanup();
});

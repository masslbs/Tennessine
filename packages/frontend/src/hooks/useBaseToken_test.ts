import { assertEquals } from "jsr:@std/assert";
import { GlobalRegistrator } from "npm:@happy-dom/global-registrator";
import { cleanup, renderHook, waitFor } from "@testing-library/react";

import { addresses } from "@massmarket/contracts";
import { payees, shippingRegions } from "@massmarket/utils/test";
import { random256BigInt } from "@massmarket/utils";

import { createRouterWrapper } from "../utils/mod.ts";
import { useBaseToken } from "./useBaseToken.ts";

Deno.test("useBaseToken", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async (t) => {
  GlobalRegistrator.register({});

  await t.step("should return correct base token information", async () => {
    const { wrapper, csm } = await createRouterWrapper();
    await csm.stateManager!.manifest.create({
      acceptedCurrencies: [{
        chainId: 1,
        address: addresses.zeroAddress,
      }],
      pricingCurrency: { chainId: 1, address: addresses.zeroAddress },
      payees,
      shippingRegions,
    }, random256BigInt());
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

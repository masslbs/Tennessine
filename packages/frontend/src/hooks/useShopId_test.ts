import "../happyDomSetup.ts";
import { assertEquals } from "@std/assert";
import { cleanup, renderHook, waitFor } from "@testing-library/react";

import { random256BigInt } from "@massmarket/utils";

import { useShopId } from "./useShopId.ts";
import { createRouterWrapper } from "../testutils/mod.tsx";

Deno.test(
  "useShopId",
  { sanitizeResources: false, sanitizeOps: false },
  async (t) => {
    await t.step("should return shopId from search params", async () => {
      const shopId = random256BigInt();
      const { wrapper } = await createRouterWrapper({ shopId });
      const { result, unmount } = renderHook(() => useShopId(), { wrapper });
      await waitFor(() => {
        assertEquals(result.current.shopId, shopId);
      });
      unmount();
      cleanup();
    });
    cleanup();
  },
);

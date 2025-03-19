import "../happyDomSetup.ts";
import { assertEquals } from "@std/assert";
import { cleanup, renderHook } from "@testing-library/react-hooks";

import { random256BigInt } from "@massmarket/utils";

import { useShopId } from "./useShopId.ts";
import { createRouterWrapper } from "../utils/mod.ts";

Deno.test(
  "useShopId",
  { sanitizeResources: false, sanitizeOps: false },
  async (t) => {
    await t.step("should return null if no shopId is provided", async () => {
      const { wrapper } = await createRouterWrapper();
      const { result, unmount } = renderHook(() => useShopId(), { wrapper });
      assertEquals(result.current.shopId, null);
      unmount();
    });
    await t.step("should return shopId from search params", async () => {
      const shopId = random256BigInt();
      const { wrapper } = await createRouterWrapper(shopId);
      const { result, unmount } = renderHook(() => useShopId(), { wrapper });
      assertEquals(result.current.shopId, shopId);
      unmount();
      cleanup();
    });
    cleanup();
  },
);

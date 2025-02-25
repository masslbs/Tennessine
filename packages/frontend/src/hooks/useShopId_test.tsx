import { assertEquals } from "jsr:@std/assert";
import { cleanup, renderHook } from "@testing-library/react-hooks";
import { GlobalRegistrator } from "npm:@happy-dom/global-registrator";

import { random256BigInt } from "@massmarket/utils";

import { useShopId } from "./useShopId.ts";
import { createRouterWrapper } from "../utils/mod.ts";

Deno.test(
  "useShopId",
  { sanitizeResources: false, sanitizeOps: false },
  async (t) => {
    GlobalRegistrator.register({});
    await t.step("should return null if no shopId is provided", async () => {
      const { wrapper } = await createRouterWrapper();
      const { result } = renderHook(() => useShopId(), { wrapper });
      assertEquals(result.current.shopId, null);
    });
    await t.step("should return shopId from search params", async () => {
      const shopId = random256BigInt();
      const { wrapper } = await createRouterWrapper(shopId);
      const { result, unmount } = renderHook(() => useShopId(), { wrapper });
      assertEquals(result.current.shopId, shopId);
      unmount();
    });

    cleanup();
    await GlobalRegistrator.unregister();
  },
);

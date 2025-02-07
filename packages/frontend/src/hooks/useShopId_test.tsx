import { assertEquals } from "jsr:@std/assert";
import { cleanup, renderHook } from "@testing-library/react-hooks";
import { GlobalRegistrator } from "npm:@happy-dom/global-registrator";
import { useShopId } from "./useShopId.js";
import { createRouterWrapper } from "../utils/mod.js";

Deno.test("useShopId", async (t) => {
  GlobalRegistrator.register({});
  await t.step("should return null if no shopId is provided", () => {
    const wrapper = createRouterWrapper();
    const { result } = renderHook(() => useShopId(), { wrapper });
    assertEquals(result.current.shopId, null);
  });
  await t.step("should return shopId from search params", () => {
    const wrapper = createRouterWrapper("123");
    const { result, unmount } = renderHook(() => useShopId(), { wrapper });
    assertEquals(result.current.shopId, BigInt("123"));
    unmount();
  });

  cleanup();
  await GlobalRegistrator.unregister();
});

import "../happyDomSetup.ts";
import { assertEquals } from "@std/assert";
import { cleanup, renderHook, waitFor } from "@testing-library/react";

import { random256BigInt } from "@massmarket/utils";

import { useClientWithStateManager } from "./useClientWithStateManager.ts";
import { createRouterWrapper } from "../utils/test.tsx";

Deno.test("useClientWithStateManager", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async (t) => {
  await t.step("should return client when shopId is provided", async () => {
    const shopId = random256BigInt();
    const { wrapper } = await createRouterWrapper(shopId);

    const { result, unmount } = renderHook(() => useClientWithStateManager(), {
      wrapper,
    });

    await waitFor(() => {
      assertEquals(typeof result.current.clientStateManager, "object");
      assertEquals(result.current.clientStateManager !== null, true);
      assertEquals(result.current.clientStateManager!.shopId, shopId);
    });

    unmount();
  });

  cleanup();
});

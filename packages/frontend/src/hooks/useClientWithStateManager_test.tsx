import { assertEquals } from "jsr:@std/assert";
import { cleanup, renderHook, waitFor } from "npm:@testing-library/react";
import { GlobalRegistrator } from "npm:@happy-dom/global-registrator";

import { useClientWithStateManager } from "./useClientWithStateManager.ts";
import { createRouterWrapper } from "../utils/test.tsx";

Deno.test("useClientWithStateManager", async (t) => {
  GlobalRegistrator.register({});

  await t.step("should return client when shopId is provided", async () => {
    const { wrapper } = await createRouterWrapper("123");

    const { result, unmount } = renderHook(() => useClientWithStateManager(), {
      wrapper,
    });

    await waitFor(() => {
      assertEquals(typeof result.current.clientStateManager, "object");
      assertEquals(result.current.clientStateManager !== null, true);
      assertEquals(result.current.clientStateManager.shopId, BigInt(123));
    });

    unmount();
  });

  cleanup();
  await GlobalRegistrator.unregister();
});

import { assertEquals } from "jsr:@std/assert";
import { cleanup, renderHook, waitFor } from "@testing-library/react";
import { GlobalRegistrator } from "npm:@happy-dom/global-registrator";
import { connect } from "npm:wagmi/actions";

import { useClientWithStateManager } from "./useClientWithStateManager.ts";
import { config, createRouterWrapper } from "../utils/test.tsx";

Deno.test("useClientWithStateManager", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async (t) => {
  GlobalRegistrator.register({});

  await t.step("should return client when shopId is provided", async () => {
    Deno.env.set("VITE_RELAY_TOKEN_ID", "0x123");
    Deno.env.set("VITE_RELAY_ENDPOINT", "ws://localhost:4444/v3");
    const { wrapper } = await createRouterWrapper("123");
    await connect(config, { connector: config.connectors[0] });

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

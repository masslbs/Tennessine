import { assertEquals } from "jsr:@std/assert";
import { cleanup, renderHook } from "@testing-library/react-hooks";
import { waitFor } from "@testing-library/react";
import { GlobalRegistrator } from "npm:@happy-dom/global-registrator";
import { useRelayEndpoint } from "./useRelayEndpoint.ts";

Deno.test("useRelayEndpoint", async (t) => {
  GlobalRegistrator.register({});

  await t.step("If no env vars, call discoverRelay fn", async () => {
    const { result, unmount } = renderHook(() => useRelayEndpoint());

    await waitFor(() => {
      assertEquals(!!result.current.relayEndpoint, true);
    });
    unmount();
  });

  cleanup();
  await GlobalRegistrator.unregister();
});

import "../happyDomSetup.ts";
import { assertEquals } from "jsr:@std/assert";
import { cleanup, renderHook } from "@testing-library/react-hooks";
import { waitFor } from "@testing-library/react";
import { useRelayEndpoint } from "./useRelayEndpoint.ts";

Deno.test("useRelayEndpoint", async (t) => {
  await t.step("If no env vars, call discoverRelay fn", async () => {
    const { result, unmount } = renderHook(() => useRelayEndpoint());
    await waitFor(() => {
      assertEquals(!!result.current.relayEndpoint, true);
    });
    unmount();
  });

  cleanup();
});

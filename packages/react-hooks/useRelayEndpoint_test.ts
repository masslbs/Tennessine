import { assertEquals } from "@std/assert";
import { renderHook, waitFor } from "@testing-library/react";
import { useRelayEndpoint } from "./useRelayEndpoint.ts";
import { register, unregister } from "./happyDomSetup.ts";
import { createWrapper } from "./_createWrapper.tsx";

Deno.test("useRelayEndpoint", async (t) => {
  register();
  await t.step("If no env vars, call discoverRelay fn", async () => {
    const { result } = renderHook(() => useRelayEndpoint(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => {
      assertEquals(!!result.current.relayEndpoint, true);
    });
  });
  await unregister();
});

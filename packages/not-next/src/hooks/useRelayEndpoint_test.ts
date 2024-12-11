import { assertEquals } from "jsr:@std/assert";
import { cleanup, renderHook } from "@testing-library/react-hooks";
import { useRelayEndpoint } from "./useRelayEndpoint.ts";
import { GlobalRegistrator } from "npm:@happy-dom/global-registrator";

Deno.test("useRelayEndpoint", async (t) => {
  GlobalRegistrator.register({});

  await t.step(
    "useRelayEndpoint should set relay endpoint from environment variables",
    () => {
      // Mock environment variables
      Deno.env.set("NEXT_PUBLIC_RELAY_ENDPOINT", "http://example.com");
      Deno.env.set("NEXT_PUBLIC_RELAY_TOKEN_ID", "0x123456");

      const { result } = renderHook(() => useRelayEndpoint());

      const expectedEndpoint = {
        url: new URL("http://example.com"),
        tokenId: "0x123456",
      };
      const { relayEndpoint } = result.current;
      assertEquals(relayEndpoint, expectedEndpoint);
    },
  );

  await t.step("If no env vars, call discoverRelay fn", async () => {
    // Clear environment variables
    Deno.env.delete("NEXT_PUBLIC_RELAY_ENDPOINT");
    Deno.env.delete("NEXT_PUBLIC_RELAY_TOKEN_ID");

    const { result, waitForNextUpdate, unmount } = renderHook(() =>
      useRelayEndpoint()
    );
    // Wait for the hook to update
    await waitForNextUpdate();
    assertEquals(!!result.current.relayEndpoint, true);
    unmount();
  });

  cleanup();
  await GlobalRegistrator.unregister();
});

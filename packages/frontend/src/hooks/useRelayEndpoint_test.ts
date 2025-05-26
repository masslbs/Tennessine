import "../happyDomSetup.ts";
import { assertEquals } from "@std/assert";
import { renderHook, waitFor } from "@testing-library/react";
import { useRelayEndpoint } from "./useRelayEndpoint.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function wrapper({ children }: { children: React.ReactNode }) {
  return QueryClientProvider({ client: queryClient, children });
}

Deno.test("useRelayEndpoint", async (t) => {
  await t.step("If no env vars, call discoverRelay fn", async () => {
    const { result } = renderHook(() => useRelayEndpoint(), {
      wrapper,
    });
    await waitFor(() => {
      assertEquals(!!result.current.relayEndpoint, true);
    });
  });
});

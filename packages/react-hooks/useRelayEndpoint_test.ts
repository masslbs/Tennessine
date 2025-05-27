import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { assertEquals } from "@std/assert";
import { renderHook } from "@testing-library/react";
import { useRelayEndpoint } from "./useRelayEndpoint.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      experimental_prefetchInRender: true,
    },
  },
});

function wrapper({ children }: { children: React.ReactNode }) {
  return QueryClientProvider({ client: queryClient, children });
}

Deno.test("useRelayEndpoint", async (t) => {
  await import("./happyDomSetup.ts");
  await t.step("If no env vars, call discoverRelay fn", async () => {
    const { result, rerender } = renderHook(() => useRelayEndpoint(), {
      wrapper,
    });
    assertEquals(result.current.relayEndpoint, undefined);
    await result.current.promise;
    rerender();
    assertEquals(!!result.current.relayEndpoint, true);
  });

  await GlobalRegistrator.unregister();
});

import React, { StrictMode } from "react";
import { assertEquals } from "jsr:@std/assert";
import { cleanup, renderHook } from "npm:@testing-library/react";
import { GlobalRegistrator } from "npm:@happy-dom/global-registrator";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { createConfig, http, WagmiProvider } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { useClientWithStateManager } from "./useClientWithStateManager.ts";

const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

const createWrapper = (shopId: string | null = null) => {
  return ({ children }: { children: React.ReactNode }) => {
    const rootRoute = createRootRoute({
      component: Outlet,
    });
    const componentRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: "/",
      component: () => <>{children}</>,
    });
    const router = createRouter({
      routeTree: rootRoute.addChildren([componentRoute]),
      history: createMemoryHistory({
        initialEntries: [shopId ? `/?shopId=${shopId}` : "/"],
      }),
    });

    return (
      <StrictMode>
        <WagmiProvider config={config}>
          {/* @ts-expect-error */}
          <RouterProvider router={router}>{children}</RouterProvider>
        </WagmiProvider>
      </StrictMode>
    );
  };
};

Deno.test("useClientWithStateManager", async (t) => {
  GlobalRegistrator.register({});

  await t.step("should return client when shopId is provided", async () => {
    const wrapper = createWrapper("123");
    Deno.env.set("NEXT_PUBLIC_CHAIN_NAME", "sepolia");
    Deno.env.set("NEXT_PUBLIC_RELAY_ENDPOINT", "http://example.com");
    Deno.env.set("NEXT_PUBLIC_RELAY_TOKEN_ID", "0x123456");
    const { result, unmount } = renderHook(() => useClientWithStateManager(), {
      wrapper,
    });

    assertEquals(typeof result.current.clientStateManager, "object");
    assertEquals(result.current.clientStateManager !== null, true);
    assertEquals(result.current.clientStateManager.shopId, BigInt(123));
    unmount();
  });

  cleanup();
  await GlobalRegistrator.unregister();
});

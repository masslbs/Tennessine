import { assertEquals } from "jsr:@std/assert";
import { cleanup, renderHook, act } from "npm:@testing-library/react";
import { GlobalRegistrator } from "npm:@happy-dom/global-registrator";
import React, { StrictMode } from "react";
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

    const { result, unmount, rerender } = renderHook(
      () => useClientWithStateManager(),
      {
        wrapper,
      },
    );

    // Wait for all pending promises to resolve
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100)); // Add small delay since useRelayEndpoint is a network call.
    });

    rerender();

    // Wait again after rerender
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100)); // Add small delay
    });
    console.log("result.current", result.current);

    assertEquals(typeof result.current.clientStateManager, "object");
    assertEquals(result.current.clientStateManager !== null, true);

    // Make sure to wait for cleanup
    await act(async () => {
      unmount();
    });
  });

  //   await t.step("should return null when no shopId is provided", () => {
  //     const wrapper = createWrapper();

  //     const { result, unmount } = renderHook(() => useClientWithStateManager(), {
  //       wrapper,
  //     });

  //     assertEquals(result.current.client, null);
  //     assertEquals(result.current.stateManager, null);
  //     unmount();
  //   });

  cleanup();
  await GlobalRegistrator.unregister();
});

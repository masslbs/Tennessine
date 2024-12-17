import { assertEquals } from "jsr:@std/assert";
import { cleanup, renderHook } from "npm:@testing-library/react";
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
import { useClientWithStateManager } from "./useClientWithStateManager.ts";

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
        {/* @ts-expect-error */}
        <RouterProvider router={router}>{children}</RouterProvider>
      </StrictMode>
    );
  };
};

Deno.test("useClientWithStateManager", async (t) => {
  GlobalRegistrator.register({});

  await t.step("should return client when shopId is provided", () => {
    const wrapper = createWrapper("123");

    const { result, unmount } = renderHook(() => useClientWithStateManager(), {
      wrapper,
    });

    assertEquals(typeof result.current.client, "object");
    assertEquals(result.current.client !== null, true);
    assertEquals(typeof result.current.stateManager, "object");
    assertEquals(result.current.stateManager !== null, true);
    unmount();
  });

  await t.step("should return null when no shopId is provided", () => {
    const wrapper = createWrapper();

    const { result, unmount } = renderHook(() => useClientWithStateManager(), {
      wrapper,
    });

    assertEquals(result.current.client, null);
    assertEquals(result.current.stateManager, null);
    unmount();
  });

  cleanup();
  await GlobalRegistrator.unregister();
});

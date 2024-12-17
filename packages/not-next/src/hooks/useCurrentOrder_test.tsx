import React, { StrictMode } from "react";

import { assertEquals } from "jsr:@std/assert";
import { cleanup, renderHook } from "@testing-library/react";
import { GlobalRegistrator } from "npm:@happy-dom/global-registrator";
import { useCurrentOrder } from "./useCurrentOrder.ts";

import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";

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

Deno.test("test no order", async (t) => {
  GlobalRegistrator.register({});

  await t.step("should handle no orders", () => {
    const wrapper = createWrapper();

    const { result, unmount } = renderHook(() => useCurrentOrder(), {
      wrapper,
    });
    assertEquals(result.current.currentOrder, null);
    assertEquals(result.current.isDone, false);
    unmount();
  });
  cleanup();

  await GlobalRegistrator.unregister();
});

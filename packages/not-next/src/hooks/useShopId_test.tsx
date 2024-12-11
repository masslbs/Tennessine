import React, { StrictMode } from "react";
import { assertEquals } from "jsr:@std/assert";
import { cleanup } from "@testing-library/react-hooks";
import { renderHook } from "@testing-library/react-hooks";

import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { GlobalRegistrator } from "npm:@happy-dom/global-registrator";
import { useShopId } from "./useShopId.ts";

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

Deno.test("useShopId", async (t) => {
  GlobalRegistrator.register({});
  await t.step("should return null if no shopId is provided", () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useShopId(), { wrapper });
    assertEquals(result.current.shopId, null);
  });
  await t.step("should return shopId from search params", () => {
    const wrapper = createWrapper("123");
    const { result, unmount } = renderHook(() => useShopId(), { wrapper });
    assertEquals(result.current.shopId, BigInt("123"));
    unmount();
  });

  cleanup();
  await GlobalRegistrator.unregister();
});

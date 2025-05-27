import { register, unregister } from "./happyDomSetup.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MassMarketProvider } from "./MassMarketContext.ts";
import { assertEquals } from "@std/assert";
import { act, renderHook } from "@testing-library/react";

import {
  createRootRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";

import { random256BigInt } from "@massmarket/utils";

import { useShopId } from "./useShopId.ts";
const queryClient = new QueryClient();

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean;
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

function wrapper({ children }: { children: React.ReactNode }) {
  const rootRoute = createRootRoute({
    component: () => (
      <>
        {children}
        <Outlet />
      </>
    ),
  });

  const router = createRouter({
    routeTree: rootRoute,
  });

  return MassMarketProvider({
    children: QueryClientProvider({
      client: queryClient,
      children: <RouterProvider router={router} />,
    }),
  });
}

Deno.test(
  "useShopId",
  async (t) => {
    register();
    await t.step("should return shopId from search params", async () => {
      const shopId = random256BigInt();
      globalThis.location.replace(
        `http://localhost?shopId=0x${shopId.toString(16)}`,
      );
      let result;
      await act(() => {
        const { result: r } = renderHook(() => useShopId(), {
          wrapper,
        });
        result = r;
      });
      assertEquals(result!.current.shopId, shopId);
    });
    await unregister();
  },
);

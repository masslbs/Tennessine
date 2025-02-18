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

import { MassMarketProvider } from "../MassMarketContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

export const createRouterWrapper = (
  shopId: string | null = null,
  path: string = "/",
) => {
  return ({ children }: { children: React.ReactNode }) => {
    function RootComponent() {
      return <Outlet />;
    }
    const rootRoute = createRootRoute({
      component: RootComponent,
    });
    const componentRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: "/",
      component: () => <>{children}</>,
    });
    const createShopRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: "/create-shop",
      component: () => <>{children}</>,
    });
    const merchantConnectRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: "/merchant-connect",
      component: () => <>{children}</>,
    });
    const router = createRouter({
      routeTree: rootRoute.addChildren([
        componentRoute,
        createShopRoute,
        merchantConnectRoute,
      ]),
      history: createMemoryHistory({
        initialEntries: [shopId ? `${path}?shopId=${shopId}` : path],
      }),
    });

    return (
      <StrictMode>
        <QueryClientProvider client={new QueryClient()}>
          <WagmiProvider config={config}>
            <MassMarketProvider>
              <RainbowKitProvider showRecentTransactions={true}>
                {
                  /* TS expects self closing RouterProvider tag. See App.tsx for how we are using it.
            But if we use the self closing syntax in testing, the router functions don't work in testing environment. */
                }
                {/* @ts-expect-error  */}
                <RouterProvider router={router}>{children}</RouterProvider>
              </RainbowKitProvider>
            </MassMarketProvider>
          </WagmiProvider>
        </QueryClientProvider>
      </StrictMode>
    );
  };
};

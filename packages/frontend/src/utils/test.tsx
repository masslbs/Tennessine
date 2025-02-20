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
import { hardhat, mainnet, sepolia } from "wagmi/chains";
import { createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { anvilPrivateKey } from "@massmarket/contracts";

import { MassMarketProvider } from "../MassMarketContext.tsx";
import { MockClientStateManager } from "./MockClientStateManager.ts";

export const config = createConfig({
  chains: [mainnet, sepolia, hardhat],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [hardhat.id]: http(),
  },
});

const mockWalletClient = createWalletClient({
  chain: hardhat,
  transport: http(),
  account: privateKeyToAccount(
    anvilPrivateKey,
  ),
});

export const createClientStateManager = async (
  shopId: string | null = null,
) => {
  const csm = new MockClientStateManager(
    shopId || "0x123",
  );
  await csm.createStateManager();
  // Add test keycard for event verification
  await csm.stateManager?.keycards.addAddress(
    csm.relayClient!.keyCardWallet.address,
  );
  return csm;
};

export const createRouterWrapper = async (
  shopId: string | null = null,
  path: string = "/",
  // The only case clientStateManager needs to be passed here is if we need access to the state manager before the router is created.
  // For example, in EditListing_test.tsx, we need to access the state manager to create a new listing and then use the listing id to set the search param.
  clientStateManager: MockClientStateManager | null = null, // In most cases we don't need to pass clientStateManager separately.
) => {
  const csm = clientStateManager ?? await createClientStateManager(shopId);

  const wrapper = ({ children }: { children: React.ReactNode }) => {
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
    // Set initial data for wallet client
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          initialData: mockWalletClient,
        },
      },
    });
    return (
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <WagmiProvider config={config}>
            <MassMarketProvider clientStateManager={csm}>
              <RainbowKitProvider showRecentTransactions={true}>
                {
                  /* TS expects self closing RouterProvider tag. See App.tsx for how we are using it.
            But if we use the self closing syntax in testing, the router functions don't work in testing environment. */
                }
                {/* @ts-expect-error */}
                <RouterProvider router={router}>{children}</RouterProvider>
              </RainbowKitProvider>
            </MassMarketProvider>
          </WagmiProvider>
        </QueryClientProvider>
      </StrictMode>
    );
  };

  return {
    wrapper,
    csm,
  };
};

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
import { connect } from "wagmi/actions";
import { hardhat, mainnet, sepolia } from "wagmi/chains";
import { mock } from "npm:wagmi/connectors";
import { createTestClient, publicActions, walletActions } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { discoverRelay } from "@massmarket/client";
import { random256BigInt } from "@massmarket/utils";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { MassMarketProvider } from "../MassMarketContext.ts";
import { ClientWithStateManager } from "../ClientWithStateManager.ts";

export const relayURL = Deno.env.get("RELAY_ENDPOINT") ||
  "http://localhost:4444/v4";
const testRelayEndpoint = await discoverRelay(relayURL);

export const testClient = createTestClient({
  transport: http(),
  chain: hardhat,
  mode: "anvil",
})
  // Extend the client with public and wallet actions, so it can also act as a Public Client and Wallet Client
  .extend(publicActions)
  .extend(walletActions);
const [testAccountAddress] = await testClient.requestAddresses();

export const connectors = [
  mock({
    accounts: [testAccountAddress],
    features: {
      defaultConnected: true,
      reconnect: true,
    },
  }),
];

export const createTestStateManager = async (
  shopId: bigint | null = null,
) => {
  if (!shopId) {
    shopId = random256BigInt();
  }
  const pk = generatePrivateKey();
  const testKeyCard = privateKeyToAccount(pk);

  const csm = new ClientWithStateManager(
    testRelayEndpoint,
    testClient,
    testKeyCard,
    shopId,
  );
  await csm.stateManager.open();
  return csm;
};

// TODO: verify where createRouterWrapper is used and if we can remove the csm argument.
export const createRouterWrapper = async (
  shopId: bigint | null = null,
  path: string = "/",
  // The only case clientStateManager needs to be passed here is if we need access to the state manager before the router is created.
  // For example, in EditListing_test.tsx, we need to access the state manager to create a new listing and then use the listing id to set the search param.
  clientStateManager: ClientWithStateManager | null = null, // In most cases we don't need to pass clientStateManager separately.
) => {
  const config = createConfig({
    chains: [hardhat, mainnet, sepolia],
    transports: {
      [hardhat.id]: http(),
      [sepolia.id]: http(),
      [mainnet.id]: http(),
    },
    connectors,
  });
  const csm = clientStateManager ?? await createTestStateManager(shopId);
  await connect(config, { connector: config.connectors[0] });

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
    const checkoutRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: "/checkout",
      component: () => <>{children}</>,
    });
    const router = createRouter({
      routeTree: rootRoute.addChildren([
        componentRoute,
        createShopRoute,
        merchantConnectRoute,
        checkoutRoute,
      ]),
      history: createMemoryHistory({
        initialEntries: [
          shopId ? `${path}?shopId=0x${shopId.toString(16)}` : path,
        ],
      }),
    });

    // Set initial data for wallet client
    const queryClient = new QueryClient();
    return (
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <WagmiProvider config={config}>
            <MassMarketProvider clientStateManager={csm}>
              <RainbowKitProvider showRecentTransactions>
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

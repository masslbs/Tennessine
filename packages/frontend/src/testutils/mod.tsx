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
import StateManager from "@massmarket/stateManager";
import { MemStore } from "@massmarket/store";
import { RelayClient } from "@massmarket/client";

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
const testAccounts = await testClient.requestAddresses();
export const testAccount = testAccounts[0];
// console.log({testAccount, "where": "helper", testAccounts})

export const connectors = [
  mock({
    accounts: [testAccount],
    features: {
      defaultConnected: true,
      reconnect: true,
    },
  }),
];

export const createTestStateManager = async (
  shopId: bigint | null = null,
) => {
  if (shopId === null) {
    shopId = random256BigInt();
  }
  const pk = generatePrivateKey();
  const testKeyCard = privateKeyToAccount(pk);

  const root = new Map(Object.entries({
    Tags: new Map(),
    Orders: new Map(),
    Accounts: new Map(),
    Inventory: new Map(),
    Listings: new Map(),
    Manifest: new Map(),
    SchemeVersion: 1,
  }));
  const stateManager = new StateManager({
    store: new MemStore(),
    id: shopId,
    defaultState: root,
  });

  await stateManager.open();

  const relayClient = new RelayClient({
    relayEndpoint: testRelayEndpoint,
    walletClient: testClient,
    keycard: testKeyCard,
    shopId: shopId,
  });

  return {
    stateManager,
    relayClient,
  };
};

// TODO: verify where createRouterWrapper is used and if we can remove the csm argument.
export const createRouterWrapper = async (
  shopId: bigint | null = null,
  path: string = "/",
  // The only case clientStateManager needs to be passed here is if we need access to the state manager before the router is created.
  // For example, in EditListing_test.tsx, we need to access the state manager to create a new listing and then use the listing id to set the search param.
  stateManager?: StateManager, // In most cases we don't need to pass clientStateManager separately.
  relayClient?: RelayClient,
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
  if (!stateManager) {
    const csm = await createTestStateManager(shopId);
    stateManager = csm.stateManager;
    relayClient = csm.relayClient;
  }
  if (!relayClient) {
    throw new Error("Relay client is required");
  }
  await connect(config, { connector: config.connectors[0] });

  const initialURL = (() => {
    if (!shopId) return path;

    // parse it
    const url = new URL(path, "http://localhost");
    const searchParams = url.searchParams;
    // override the shopId
    searchParams.set("shopId", `0x${shopId.toString(16)}`);

    // Return the path with search params, but without the base URL
    return `${url.pathname}${
      searchParams.toString() ? "?" + searchParams.toString() : ""
    }`;
  })();
  // console.log({initialURL});

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
        initialEntries: [initialURL],
      }),
    });

    // Set initial data for wallet client
    const queryClient = new QueryClient();
    return (
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <WagmiProvider config={config}>
            <MassMarketProvider
              stateManager={stateManager}
              relayClient={relayClient}
            >
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
    stateManager,
    relayClient,
    testAccount,
  };
};

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
import { hardhat } from "wagmi/chains";
import { mock } from "wagmi/connectors";
import { createTestClient, publicActions, walletActions } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { discoverRelay, RelayClient } from "@massmarket/client";
import { mintShop } from "@massmarket/contracts";
import { random256BigInt } from "@massmarket/utils";
// to enable logging `import from "@massmarket/utils/logger"`,
import { enableLogging } from "@massmarket/utils/logger";
if (Deno.env.get("MAX_LOGS")) {
  await enableLogging();
}
import StateManager from "@massmarket/stateManager";
import { MemStore } from "@massmarket/store";

import { MassMarketProvider } from "@massmarket/react-hooks";
import { KeycardRole } from "../types.ts";
import { env } from "../utils/env.ts";

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

export const connectors = [
  mock({
    accounts: [testAccount],
    features: {
      defaultConnected: true,
      reconnect: true,
    },
  }),
];

export const createTestStateManager = async (shopId: bigint) => {
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

  return stateManager;
};

export const createTestRelayClient = async (
  shopId: bigint,
  enrollKeycard: boolean,
) => {
  const keyCardID = `keycard${shopId}`;
  const hasKC = localStorage.getItem(keyCardID);
  if (hasKC) {
    throw new Error("Keycard already exists");
  }
  const kcPrivateKey = generatePrivateKey();
  const keycard = privateKeyToAccount(kcPrivateKey);

  const relayClient = new RelayClient({
    relayEndpoint: testRelayEndpoint,
    walletClient: testClient,
    keycard,
    shopId,
  });

  if (enrollKeycard) {
    const result = await relayClient.enrollKeycard(
      testClient,
      testAccount,
      false,
    );
    if (!result.ok) {
      throw new Error("Failed to enroll keycard");
    }

    localStorage.setItem(
      keyCardID,
      JSON.stringify({
        privateKey: kcPrivateKey,
        role: KeycardRole.MERCHANT,
      }),
    );
  }

  return relayClient;
};

export const createRouterWrapper = async ({
  shopId,
  createShop = false,
  enrollMerchant = false,
  path = "/",
  stateManager,
  relayClient,
}: {
  shopId?: bigint | null;
  createShop?: boolean; // whether to mint a shop
  enrollMerchant?: boolean; // whether to enroll a keycard
  path?: string;
  // The only case clientStateManager needs to be passed here is if we need access to the state manager before the router is created.
  // For example, in EditListing_test.tsx, we need to access the state manager to create a new listing and then use the listing id to set the search param.
  stateManager?: StateManager; // In most cases we don't need to pass clientStateManager separately.
  relayClient?: RelayClient;
} = {}) => {
  const config = createConfig({
    chains: [hardhat], // testing only
    transports: {
      [hardhat.id]: http(),
    },
    connectors,
  });
  // establish wallet connection
  await connect(config, { connector: config.connectors[0] });

  if (!shopId) {
    shopId = random256BigInt();
  }
  if (createShop) {
    const transactionHash = await mintShop(testClient, testAccount, [
      shopId,
      testAccount,
    ]);
    // this is still causing a leak
    // https://github.com/wevm/viem/issues/2903
    const receipt = await testClient.waitForTransactionReceipt({
      hash: transactionHash,
      retryCount: 10,
    });
    if (receipt.status !== "success") {
      throw new Error("Shop creation failed");
    }
  }
  if (!relayClient) {
    relayClient = await createTestRelayClient(shopId, enrollMerchant);
  }

  if (!stateManager) {
    stateManager = await createTestStateManager(shopId);
  }

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
    const shippingRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: "/shipping",
      component: () => <>{children}</>,
    });
    const router = createRouter({
      routeTree: rootRoute.addChildren([
        componentRoute,
        createShopRoute,
        merchantConnectRoute,
        shippingRoute,
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
              config={env}
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

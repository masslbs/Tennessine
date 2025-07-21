import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { createConfig, http, mock, WagmiProvider } from "wagmi";
import { hardhat } from "wagmi/chains";
import { createTestClient, publicActions, walletActions } from "viem";
import { cleanup } from "@testing-library/react";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { connect } from "wagmi/actions";

import { mintShop } from "@massmarket/contracts";
import { discoverRelay, RelayClient } from "@massmarket/client";
import { random256BigInt } from "@massmarket/utils";
import StateManager from "@massmarket/stateManager";
import { LevelStore } from "@massmarket/store";
import { defaultState } from "@massmarket/schema";
import { MassMarketProvider } from "@massmarket/react-hooks";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean;
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

export const testClient = createTestClient({
  transport: http(),
  chain: hardhat,
  mode: "anvil",
}).extend(walletActions).extend(publicActions);

export const denoTestOptions = {
  sanitizeResources: false,
  sanitizeOps: false,
};

const testAccounts = await testClient.requestAddresses();
export const testAccount = testAccounts[0];

export const relayURL = Deno.env.get("RELAY_ENDPOINT") ||
  "http://localhost:4444/v4";
const testRelayEndpoint = await discoverRelay(relayURL);

export async function createWrapper(
  shopId: bigint | null = random256BigInt(),
  path: string = "/",
  testAccountIndex = 0,
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        experimental_prefetchInRender: true,
      },
    },
  });
  const initialURL = (() => {
    const url = new URL(path, "http://localhost");
    const searchParams = url.searchParams;

    if (shopId) {
      searchParams.set("shopId", `0x${shopId.toString(16)}`);
    }

    // Return the path with search params, but without the base URL
    return `${url.pathname}${
      searchParams.toString() ? "?" + searchParams.toString() : ""
    }`;
  })();
  const connectors = [
    mock({
      accounts: [testAccounts[testAccountIndex]],
      features: {
        defaultConnected: true,
        reconnect: true,
      },
    }),
  ];

  const config = createConfig({
    chains: [hardhat],
    connectors,
    transports: {
      [hardhat.id]: http(),
    },
  });
  // Establish wallet connection
  await connect(config, { connector: config.connectors[0] });

  return ({ children }: { children: React.ReactNode }) => {
    function RootComponent() {
      return <Outlet />;
    }
    const rootRoute = createRootRoute({
      component: RootComponent,
    });
    const root = createRoute({
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
        root,
        createShopRoute,
        merchantConnectRoute,
      ]),
      history: createMemoryHistory({
        initialEntries: [initialURL],
      }),
    });

    return (
      <WagmiProvider config={config}>
        <MassMarketProvider
          config={{ db: new LevelStore(), chainName: "hardhat" }}
        >
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider showRecentTransactions>
              <RouterProvider router={router} />
            </RainbowKitProvider>
          </QueryClientProvider>
        </MassMarketProvider>
      </WagmiProvider>
    );
  };
}

export async function createShop(shopId: bigint) {
  const transactionHash = await mintShop(testClient, testAccount, [
    shopId,
    testAccount,
  ]);
  // this is still causing a leak
  // https://github.com/wevm/viem/issues/2903
  await testClient.waitForTransactionReceipt({
    hash: transactionHash,
  });
}

export async function createTestRelayClient(shopId: bigint) {
  const kcPrivateKey = generatePrivateKey();
  const keycard = privateKeyToAccount(kcPrivateKey);
  const relayClient = new RelayClient({
    relayEndpoint: testRelayEndpoint,
    walletClient: testClient,
    keycard,
    shopId,
  });
  await relayClient.enrollKeycard(testClient, testAccount, false);
  return relayClient;
}

export const createTestStateManager = async (shopId: bigint) => {
  const stateManager = new StateManager({
    store: new LevelStore(),
    id: shopId,
    defaultState,
  });
  await stateManager.open();

  return stateManager;
};

export function testWrapper(
  cb: (id: bigint, t: Deno.TestContext) => Promise<void> | void,
) {
  return async (_t: Deno.TestContext) => {
    const shopId = random256BigInt();
    await createShop(shopId);
    await cb(shopId, _t);
    cleanup();
  };
}

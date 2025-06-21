import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { createConfig, http, mock, WagmiProvider } from "wagmi";
import { foundry } from "wagmi/chains";
import { createTestClient, publicActions, walletActions } from "viem";
import { cleanup } from "@testing-library/react";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

import { mintShop } from "@massmarket/contracts";
import { discoverRelay, RelayClient } from "@massmarket/client";
import { random256BigInt } from "@massmarket/utils";
import StateManager from "@massmarket/stateManager";
import { LevelStore } from "@massmarket/store";
import { defaultState } from "@massmarket/schema";
import { MassMarketProvider } from "@massmarket/react-hooks";

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean;
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

export const testClient = createTestClient({
  transport: http(),
  chain: foundry,
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

export function createWrapper(
  shopId: bigint = random256BigInt(),
  testAccountIndex = 0,
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        experimental_prefetchInRender: true,
      },
    },
  });
  globalThis.location.replace(
    `http://localhost?shopId=0x${shopId.toString(16)}`,
  );
  return ({ children }: { children: React.ReactNode }) => {
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
      chains: [foundry],
      connectors,
      transports: {
        [foundry.id]: http(),
      },
    });

    return (
      <WagmiProvider config={config}>
        <MassMarketProvider config={{ db: new LevelStore() }}>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />,
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

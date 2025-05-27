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
import { mintShop } from "@massmarket/contracts";
import { MassMarketProvider } from "./MassMarketContext.ts";
// import { random256BigInt } from "@massmarket/utils";

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean;
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

export const testClient = createTestClient({
  transport: http(),
  chain: foundry,
  mode: "anvil",
}).extend(walletActions).extend(publicActions);

const testAccounts = await testClient.requestAddresses();
export const testAccount = testAccounts[0];

export function createWrapper(shopId: bigint, testAccountIndex = 0) {
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
        <MassMarketProvider>
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

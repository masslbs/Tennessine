import { type Config, WagmiProvider } from "wagmi";
import { QueryClient } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";

import { MassMarketProvider } from "@massmarket/react-hooks";

import { config } from "./wagmi.ts";
import { routeTree } from "./routeTree.gen.ts";

const router = createRouter({ routeTree });

const queryClient = new QueryClient();

const persister = createSyncStoragePersister({
  storage: globalThis.localStorage,
});

export default function App({
  wagmiConfig = config,
  massMarketConfig = {},
}: {
  wagmiConfig?: ReturnType<typeof getDefaultConfig> | Config;
  children?: React.ReactNode;
  massMarketConfig?: Record<string, string>;
}) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <WagmiProvider config={wagmiConfig}>
        <MassMarketProvider config={massMarketConfig}>
          <RainbowKitProvider showRecentTransactions>
            <RouterProvider router={router} />
            <main data-testid="homepage">
            </main>
          </RainbowKitProvider>
        </MassMarketProvider>
      </WagmiProvider>
    </PersistQueryClientProvider>
  );
}

import { type Config, WagmiProvider } from "wagmi";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { MassMarketProvider } from "./MassMarketContext.ts";
import { config } from "./wagmi.ts";
import { routeTree } from "./routeTree.gen.ts";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: Infinity,
      staleTime: Infinity,
    },
  },
});

const persister = createSyncStoragePersister({
  storage: globalThis.localStorage,
});

const router = createRouter({ routeTree });

export default function App({
  wagmiConfig = config,
}: {
  wagmiConfig?: ReturnType<typeof getDefaultConfig> | Config;
  children?: React.ReactNode;
}) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <WagmiProvider config={wagmiConfig}>
        <MassMarketProvider>
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

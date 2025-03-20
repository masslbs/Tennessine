import { type Config, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { MassMarketProvider } from "./MassMarketContext.ts";
import { getConfig } from "./wagmi.ts";
import { routeTree } from "./routeTree.gen.ts";

const queryClient = new QueryClient();
const router = createRouter({ routeTree });

export default function App({
  wagmiConfig = getConfig(),
}: {
  wagmiConfig?: ReturnType<typeof getDefaultConfig> | Config;
  children?: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <MassMarketProvider>
          <RainbowKitProvider showRecentTransactions>
            <RouterProvider router={router} />
            <main data-testid="homepage">
            </main>
          </RainbowKitProvider>
        </MassMarketProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}

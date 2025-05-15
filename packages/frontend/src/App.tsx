import { type Config, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configure } from "@logtape/logtape";
import { getSentrySink } from "@logtape/sentry";
import { MassMarketProvider } from "./MassMarketContext.ts";
import { config } from "./wagmi.ts";
import { routeTree } from "./routeTree.gen.ts";

await configure({
  sinks: {
    sentry: getSentrySink(),
  },
  filters: {},
  loggers: [
    { category: [], sinks: ["sentry"], level: "debug" },
  ],
});
const queryClient = new QueryClient();
const router = createRouter({ routeTree });

export default function App({
  wagmiConfig = config,
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

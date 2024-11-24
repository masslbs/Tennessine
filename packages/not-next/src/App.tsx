import { type Config, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { MassMarketProvider } from "./MassMarketContext.tsx";
import { getConfig } from "./wagmi.ts";
import { routeTree } from "./routeTree.gen.ts";

const queryClient = new QueryClient();
const router = createRouter({ routeTree });

export default function App(
  { wagmiConfig = getConfig() }: { wagmiConfig?: Config },
) {
  return (
    <>
      <RouterProvider router={router} />
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <MassMarketProvider>
            <RainbowKitProvider>
              <ConnectButton />
              <div data-testid="hello">hello!</div>
            </RainbowKitProvider>
          </MassMarketProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
}

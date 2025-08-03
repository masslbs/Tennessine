import { type Config, WagmiProvider } from "wagmi";
import { QueryClient } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";

import { MassMarketProvider } from "@massmarket/react-hooks";

import { InteractionBlockingModal } from "./components/InteractionBlockingModal.tsx";

import { config } from "./wagmi.ts";
import { routeTree } from "./routeTree.gen.ts";

const router = createRouter({ routeTree });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      experimental_prefetchInRender: true,
    },
  },
});

const persister = createSyncStoragePersister({
  storage: globalThis.localStorage,
  serialize: (data) => {
    return JSON.stringify(data, (_key, value) => {
      if (typeof value === "bigint") {
        return { __type: "bigint", value: value.toString() };
      }
      return value;
    });
  },
  deserialize: (data) => {
    return JSON.parse(data, (_key, value) => {
      if (value && typeof value === "object" && value.__type === "bigint") {
        return BigInt(value.value);
      }
      return value;
    });
  },
  retry: ({ error }) => {
    throw new Error("Persistence error", error);
  },
});

const getBlockingModal = (children: React.ReactNode, errorMessage: string) => {
  const description = (
    <div className="leading-5">
      <p>
        The shop is currently open in multiple different tabs. Interacting with
        a shop across multiple tabs is not yet supported.
      </p>
      <ul className="list-disc ml-4 mt-4">
        <li className="mb-2">
          <strong>
            Return to a tab without this message to continue using the shop.
          </strong>
        </li>
        <li className="mb-2">
          Alternatively,{" "}
          <strong>
            close all other Mass Market shop tabs and refresh this tab.
          </strong>
        </li>
      </ul>
      <p className="mt-2">
        If nothing seems to help, please reach out at{" "}
        <a className="underline" href="mailto:info@mass.market">
          info@mass.market
        </a>{" "}
        with details so that we can fix the problem.
      </p>
    </div>
  );
  return InteractionBlockingModal({
    children,
    title: "Multi-tab drifting detected!",
    description,
    errorMessage,
  });
};

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
        <MassMarketProvider
          blockingModal={getBlockingModal}
          config={massMarketConfig}
        >
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

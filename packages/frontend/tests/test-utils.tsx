import React, { ReactElement } from "react";
import { MyContextProvider, MyContext } from "../src/context/MyContext";
import { MockClient } from "@massmarket/stateManager/tests/mockClient";
import { render } from "@testing-library/react";
import { AuthProvider, AuthContext } from "../src/context/AuthContext";
import {
  type Item,
  type Tag,
  type ShopManifest,
  type Order,
  type KeyCard,
  type OrderId,
  Status,
} from "@/types";
import { StateManager } from "@massmarket/stateManager";
import { StoreContext } from "@/context/StoreContext";
import { MemoryLevel } from "memory-level";
import { WagmiProvider } from "wagmi";
import { config } from "../src/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { random32BytesHex } from "@massmarket/utils";
import { RelayClient, discoverRelay } from "@massmarket/client";
import { privateKeyToAccount } from "viem/accounts";
import { createWalletClient, http } from "viem";
import { hardhat } from "viem/chains";
import { zeroAddress, anvilAddress } from "@massmarket/utils";

const mockClient = new MockClient();
const relayURL =
  (process && process.env["RELAY_ENDPOINT"]) || "ws://localhost:4444/v2";
const relayEndpoint = await discoverRelay(relayURL);

function createRelayClient(pk = random32BytesHex()) {
  return new RelayClient({
    relayEndpoint,
    keyCardWallet: privateKeyToAccount(pk),
  });
}

export function getWallet() {
  // this key is from one of anvil's default keypairs
  const account = privateKeyToAccount(anvilAddress);
  const wallet = createWalletClient({
    account,
    chain: hardhat,
    transport: http(),
  });
  return wallet;
}
export function getStateManager(useRelayClient?: boolean) {
  const client = useRelayClient ? createRelayClient() : mockClient;

  const db = new MemoryLevel({
    valueEncoding: "json",
  });
  db.clear();
  const listingStore = db.sublevel<string, Item>("listingStore", {
    valueEncoding: "json",
  });
  const tagStore = db.sublevel<string, Tag>("tagStore", {
    valueEncoding: "json",
  });
  const shopManifestStore = db.sublevel<string, ShopManifest>(
    "shopManifestStore",
    {
      valueEncoding: "json",
    },
  );
  const orderStore = db.sublevel<string, Order>("orderStore", {
    valueEncoding: "json",
  });

  const keycardStore = db.sublevel<string, KeyCard[]>("keycardStore", {
    valueEncoding: "json",
  });
  return new StateManager(
    client,
    listingStore,
    tagStore,
    shopManifestStore,
    orderStore,
    keycardStore,
  );
}

const Wrapper = ({
  children,
  stateManager,
  orderId,
}: {
  children: React.ReactNode;
  stateManager: StateManager;
  orderId?: OrderId;
}) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={new QueryClient()}>
        <AuthProvider>
          <MyContextProvider>
            <StoreContext.Provider
              value={{
                stateManager: stateManager,
                //@ts-expect-error FIXME
                getOrderId: async () => {
                  return orderId;
                },
                selectedCurrency: {
                  chainId: 31337,
                  tokenAddr: zeroAddress,
                },
              }}
            >
              {children}
            </StoreContext.Provider>
          </MyContextProvider>
        </AuthProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

const MerchantsWrapper = ({
  children,
  stateManager,
  orderId,
}: {
  children: React.ReactNode;
  stateManager: StateManager;
  orderId: OrderId;
}) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={new QueryClient()}>
        <AuthContext.Provider
          value={{
            isConnected: Status.Complete,
            setIsConnected: () => {},
            hasUpdateRootHashPerm: false,
            setUpdateRootHashPerm: () => {},
            isMerchantView: true,
            setIsMerchantView: () => {},
          }}
        >
          {/* @ts-expect-error FIXME */}
          <MyContext.Provider value={{ relayClient: mockClient }}>
            <StoreContext.Provider
              //@ts-expect-error FIXME
              value={{
                stateManager: stateManager,
                getOrderId: async () => {
                  return orderId;
                },
              }}
            >
              {children}
            </StoreContext.Provider>
          </MyContext.Provider>
        </AuthContext.Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

const customRender = (
  ui: ReactElement,
  stateManager: StateManager,
  orderId?: OrderId,
) => {
  render(
    <Wrapper stateManager={stateManager} orderId={orderId}>
      {ui}
    </Wrapper>,
  );
};
const AuthorizedCustomRender = (
  ui: ReactElement,
  stateManager: StateManager,
  orderId: OrderId,
) => {
  render(
    <MerchantsWrapper orderId={orderId} stateManager={stateManager}>
      {ui}
    </MerchantsWrapper>,
  );
};
export { customRender as render, AuthorizedCustomRender as merchantsWrapper };

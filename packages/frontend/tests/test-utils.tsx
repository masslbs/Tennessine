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
const client = new MockClient();

export function getStateManager() {
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

  const keycardStore = db.sublevel<string, KeyCard>("keycardStore", {
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
}: {
  children: React.ReactNode;
  stateManager: StateManager;
}) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={new QueryClient()}>
        <AuthProvider>
          <MyContextProvider>
            <StoreContext.Provider
              //@ts-expect-error FIXME
              value={{
                stateManager: stateManager,
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
          <MyContext.Provider value={{ relayClient: client }}>
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

const customRender = (ui: ReactElement, stateManager: StateManager) => {
  render(<Wrapper stateManager={stateManager}>{ui}</Wrapper>);
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

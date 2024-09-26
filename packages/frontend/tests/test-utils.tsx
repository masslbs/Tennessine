import React, { ReactElement } from "react";
import { MyContextProvider, UserContext } from "../src/context/UserContext";
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
import {
  anvilPrivateKey,
  random32BytesHex,
  zeroAddress,
  randomAddress,
} from "@massmarket/utils";
import { RelayClient, discoverRelay } from "@massmarket/client";
import { privateKeyToAccount } from "viem/accounts";
import { createWalletClient, http, createPublicClient } from "viem";
import { hardhat } from "viem/chains";

const mockClient = new MockClient();
const relayURL =
  (process && process.env["RELAY_ENDPOINT"]) || "ws://localhost:4444/v3";
const relayEndpoint = await discoverRelay(relayURL);

export function getWallet() {
  // this key is from one of anvil's default keypairs
  const account = privateKeyToAccount(anvilPrivateKey);
  const wallet = createWalletClient({
    account,
    chain: hardhat,
    transport: http(),
  });
  return wallet;
}
export async function getStateManager(useRelayClient?: boolean) {
  const kcWallet = privateKeyToAccount(random32BytesHex());
  const client = useRelayClient
    ? new RelayClient({
        relayEndpoint,
        keyCardWallet: kcWallet,
      })
    : mockClient;

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
  const shopClient = createPublicClient({
    chain: hardhat,
    transport: http(),
  });
  const sm = new StateManager(
    client,
    listingStore,
    tagStore,
    shopManifestStore,
    orderStore,
    keycardStore,
    randomAddress(),
    shopClient,
  );
  //Usually addAddress is called in the stateManager by finding the ownerAdd of the relayTokenIds associated with a shopId.
  //But for testing purposes, manually add relay addresses to db.
  await sm.keycards.addAddress(mockClient.keyCardWallet.address);
  await sm.keycards.addAddress(kcWallet.address);
  return sm;
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
                  address: zeroAddress,
                },
                baseTokenDetails: {
                  symbol: "ETH",
                  decimal: 18,
                },
                setShopDetails: async () => {},
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
            clientConnected: Status.Complete,
            setIsConnected: () => {},
            isMerchantView: true,
            setIsMerchantView: () => {},
          }}
        >
          <MyContext.Provider
            //@ts-expect-error FIXME
            value={{ relayClient: mockClient, clientWallet: getWallet() }}
          >
            <StoreContext.Provider
              //@ts-expect-error FIXME
              value={{
                stateManager: stateManager,
                getOrderId: async () => {
                  return orderId;
                },
                baseTokenDetails: {
                  symbol: "ETH",
                  decimal: 18,
                },
                shopDetails: {
                  name: "test store",
                  profilePictureUrl: "",
                },
              }}
            >
              {children}
            </StoreContext.Provider>
          </UserContext.Provider>
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

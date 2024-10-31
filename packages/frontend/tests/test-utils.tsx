import React, { ReactElement } from "react";
import { WagmiProvider } from "wagmi";
import { config } from "../src/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  anvilPrivateKey,
  random32BytesHex,
  randomAddress,
} from "@massmarket/utils";
import { RelayClient, discoverRelay } from "@massmarket/client";
import { privateKeyToAccount } from "viem/accounts";
import { createWalletClient, http, createPublicClient } from "viem";
import { hardhat } from "viem/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { privateKeyToAccount } from "viem/accounts";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

import { anvilPrivateKey, random32BytesHex } from "@massmarket/utils";
import { MockClientStateManager } from "@massmarket/stateManager/tests/mockClient";
import { MockClient } from "@massmarket/stateManager/tests/mockClient";
import { discoverRelay } from "@massmarket/client";

import { Status } from "@/types";
import { StoreContext } from "@/context/StoreContext";
import { UserContext } from "../src/context/UserContext";
import { AuthContext } from "../src/context/AuthContext";
import { config } from "../src/wagmi";
import { ClientWithStateManager } from "@/app/ClientWithStateManager";

const mockClient = new MockClient();
const shopPublicClient = createPublicClient({
  chain: hardhat,
  transport: http(),
});
export const randomShopId = random32BytesHex();
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

export async function getMockClient() {
  const client = new MockClientStateManager(
    shopPublicClient,
    random32BytesHex(),
  );
  client.setClientAndConnect();
  client.createStateManager();

  //Usually addAddress is called in the stateManager by finding the ownerAdd of the relayTokenIds associated with a shopId.
  //But for testing purposes, manually add relay addresses to db.
  await client!.stateManager!.keycards.addAddress(
    mockClient.keyCardWallet.address,
  );
  return client;
}

// This sets up the real client, for CreateStore and Checkout tests
export async function getClient() {
  const shopClient = createPublicClient({
    chain: hardhat,
    transport: http(),
  });
  const relayURL =
    (process && process.env["RELAY_ENDPOINT"]) || "ws://localhost:4444/v3";
  const relayEndpoint = await discoverRelay(relayURL);
  const client = new ClientWithStateManager(
    shopClient,
    randomShopId,
    relayEndpoint,
  );
  return client;
}

const MerchantsWrapper = ({
  children,
  client,
}: {
  children: React.ReactNode;
  client: ClientWithStateManager | MockClientStateManager;
}) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={new QueryClient()}>
        <RainbowKitProvider>
          <AuthContext.Provider
            value={{
              clientConnected: Status.Complete,
              setIsConnected: () => {},
              isMerchantView: true,
              setIsMerchantView: () => {},
            }}
          >
            <UserContext.Provider
              value={{
                //@ts-expect-error FIXME
                clientWithStateManager: client,
                clientWallet: getWallet(),
                shopId: randomShopId,
                shopPublicClient,
                setShopId: () => {},
                checkPermissions: async () => {
                  return true;
                },
              }}
            >
              <StoreContext.Provider
                value={{
                  getBaseTokenInfo: async () => {
                    return ["ETH", 18];
                  },
                  shopDetails: {
                    name: "test store",
                    profilePictureUrl: "",
                  },
                  setShopDetails: () => {},
                }}
              >
                {children}
              </StoreContext.Provider>
            </UserContext.Provider>
          </AuthContext.Provider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export const MerchantsRender = (
  ui: ReactElement,
  client: ClientWithStateManager | MockClientStateManager,
) => {
  render(<MerchantsWrapper client={client}>{ui}</MerchantsWrapper>);
};

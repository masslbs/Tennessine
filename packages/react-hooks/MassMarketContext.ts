import {
  createContext,
  createElement,
  type Dispatch,
  type SetStateAction,
  useState,
} from "react";
import type { Order } from "@massmarket/schema";
import type { RelayClient } from "@massmarket/client";
import type StateManager from "@massmarket/stateManager";
import type { AbstractStore } from "@massmarket/store";

import type { Hex } from "viem";

export type MassMarketConfig = {
  // todo @nullradix <2025-05-28> maybe should be a bigint
  shopId?: string;
  relayTokenId?: Hex;
  chainName?: string;
  relayEndpoint?: string;
  db?: AbstractStore;
};

type MassMarketContextType = {
  relayClient: RelayClient | undefined;
  setRelayClient: Dispatch<SetStateAction<RelayClient | undefined>>;
  stateManager: StateManager | undefined;
  setStateManager: Dispatch<SetStateAction<StateManager | undefined>>;
  shopDetails: {
    name: string;
    profilePictureUrl: string;
  };
  setShopDetails: Dispatch<
    SetStateAction<{ name: string; profilePictureUrl: string }>
  >;
  currentOrder: Order | null;
  setCurrentOrder: Dispatch<SetStateAction<Order | null>>;
  authenticationError: Error | null;
  setAuthenticationError: Dispatch<SetStateAction<Error | null>>;
  config: MassMarketConfig;
};

export const MassMarketContext = createContext<
  MassMarketContextType | undefined
>(
  undefined,
);

export function MassMarketProvider(
  parameters: React.PropsWithChildren<{
    relayClient?: RelayClient;
    stateManager?: StateManager;
    config?: MassMarketConfig;
    blockingModal?: (
      children: React.ReactNode,
      errorMessage: string,
    ) => React.ReactNode;
  }>,
) {
  const [relayClient, setRelayClient] = useState(
    parameters.relayClient,
  );
  const [stateManager, setStateManager] = useState(
    parameters.stateManager,
  );
  const [shopDetails, setShopDetails] = useState({
    name: "",
    profilePictureUrl: "",
  });
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [authenticationError, setAuthenticationError] = useState<Error | null>(
    null,
  );

  const value = {
    relayClient,
    setRelayClient,
    stateManager,
    setStateManager,
    shopDetails,
    setShopDetails,
    currentOrder,
    setCurrentOrder,
    authenticationError,
    setAuthenticationError,
    config: parameters.config ?? {},
  };

  if (authenticationError instanceof Error) {
    if (!parameters.blockingModal) {
      throw new Error(
        "authentication error occurred but blocking modal was not supplied",
      );
    }
    return createElement(MassMarketContext.Provider, {
      value,
      children: parameters.blockingModal(
        parameters.children,
        authenticationError.message,
      ),
    });
  }
  return createElement(MassMarketContext.Provider, {
    value,
    children: parameters.children,
  });
}

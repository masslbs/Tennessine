import React, {
  createContext,
  createElement,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { Order } from "@massmarket/schema";
import { RelayClient } from "@massmarket/client";
import StateManager from "@massmarket/stateManager";

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

  const value = {
    relayClient,
    setRelayClient,
    stateManager,
    setStateManager,
    shopDetails,
    setShopDetails,
    currentOrder,
    setCurrentOrder,
  };

  return createElement(MassMarketContext.Provider, {
    value,
    children: parameters.children,
  });
}

export function useMassMarketContext() {
  const context = useContext(MassMarketContext);
  if (!context) {
    throw new Error(
      "useMassMarketContext must be used within a MassMarketProvider",
    );
  }
  return context;
}

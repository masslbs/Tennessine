import {
  createContext,
  createElement,
  type Dispatch,
  type SetStateAction,
  useContext,
  useState,
} from "react";
import type { Order } from "@massmarket/schema";
import type { RelayClient } from "@massmarket/client";
import type StateManager from "@massmarket/stateManager";

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
  config: Record<string, string>;
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
    config?: Record<string, string>;
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
    config: parameters.config || {},
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

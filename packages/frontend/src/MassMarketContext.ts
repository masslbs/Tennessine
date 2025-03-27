import React, {
  createContext,
  createElement,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { ClientWithStateManager } from "./ClientWithStateManager.ts";
import { Order } from "@massmarket/schema";

type MassMarketContextType = {
  clientStateManager?: ClientWithStateManager;
  setClientStateManager: Dispatch<
    SetStateAction<ClientWithStateManager | undefined>
  >;
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
    clientStateManager?: ClientWithStateManager;
  }>,
) {
  const [clientStateManager, setClientStateManager] = useState(
    parameters.clientStateManager,
  );
  const [shopDetails, setShopDetails] = useState({
    name: "",
    profilePictureUrl: "",
  });
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const value = {
    clientStateManager,
    setClientStateManager,
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

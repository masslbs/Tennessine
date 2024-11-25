import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";
import { ClientWithStateManager } from "./ClientWithStateManager.ts";
import { OrderId, OrderState } from "./types.ts";

type MassMarketContextType = {
  clientStateManager: ClientWithStateManager | null;
  setClientStateManager: Dispatch<
    SetStateAction<ClientWithStateManager | null>
  >;
  shopDetails: {
    name: string;
    profilePictureUrl: string;
  };
  setShopDetails: Dispatch<
    SetStateAction<{ name: string; profilePictureUrl: string }>
  >;
  currentOrder: {
    orderId: OrderId;
    status: OrderState;
  } | null;
  setCurrentOrderId: Dispatch<
    SetStateAction<{ orderId: OrderId; status: OrderState } | null>
  >;
};

export const MassMarketContext = createContext<MassMarketContextType>({
  // Initial values
  clientStateManager: null,
  setClientStateManager: () => {},
  shopDetails: {
    name: "",
    profilePictureUrl: "",
  },
  setShopDetails: () => {},
  currentOrder: null,
  setCurrentOrderId: () => {},
});

export function MassMarketProvider(
  parameters: React.PropsWithChildren & {
    clientStateManager: ClientWithStateManager | null;
  },
) {
  const [clientStateManager, setClientStateManager] = useState(
    parameters.clientStateManager,
  );
  const [shopDetails, setShopDetails] = useState({
    name: "",
    profilePictureUrl: "",
  });
  const [currentOrder, setCurrentOrderId] = useState<
    {
      orderId: OrderId;
      status: OrderState;
    } | null
  >(null);

  const value = {
    clientStateManager,
    setClientStateManager,
    shopDetails,
    setShopDetails,
    currentOrder,
    setCurrentOrderId,
  };

  return (
    <MassMarketContext.Provider value={value}>
      {parameters.children}
    </MassMarketContext.Provider>
  );
}

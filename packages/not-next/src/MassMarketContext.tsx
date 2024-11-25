import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";
import { ClientWithStateManager } from "./ClientWithStateManager";

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

  const value = {
    clientStateManager,
    setClientStateManager,
    shopDetails,
    setShopDetails,
  };

  return (
    <MassMarketContext.Provider value={value}>
      {parameters.children}
    </MassMarketContext.Provider>
  );
}

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
  queryCache: Map<string, any>;
};

export const MassMarketContext = createContext<MassMarketContextType>({
  // Initial values
  clientStateManager: null,
  setClientStateManager: () => {},
  queryCache: new Map(),
});

export function MassMarketProvider(
  parameters: React.PropsWithChildren & {
    clientStateManager: ClientWithStateManager | undefined;
  },
) {
  const [clientStateManager, setClientStateManager] = useState(
    parameters.clientStateManager,
  );
  const value = {
    clientStateManager,
    setClientStateManager,
  };
  return (
    <MassMarketContext.Provider value={value}>
      {parameters.children}
    </MassMarketContext.Provider>
  );
}

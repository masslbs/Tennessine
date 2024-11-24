import React, { createContext, useState } from "react";
import { ClientWithStateManager } from "./ClientWithStateManager.ts";

export const MassMarketContext = createContext();

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

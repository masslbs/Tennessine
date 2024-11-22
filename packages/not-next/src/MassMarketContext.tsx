import React, { createContext, useState } from "react";

export const MassMarketContext = createContext();

export function MassMarketProvider(
  parameters: React.PropsWithChildren,
) {
  //
  const [clientStateManager, setClientStateManager] = useState();
  const value = {
    clientStateManager,
    setClientStateManager,
    queryCache: new Map(),
  };
  return (
    <MassMarketContext.Provider value={value}>
      {parameters.children}
    </MassMarketContext.Provider>
  );
}

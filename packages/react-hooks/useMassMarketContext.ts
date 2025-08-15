import { useContext } from "react";
import { MassMarketContext } from "./MassMarketContext.ts";
import type { MassMarketContextType } from "./types.ts";

/**
 * This hook provides access to the MassMarket configuration and authentication state
 * from the nearest MassMarketProvider in the component tree.
 * @throws Error if used outside of a MassMarketProvider
 */
export function useMassMarketContext(): MassMarketContextType {
  const context = useContext(MassMarketContext);
  if (!context) {
    throw new Error(
      "useMassMarketContext must be used within a MassMarketProvider",
    );
  }
  return context;
}

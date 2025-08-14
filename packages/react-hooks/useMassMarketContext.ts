import { useContext } from "react";
import {
  MassMarketContext,
  type MassMarketContextType,
} from "./MassMarketContext.ts";

export function useMassMarketContext(): MassMarketContextType {
  const context = useContext(MassMarketContext);
  if (!context) {
    throw new Error(
      "useMassMarketContext must be used within a MassMarketProvider",
    );
  }
  return context;
}

import { useContext } from "react";
import { MassMarketContext } from "./MassMarketContext.ts";

export function useMassMarketContext() {
  const context = useContext(MassMarketContext);
  if (!context) {
    throw new Error(
      "useMassMarketContext must be used within a MassMarketProvider",
    );
  }
  return context;
}

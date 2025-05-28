import { useContext } from "react";
import { MassMarketContext } from "./MassMarketContext.ts";

export function useMassMarketContext() {
  return useContext(MassMarketContext);
}

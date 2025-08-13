import { useLocation } from "@tanstack/react-router";

import Navigation from "./Navigation.tsx";
import MassMarketNav from "./MassMarketNav.tsx";

/**
 *  This controller blocks useKeycard hook from being called during create-shop route, which interferes with the minting and enrolling process.
 */
export default function NavController() {
  const location = useLocation();
  const currentPathname = location.pathname;
  const merchantPath = currentPathname === "/create-shop" ||
    currentPathname === "/merchant-connect";
  if (merchantPath) {
    return <MassMarketNav />;
  } else return <Navigation />;
}

import { createLazyFileRoute } from "@tanstack/react-router";
import MerchantDashboard from "../components/merchants/MerchantDashboard.tsx";

export const Route = createLazyFileRoute("/merchant-dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return <MerchantDashboard />;
}

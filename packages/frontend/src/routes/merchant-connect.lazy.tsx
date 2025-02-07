import { createLazyFileRoute } from "@tanstack/react-router";
import MerchantConnect from "../components/merchants/MerchantConnect.jsx";
export const Route = createLazyFileRoute("/merchant-connect")({
  component: RouteComponent,
});

function RouteComponent() {
  return <MerchantConnect />;
}

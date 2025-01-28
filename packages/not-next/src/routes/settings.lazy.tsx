import { createLazyFileRoute } from "@tanstack/react-router";
import ShopSettings from "../components/merchants/ShopSettings";

export const Route = createLazyFileRoute("/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ShopSettings />;
}

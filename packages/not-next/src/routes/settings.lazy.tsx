import { createLazyFileRoute } from "@tanstack/react-router";
import ShopSettings from "../components/merchants/ShopSettings.tsx";

export const Route = createLazyFileRoute("/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ShopSettings />;
}

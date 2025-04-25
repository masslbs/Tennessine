import { createLazyFileRoute } from "@tanstack/react-router";
import ShippingDetails from "../components/cart/ShippingDetails.tsx";

export const Route = createLazyFileRoute("/shipping")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ShippingDetails />;
}

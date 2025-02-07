import { createLazyFileRoute } from "@tanstack/react-router";
import CheckoutFlow from "../components/cart/CheckoutFlow.jsx";

export const Route = createLazyFileRoute("/checkout")({
  component: RouteComponent,
});

function RouteComponent() {
  return <CheckoutFlow />;
}

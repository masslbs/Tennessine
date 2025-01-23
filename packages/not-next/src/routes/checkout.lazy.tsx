import { createLazyFileRoute } from "@tanstack/react-router";
import CheckoutFlow from "../components/cart/CheckoutFlow.tsx";

export const Route = createLazyFileRoute("/checkout")({
  component: RouteComponent,
});

function RouteComponent() {
  return <CheckoutFlow />;
}

import { createLazyFileRoute } from "@tanstack/react-router";
import CheckoutFlow from "../components/cart/Checkout.tsx";

export const Route = createLazyFileRoute("/checkout")({
  component: RouteComponent,
});

function RouteComponent() {
  return <CheckoutFlow />;
}

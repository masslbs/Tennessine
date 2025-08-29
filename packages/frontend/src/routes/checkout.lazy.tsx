import { createLazyFileRoute } from "@tanstack/react-router";
import Checkout from "../components/cart/Checkout.tsx";

export const Route = createLazyFileRoute("/checkout")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Checkout />;
}

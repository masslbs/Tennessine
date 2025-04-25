import { createLazyFileRoute } from "@tanstack/react-router";
import ChoosePayment from "../components/cart/ChoosePayment.tsx";

export const Route = createLazyFileRoute("/pay")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ChoosePayment />;
}

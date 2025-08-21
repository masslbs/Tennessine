import { createLazyFileRoute } from "@tanstack/react-router";
import OrderDetails from "../../components/merchants/OrderDetails.tsx";

export const Route = createLazyFileRoute("/merchants/order-details")({
  component: RouteComponent,
});

function RouteComponent() {
  return <OrderDetails />;
}

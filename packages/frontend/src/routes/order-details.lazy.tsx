import { createLazyFileRoute } from "@tanstack/react-router";
import OrderDetails from "../components/merchants/OrderDetails.jsx";

export const Route = createLazyFileRoute("/order-details")({
  component: RouteComponent,
});

function RouteComponent() {
  return <OrderDetails />;
}

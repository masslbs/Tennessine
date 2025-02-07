import { createLazyFileRoute } from "@tanstack/react-router";
import ManageOrders from "../components/merchants/Orders.jsx";

export const Route = createLazyFileRoute("/orders")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ManageOrders />;
}

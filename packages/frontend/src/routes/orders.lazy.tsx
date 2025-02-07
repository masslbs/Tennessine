import { createLazyFileRoute } from "@tanstack/react-router";
import ManageOrders from "../components/merchants/Orders.tsx";

export const Route = createLazyFileRoute("/orders")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ManageOrders />;
}

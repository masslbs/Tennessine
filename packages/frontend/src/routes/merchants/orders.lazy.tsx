import { createLazyFileRoute } from "@tanstack/react-router";
import Orders from "../../components/merchants/Orders.tsx";

export const Route = createLazyFileRoute("/merchants/orders")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Orders />;
}

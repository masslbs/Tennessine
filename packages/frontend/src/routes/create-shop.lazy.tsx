import { createLazyFileRoute } from "@tanstack/react-router";
import CreateShop from "../components/merchants/create-shop/CreateShop.jsx";

export const Route = createLazyFileRoute("/create-shop")({
  component: RouteComponent,
});

function RouteComponent() {
  return <CreateShop />;
}

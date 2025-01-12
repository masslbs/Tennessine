import { createLazyFileRoute } from "@tanstack/react-router";
import EditProduct from "../components/merchants/products/EditProduct.tsx";

export const Route = createLazyFileRoute("/edit-product")({
  component: RouteComponent,
});

function RouteComponent() {
  return <EditProduct />;
}

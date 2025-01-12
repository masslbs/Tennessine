import { createLazyFileRoute } from "@tanstack/react-router";
import ProductDetail from "../components/ProductDetail.tsx";

export const Route = createLazyFileRoute("/product-detail")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ProductDetail />;
}

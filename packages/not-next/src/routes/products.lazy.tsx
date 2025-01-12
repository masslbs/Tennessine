import { createLazyFileRoute } from "@tanstack/react-router";
import Listings from "../components/merchants/products/Listings.tsx";

export const Route = createLazyFileRoute("/products")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Listings />;
}

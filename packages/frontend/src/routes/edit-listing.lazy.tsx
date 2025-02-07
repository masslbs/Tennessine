import { createLazyFileRoute } from "@tanstack/react-router";
import EditProduct from "../components/merchants/listings/EditListing.tsx";

export const Route = createLazyFileRoute("/edit-listing")({
  component: RouteComponent,
});

function RouteComponent() {
  return <EditProduct />;
}

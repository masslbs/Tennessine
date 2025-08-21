import { createLazyFileRoute } from "@tanstack/react-router";
import EditListing from "../../components/merchants/listings/EditListing.tsx";

export const Route = createLazyFileRoute("/merchants/edit-listing")({
  component: RouteComponent,
});

function RouteComponent() {
  return <EditListing />;
}

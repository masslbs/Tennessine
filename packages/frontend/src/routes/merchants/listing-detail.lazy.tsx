import { createLazyFileRoute } from "@tanstack/react-router";
import ListingDetail from "../../components/ListingDetail.tsx";

export const Route = createLazyFileRoute("/merchants/listing-detail")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ListingDetail />;
}

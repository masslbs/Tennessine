import { createLazyFileRoute } from "@tanstack/react-router";
import ListingDetail from "../components/ListingDetail.jsx";

export const Route = createLazyFileRoute("/listing-detail")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ListingDetail />;
}

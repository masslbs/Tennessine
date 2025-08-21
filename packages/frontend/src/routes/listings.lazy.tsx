import { createLazyFileRoute } from "@tanstack/react-router";
import CustomerViewListings from "../components/CustomerViewListings.tsx";

export const Route = createLazyFileRoute("/listings")({
  component: RouteComponent,
});

function RouteComponent() {
  return <CustomerViewListings />;
}

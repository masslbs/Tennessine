import { createLazyFileRoute } from "@tanstack/react-router";
import MerchantViewListings from "../../components/merchants/listings/MerchantViewListings.tsx";

export const Route = createLazyFileRoute("/merchants/listings")({
  component: RouteComponent,
});

function RouteComponent() {
  return <MerchantViewListings />;
}

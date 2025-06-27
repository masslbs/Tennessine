import { createLazyFileRoute } from "@tanstack/react-router";
// import Listings from "../components/Listings.tsx";
import ShopsOverview from "../components/ShopsOverview.tsx";

export const Route = createLazyFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ShopsOverview />;
}

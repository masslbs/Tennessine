import { createLazyFileRoute } from "@tanstack/react-router";
import Listings from "../components/Listings.tsx";

export const Route = createLazyFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Listings />;
}

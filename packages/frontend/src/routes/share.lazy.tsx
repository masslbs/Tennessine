import { createLazyFileRoute } from "@tanstack/react-router";
import Share from "../components/Share.tsx";

export const Route = createLazyFileRoute("/share")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Share />;
}

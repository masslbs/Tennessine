import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/checkout")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/checkout"!</div>;
}

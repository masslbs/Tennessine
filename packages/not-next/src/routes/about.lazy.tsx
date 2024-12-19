import { createLazyFileRoute } from "@tanstack/react-router";
export const Route = createLazyFileRoute("/about")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <p>This is the about page</p>
    </div>
  );
}

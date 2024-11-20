import * as React from "react";
import { createLazyFileRoute, Link } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Link to="/about">About</Link>
    </div>
  );
}

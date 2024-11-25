import React from "react";

import { createLazyFileRoute } from "@tanstack/react-router";
import CreateStore from "../components/merchants/CreateStore";

export const Route = createLazyFileRoute("/create-store")({
  component: RouteComponent,
});

function RouteComponent() {
  return <CreateStore />;
}

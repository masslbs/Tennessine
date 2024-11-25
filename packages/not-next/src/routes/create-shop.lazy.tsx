// import React from "react";

import { createLazyFileRoute } from "@tanstack/react-router";
// import CreateShop from "../components/merchants/CreateShop.tsx";

export const Route = createLazyFileRoute("/create-shop")({
  component: RouteComponent,
});

function RouteComponent() {
  // return <CreateShop />;
}

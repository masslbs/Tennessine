import { createLazyFileRoute } from "@tanstack/react-router";
import MyShops from "../components/merchants/MyShops.tsx";

export const Route = createLazyFileRoute("/my-shops")({
  component: RouteComponent,
});

function RouteComponent() {
  return <MyShops />;
}

import { createLazyFileRoute } from "@tanstack/react-router";
import ConnectMerchant from "../components/merchants/ConnectMerchant.tsx";

export const Route = createLazyFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ConnectMerchant />;
}

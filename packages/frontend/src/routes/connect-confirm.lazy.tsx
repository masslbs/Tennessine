import { createLazyFileRoute } from "@tanstack/react-router";
import ConnectConfirmation from "../components/merchants/ConnectConfirmation.jsx";

export const Route = createLazyFileRoute("/connect-confirm")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ConnectConfirmation />;
}

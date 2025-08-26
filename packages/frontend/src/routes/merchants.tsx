import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { useKeycard } from "@massmarket/react-hooks";

export const Route = createFileRoute("/merchants")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { keycard } = useKeycard();
  if (keycard && keycard.role !== "merchant") {
    navigate({ to: "/" });
  }
  return <Outlet />;
}

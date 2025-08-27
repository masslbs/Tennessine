import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { useKeycard } from "@massmarket/react-hooks";

export const Route = createFileRoute("/merchants")({
  component: RouteComponent,
});

/**
 * This ensures that if the current keycard is not of role type merchant and the user is on any /merchants screen, they are redirected to the root route.
 * This is for cases when merchants disconnect their wallet account while on a /merchants screen.
 */
function RouteComponent() {
  const navigate = useNavigate();
  const { keycard } = useKeycard();

  if (keycard && keycard.role !== "merchant") {
    navigate({ to: "/" });
  }
  return <Outlet />;
}

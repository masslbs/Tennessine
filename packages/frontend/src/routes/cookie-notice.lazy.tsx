import { createLazyFileRoute } from "@tanstack/react-router";
import CookieNotice from "../components/CookieNotice.tsx";

export const Route = createLazyFileRoute("/cookie-notice")({
  component: RouteComponent,
});

function RouteComponent() {
  return <CookieNotice />;
}

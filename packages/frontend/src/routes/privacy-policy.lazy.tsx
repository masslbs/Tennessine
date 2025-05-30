import { createLazyFileRoute } from "@tanstack/react-router";
import PrivacyPolicy from "../components/PrivacyPolicy.tsx";

export const Route = createLazyFileRoute("/privacy-policy")({
  component: RouteComponent,
});

function RouteComponent() {
  return <PrivacyPolicy />;
}

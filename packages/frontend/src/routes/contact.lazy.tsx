import { createLazyFileRoute } from "@tanstack/react-router";
import Contact from "../components/Contact.tsx";

export const Route = createLazyFileRoute("/contact")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Contact />;
}

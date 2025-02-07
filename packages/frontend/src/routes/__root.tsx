import { createRootRoute, Outlet } from "@tanstack/react-router";
import Navigation from "../components/Navigation.tsx";

export const Route = createRootRoute({
  component: () => {
    return (
      <main>
        <Navigation />
        <Outlet />
      </main>
    );
  },
});

import { createRootRoute, Outlet } from "@tanstack/react-router";
import Navigation from "../components/Navigation.jsx";

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

import { createRootRoute, Outlet } from "@tanstack/react-router";
import Navigation from "../components/Navigation.tsx";
import Footer from "../components/Footer.tsx";

export const Route = createRootRoute({
  component: () => {
    return (
      <main className="h-screen flex flex-col">
        <Navigation />
        <Outlet />
        <Footer />
      </main>
    );
  },
});

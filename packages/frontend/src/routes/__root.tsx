import { createRootRoute, Outlet } from "@tanstack/react-router";
import CookieBanner from "react-cookie-banner";

import Navigation from "../components/Navigation.tsx";
import Footer from "../components/Footer.tsx";

export const Route = createRootRoute({
  component: () => {
    return (
      <main className="h-screen flex flex-col" id="top">
        <CookieBanner
          message="Yes, we use cookies. If you don't like it change website, we won't miss you!"
          onAccept={() => {
            import("../matomo.js").catch((e) => {
              console.log(`failed to load matomo ${e}`);
            });
          }}
        />
        <Navigation />
        <Outlet />
        <Footer />
      </main>
    );
  },
});

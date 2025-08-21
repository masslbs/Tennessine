import { createRootRoute, Outlet } from "@tanstack/react-router";
import Navigation from "../components/Navigation.tsx";
import Footer from "../components/Footer.tsx";
import CookieBanner from "../components/CookieBanner.tsx";
import KeycardEnrollModal from "../components/common/KeycardEnrollModal.tsx";

export const Route = createRootRoute({
  component: () => {
    return (
      <main className="h-screen flex flex-col" id="top">
        <CookieBanner />
        <Navigation />
        <KeycardEnrollModal />
        {/* Top margin on every screen to compensate for sticky nav */}
        <div className="mt-[56px]">
          <Outlet />
        </div>
        <Footer />
      </main>
    );
  },
});

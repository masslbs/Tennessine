import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

import { getLogger } from "@logtape/logtape";

import { CookieConsent } from "../types.ts";

const logger = getLogger(["mass-market", "frontend", "cookie-banner"]);

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const sessionConsent = sessionStorage.getItem("cookieConsent");

  useEffect(() => {
    if (sessionConsent) {
      setConsent(sessionConsent as CookieConsent);
      if (sessionConsent === "accepted") {
        import("../matomo.js").catch((e) => {
          console.warn(`failed to load matomo ${e}`);
        });
      }
    } else {
      // Only show cookie banner if cookie consent is not found in session storage.
      setIsVisible(true);
    }
  }, [sessionConsent]);

  const handleAccept = () => {
    setConsent("accepted");
    setIsVisible(false);
    sessionStorage.setItem("cookieConsent", "accepted");
    logger.debug`Cookies accepted`;
  };

  const handleReject = () => {
    setConsent("rejected");
    setIsVisible(false);
    sessionStorage.setItem("cookieConsent", "rejected");
    logger.debug`Cookies rejected`;
  };

  if (!isVisible && consent) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-700 text-white p-4 md:px-14">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-2">Cookie Notice</h3>
          <p className="text-sm">
            Please accept our (absolutely minimal) cookies to help us improve
            your experience on our site. View our{" "}
            <Link
              to="/cookie-notice"
              className="underline hover:text-gray-200"
            >
              Cookie Notice
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy-policy"
              className="underline hover:text-gray-200"
            >
              Privacy Policy
            </Link>{" "}
            to learn more.
          </p>
        </div>
        <div className="flex md:flex-col gap-3 mt-3 md:mt-0">
          <button
            onClick={handleAccept}
            className="bg-[#3b513e] px-6 py-2 rounded-md cursor-pointer"
            type="button"
          >
            Accept All
          </button>
          <button
            onClick={handleReject}
            className="bg-gray-500 px-6 py-2 rounded-md cursor-pointer"
            type="button"
          >
            Reject All
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;

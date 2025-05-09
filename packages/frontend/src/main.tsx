import "web-streams-polyfill/polyfill";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { env } from "./utils/env.ts";
import releaseInfo from "./release-info.json" with { type: "json" };

// Dynamically import matomo, so that if the load fail because of blockers
// the page will still work
import("./matomo.js").catch((e) => {
  console.log(`failed to load matomo ${e}`);
});

if (env.sentryDSN) {
  // also dynamically loading because of ad blockers
  import("@sentry/browser").then((Sentry) => {
    const isProd = env.chainName === "mainnet";
    Sentry.init({
      dsn: env.sentryDSN,
      release: `tennessine@${releaseInfo.version}`, // TODO: we should start tagging our builds...
      environment: isProd ? "production" : "development",
      tracesSampleRate: isProd ? 0.1 : 1.0,
    });
  });
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

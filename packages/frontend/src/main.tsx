import "web-streams-polyfill/polyfill";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import * as Sentry from "@sentry/browser";
import { env } from "./utils/env.ts";
import releaseInfo from "./release-info.json" with { type: "json" };

const isProd = env.chainName === "mainnet";

if (env.sentryDSN) {
  Sentry.init({
    dsn: env.sentryDSN,
    release: `tennessine@${releaseInfo.version}`, // TODO: we should start tagging our builds...
    environment: isProd ? "production" : "development",
    tracesSampleRate: isProd ? 0.1 : 1.0,
  });
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

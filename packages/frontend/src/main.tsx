import "web-streams-polyfill/polyfill";
import { init } from "@sentry/browser";
import { configure, getConsoleSink } from "@logtape/logtape";
import { getSentrySink } from "@logtape/sentry";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { env } from "./utils/env.ts";
import releaseInfo from "./release-info.json" with { type: "json" };
const isProd = env.chainName === "mainnet";

let sentryClient;
if (env.sentryDSN) {
  sentryClient = init({
    dsn: env.sentryDSN,
    environment: isProd ? "production" : "development",
    release: `tennessine@${releaseInfo.version}`, // TODO: we should start tagging our builds...
    tracesSampleRate: isProd ? 0.1 : 1.0,
  });
}

await configure({
  sinks: {
    sentry: getSentrySink(sentryClient as undefined),
    console: getConsoleSink(),
  },
  loggers: [
    isProd
      ? { category: ["mass-market"], sinks: ["sentry"], level: "warning" }
      : { category: [], sinks: ["console"], level: "debug" },
  ],
});

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

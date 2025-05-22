import "web-streams-polyfill/polyfill";
import { init } from "@sentry/browser";
import { Config, configure, getConsoleSink } from "@logtape/logtape";
import { getSentrySink } from "@massmarket/logtape-sentry-sink";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { env } from "./utils/env.ts";
import releaseInfo from "./release-info.json" with { type: "json" };

const isSentryEnabled = env.sentryDSN !== undefined;

const sentryConfig: Config<string, string> = {
  sinks: {
    console: getConsoleSink(),
  },
  loggers: [
    { category: [], sinks: ["console"], level: "debug" },
  ],
};
if (isSentryEnabled) {
  const isProd = env.chainName === "mainnet";
  const sentryClient = init({
    dsn: env.sentryDSN,
    environment: isProd ? "production" : "development",
    release: `tennessine@${releaseInfo.version}`, // TODO: we should start tagging our builds...
    tracesSampleRate: isProd ? 0.1 : 1.0,
  });
  sentryConfig.sinks.sentry = getSentrySink(sentryClient as undefined);
  sentryConfig.loggers.push({
    category: ["mass-market"],
    sinks: ["sentry"],
    level: "warning",
  });
}
await configure(sentryConfig);

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

import "web-streams-polyfill/polyfill";
import { init, setTag } from "@sentry/browser";
import {
  Config,
  configure,
  defaultTextFormatter,
  getConsoleSink,
} from "@logtape/logtape";
import { getSentrySink } from "@massmarket/logtape-sentry-sink";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { env } from "./utils/env.ts";
import { taggedKeys } from "./utils/mod.ts";
import releaseInfo from "./release-info.json" with { type: "json" };

const isSentryEnabled = env.sentryDSN !== undefined;

const sentryConfig: Config<string, string> = {
  sinks: {
    console: getConsoleSink({ formatter: defaultTextFormatter }),
  },
  loggers: [
    { category: [], sinks: ["console"], lowestLevel: "debug" },
    // silence logtape's default warnings about meta logging
    { category: ["logtape", "meta"], lowestLevel: "warning", sinks: [] },
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
  sentryConfig.sinks.sentry = getSentrySink(
    setTag,
    taggedKeys,
    sentryClient as undefined,
  );
  sentryConfig.loggers.push({
    category: ["mass-market"],
    sinks: ["sentry"],
    lowestLevel: "warning",
  });
}
await configure(sentryConfig);

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App massMarketConfig={env} />
  </StrictMode>,
);

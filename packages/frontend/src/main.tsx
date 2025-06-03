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
const isLocalDeploy = env.chainName === "hardhat" ||
  (typeof env.chainName === "undefined");
const isProd = env.chainName === "mainnet";

const massLowestLevelLogger = isProd ? "warning" : "debug";

const sentryConfig: Config<string, string> = {
  sinks: {
    console: getConsoleSink({ formatter: defaultTextFormatter }),
  },
  loggers: [
    {
      category: ["mass-market"],
      sinks: ["console"],
      lowestLevel: massLowestLevelLogger,
    },
    // silence logtape's default warnings about meta logging
    { category: ["logtape", "meta"], lowestLevel: "warning", sinks: [] },
  ],
};

if (isSentryEnabled && !isLocalDeploy) {
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
}
await configure(sentryConfig);

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App massMarketConfig={env} />
  </StrictMode>,
);

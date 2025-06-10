import "web-streams-polyfill/polyfill";
import { init, setContext, setTag } from "@sentry/browser";
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

const sentryConfig: Config<string, string> = {
  sinks: {
    console: getConsoleSink({ formatter: defaultTextFormatter }),
  },
  loggers: [
    {
      category: ["mass-market"],
      sinks: ["console"],
      lowestLevel: "debug", // default to debug logger. this is overridden to "warning" if sentry is enabled -- see below
    },
    // silence logtape's default warnings about meta logging
    { category: ["logtape", "meta"], lowestLevel: "warning", sinks: [] },
  ],
};

const getMassBrowserDebug = () => {
  const params = new URLSearchParams(globalThis.location.search);
  return params.has("mass-debug") && params.get("mass-debug") === "true";
};

if (getMassBrowserDebug()) {
  sentryConfig.loggers.push({
    category: ["mass-market", "relay-client"],
    sinks: ["console"],
    lowestLevel: "debug",
  });
}

if (isSentryEnabled && !isLocalDeploy) {
  const sentryClient = init({
    dsn: env.sentryDSN,
    environment: isProd ? "production" : "development",
    release: `tennessine@${releaseInfo.version}`, // TODO: we should start tagging our builds...
    tracesSampleRate: isProd ? 0.1 : 1.0,
  });
  sentryConfig.sinks.sentry = getSentrySink(
    setTag,
    setContext,
    taggedKeys,
    sentryClient as undefined,
  );
  // make sure the "mass-market" logger also pushes out logs to the new sentry sink
  const massIndex = sentryConfig.loggers.findIndex((logger) =>
    logger.category[0] === "mass-market"
  );
  // if sentry is enabled, then set the lowestLevel to warning
  sentryConfig.loggers[massIndex].sinks?.push("sentry");
  sentryConfig.loggers[massIndex].lowestLevel = "warning";
}
await configure(sentryConfig);

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App massMarketConfig={env} />
  </StrictMode>,
);

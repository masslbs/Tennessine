import { logger } from "@massmarket/utils";
import { env } from "./utils/env.ts";
const url = env.matomoURL;

const namespace = "frontend: matomo";
const debug = logger(namespace, "debug");

if (url) {
  debug("loading matomo", url);

  const _mtm = globalThis._mtm = globalThis._mtm || [];
  _mtm.push({ "mtm.startTime": (new Date().getTime()), "event": "mtm.Start" });
  await import(url);
}

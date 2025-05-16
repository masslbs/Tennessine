import { getLogger } from "@logtape/logtape";
import { env } from "./utils/env.ts";
const url = env.matomoURL;

const logger = getLogger(["mass-market", "frontend", "matomo"]);

if (url) {
  logger.debug`loading matomo ${url}`;

  const _mtm = globalThis._mtm = globalThis._mtm || [];
  _mtm.push({ "mtm.startTime": (new Date().getTime()), "event": "mtm.Start" });
  await import(url);
}

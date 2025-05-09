import { env } from "./utils/env.ts";
const url = env.matomoURL;

if (url) {
  const _mtm = globalThis._mtm = globalThis._mtm || [];
  _mtm.push({ "mtm.startTime": (new Date().getTime()), "event": "mtm.Start" });
  await import(url);
}

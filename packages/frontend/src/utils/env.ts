export type EnvConfig = {
  chainName: string;
  relayEndpoint?: string;
  relayTokenId?: `0x${string}`;
  shopTokenId?: `0x${string}`;
  sentryDSN?: string;
  ethRPCUrl?: string;
  matomoURL?: string;
};

import { envConfig as envVite } from "./env-vite.ts";
import { envConfig as envProd } from "./env-production.ts";

let mode = "development";
// @ts-ignore TODO(issue 318): how can we teach deno to play with vite's env files?
const viteEnv = Reflect.get(import.meta, "env");
if (viteEnv && viteEnv.MODE) {
  mode = viteEnv.MODE;
} else if (typeof Deno !== "undefined" && Deno.env.get("MODE")) {
  mode = Deno.env.get("MODE")!;
}
const isProduction = mode === "production";

export const env: EnvConfig = isProduction ? envProd : envVite;

// Check if running in a HappyDOM environment (likely testing)
export const isTesting = typeof globalThis !== "undefined" &&
  !!(globalThis as unknown as { happyDOM: boolean }).happyDOM;

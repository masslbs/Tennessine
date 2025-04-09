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
if (import.meta.env && import.meta.env.MODE) {
  mode = import.meta.env.MODE;
} else if (Deno && Deno.env.get("MODE")) {
  mode = Deno.env.get("MODE")!;
}
const isProduction = mode === "production";

export const env: EnvConfig = isProduction ? envProd : envVite;

// Check if running in a HappyDOM environment (likely testing)
export const isTesting = typeof globalThis !== "undefined" &&
  // @ts-ignore TODO: is there a better way to check for happydom?
  !!(globalThis as any).happyDOM;

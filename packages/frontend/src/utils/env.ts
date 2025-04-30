import * as path from "jsr:@std/path";
import parseDotenv from "./parse-dotenv.ts";

export type EnvConfig = {
  chainName: string;
  relayEndpoint?: string;
  relayTokenId?: `0x${string}`;
  shopTokenId?: `0x${string}`;
  sentryDSN?: string;
  ethRPCUrl?: string;
  matomoURL?: string;
};

// Check if running in a HappyDOM environment (likely testing)
export const isTesting = typeof globalThis !== "undefined" &&
  !!(globalThis as unknown as { happyDOM: boolean }).happyDOM;

let mode = "development";
const viteEnv = (import.meta as unknown as { env: { MODE: string } }).env;
if (viteEnv && viteEnv.MODE) {
  mode = viteEnv.MODE;
} else if (typeof Deno !== "undefined" && Deno.env.get("MODE")) {
  mode = Deno.env.get("MODE")!;
}

// TODO (@alp 2024-04-29): define more specific types
type DotEnvFormat = {
  VITE_CHAIN_NAME: string;
  VITE_RELAY_ENDPOINT?: string;
  VITE_RELAY_TOKEN_ID?: string;
  VITE_SENTRY_DSN?: string;
  VITE_ETH_RPC_URL?: string;
  VITE_MATOMO_URL?: string;
  VITE_SHOP_TOKEN_ID?: string;
};

declare global {
  let __ENV__: DotEnvFormat;
}

function getEnv(): EnvConfig {
  let theEnv: DotEnvFormat;
  if (isTesting) {
    // loads .env from disk for testing. we do it this way because vite isn't running and we can't
    // access .env through the mechanism used outside testing (see 'else' branch). this is possible because
    // during testing we can access the file system

    // NOTE (@alp 2025-04-29): `dotenvPath` is relative to the folder `env.ts` lives in. if that file, or its parent directory moves, this needs to be updated :)
    const dirname = import.meta.dirname as string;
    const dotenvPath = path.join(dirname, "..", "..");
    const modeSuffix = (mode === "development" || mode === "production")
      ? `.${mode}`
      : "";
    const modePath = path.join(dotenvPath, `.env${modeSuffix}`);
    const text: string = Deno.readTextFileSync(modePath);
    theEnv = parseDotenv(text);
  } else {
    // otherwise, get it from the esbuild's defined value __ENV__. during runtime and build, the value will contain the
    // values from the correct .env.[development|production], depending on the runtime mode.

    // when in browser && development, use Reflect to access __ENV__
    if (mode === "development") {
      theEnv = Reflect.get(globalThis, "__ENV__");
    } else if (mode === "production") {
      // during production builds: esbuild only replaces exactly the __ENV__ variable in code, so builds need to reference the variable directly (and not indirectly via a Reflect call)
      theEnv = __ENV__;
    } else {
      throw new Error(
        `env.ts: should not hit this branch; mode was ${mode} which is not production nor development`,
      );
    }
  }
  return {
    chainName: theEnv?.VITE_CHAIN_NAME,
    ethRPCUrl: theEnv?.VITE_ETH_RPC_URL,
    shopTokenId: theEnv?.VITE_SHOP_TOKEN_ID as `0x${string}`,
    relayEndpoint: theEnv?.VITE_RELAY_ENDPOINT,
    relayTokenId: theEnv?.VITE_RELAY_TOKEN_ID as `0x${string}`,
    sentryDSN: theEnv?.VITE_SENTRY_DSN,
    matomoURL: theEnv?.VITE_MATOMO_URL,
  };
}

export const env: EnvConfig = getEnv();

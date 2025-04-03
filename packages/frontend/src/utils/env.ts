// Vite uses import.meta.env, but deno doesn't.
// This is a workaround for deno test ts check
export const env = Reflect.get(import.meta, "env");
export const defaultRPC = (env?.VITE_ETH_RPC_URL) ||
  "http://localhost:8545";

// Check if running in a HappyDOM environment (likely testing)
export const isTesting = typeof globalThis !== "undefined" &&
  // @ts-ignore TODO: is there a better way to check for happydom?
  !!(globalThis as any).happyDOM;

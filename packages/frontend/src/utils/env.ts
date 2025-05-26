import { load } from "jsr:@std/dotenv";
let env = (import.meta as unknown as { env: Record<string, string> }).env;

if (!env) {
  env = await load();
}

export { env };

// Check if running in a HappyDOM environment (likely testing)
export const isTesting = typeof globalThis !== "undefined" &&
  !!(globalThis as unknown as { happyDOM: boolean }).happyDOM;

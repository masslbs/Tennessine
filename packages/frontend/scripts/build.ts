import { build } from "rolldown-vite";
import config from "./vite.ts";

await build(
  config({ mode: "production", command: "build" }),
);

// Vite spawns esbuild which prevents this from exiting automatically
Deno.exit(0);

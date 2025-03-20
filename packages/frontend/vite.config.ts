import { defineConfig, PluginOption } from "vite";
import deno from "@deno/vite-plugin";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { entryPoints } from "./scripts/generate-entry-points.ts";

// Take all the routes and create an object with the route name as the key and the index.html as the value.
const buildInputs = Object.fromEntries(
  entryPoints.map((path) => [path, "index.html"]),
);

export default defineConfig({
  build: {
    rollupOptions: {
      input: buildInputs,
    },
    outDir: "dist",
    copyPublicDir: true,
  },
  plugins: [
    deno() as PluginOption,
    react(),
    TanStackRouterVite({ addExtensions: true }),
    nodePolyfills() as PluginOption,
  ],
});

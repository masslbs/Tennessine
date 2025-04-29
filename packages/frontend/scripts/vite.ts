import { defineConfig, PluginOption } from "vite";
import deno from "@deno/vite-plugin";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import tailwindcss from "@tailwindcss/vite";

// only needed for the build
import { entryPoints } from "./generate-entry-points.ts";
// Take all the routes and create an object with the route name as the key and the index.html as the value.
const buildInputs = Object.fromEntries(
  entryPoints.map((path) => [path, "index.html"]),
);

export const config = defineConfig({
  server: {
    port: 8000,
  },
  build: {
    rollupOptions: {
      input: buildInputs,
    },
    outDir: "dist",
    copyPublicDir: true,
    sourcemap: true,
  },
  plugins: [
    deno() as PluginOption,
    react(),
    TanStackRouterVite({ addExtensions: true }),
    nodePolyfills() as PluginOption,
    tailwindcss() as PluginOption,
  ],
  optimizeDeps: {
    include: [
      // This prebundles the secp256k1 dependency which is used by some functions imported by viem (e.g. recoverPublicKey)
      // Since the imported function uses dynamic import of this dependency. Dynamic import of modules seems to cause errors with vite.
      "@noble/secp256k1",
    ],
  },
});

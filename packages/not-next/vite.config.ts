import { defineConfig, PluginOption } from "vite";
import deno from "@deno/vite-plugin";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tailwindcss from "tailwindcss";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  plugins: [
    deno(),
    react(),
    TanStackRouterVite({ addExtensions: true }),
    nodePolyfills() as PluginOption,
  ],
});

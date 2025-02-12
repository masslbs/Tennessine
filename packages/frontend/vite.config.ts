import { defineConfig, PluginOption } from "vite";
import deno from "@deno/vite-plugin";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tailwindcss from "tailwindcss";
import { nodePolyfills } from "vite-plugin-node-polyfills";

const entryPoints = ['listings']
export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  build: {
    rollupOptions: {
      input: {
        listings: 'index.html',
      }
    },
    outDir: 'dist',
    copyPublicDir: true,
  },

  plugins: [
    deno(),
    react(),
    TanStackRouterVite({ addExtensions: true }),
    nodePolyfills() as PluginOption,
    {
      name: 'copy-html-to-subdirs',
      async closeBundle() {
        for (const entry of entryPoints) {
          await Deno.mkdir(`dist/${entry}`, { recursive: true });
          await Deno.copyFile('dist/index.html', `dist/${entry}/index.html`);
        }
      }
    }
  ],
});

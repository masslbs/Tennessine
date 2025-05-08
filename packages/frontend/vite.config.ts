import { defineConfig, loadEnv, PluginOption } from "vite";
import deno from "@deno/vite-plugin";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
// only needed for the build
import { entryPoints } from "./scripts/generate-entry-points.ts";
// Take all the routes and create an object with the route name as the key and the index.html as the value.
const buildInputs = Object.fromEntries(
  entryPoints.map((path) => [path, "index.html"]),
);

export default defineConfig(({ mode }) => {
  const dirname = import.meta.dirname as string;
  const env = loadEnv(mode, dirname);
  return {
    build: {
      rollupOptions: {
        input: buildInputs,
      },
      outDir: "dist",
      copyPublicDir: true,
    },
    define: {
      __ENV__: JSON.stringify(env),
      __MODE__: JSON.stringify(mode),
    },
    plugins: [
      deno() as PluginOption,
      react(),
      TanStackRouterVite({ addExtensions: true }),
      tailwindcss() as PluginOption,
    ],
    optimizeDeps: {
      include: [
        // This prebundles the secp256k1 dependency which is used by some functions imported by viem (e.g. recoverPublicKey)
        // Since the imported function uses dynamic import of this dependency. Dynamic import of modules seems to cause errors with vite.
        "@noble/secp256k1",
      ],
    },
  };
});

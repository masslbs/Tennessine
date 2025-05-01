import { defineConfig, loadEnv, PluginOption } from "rolldown-vite";
import { normalize } from "@std/path";
import deno from "@deno/vite-plugin";
import react from "@vitejs/plugin-react-swc";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
// only needed for the build
import { entryPoints } from "./generate-entry-points.ts";
// Take all the routes and create an object with the route name as the key and the index.html as the value.
const buildInputs = Object.fromEntries(
  entryPoints.map((path) => [path, "index.html"]),
);

const dirname = normalize(import.meta.dirname! + "/../");
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, dirname);
  return {
    build: {
      rollupOptions: {
        input: buildInputs,
        logLevel: "debug",
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
      react() as PluginOption,
      TanStackRouterVite({ addExtensions: true }) as PluginOption,
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

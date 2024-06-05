// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: MIT
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import path from "path";

export default defineConfig({
  test: {
    include: ["test/*.test.ts"],
    browser: {
      name: "chromium",
      provider: "playwright",
      headless: true,
      providerOptions: {
        launch: {
          // we should only add these in CI
          args: ["--no-sandbox", "--no-zygote"],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../frontend/src/"),
      "@/reducers/*": path.resolve(__dirname, "../frontend/src/reducers"),
      "@/utils/*": path.resolve(__dirname, "../frontend/src/utils"),
    },
  },
  plugins: [
    nodePolyfills({
      // Override the default polyfills for specific modules.
      overrides: {
        // Since `fs` is not supported in browsers, we can use the `memfs` package to polyfill it.
        fs: "memfs",
      },
    }),
  ],
});

// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { defineConfig } from "vitest/config";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, ".env.development") });

export default defineConfig({
  test: {
    coverage: {
      reporter: ["text", "json", "html"],
    },
    environment: "happy-dom",
    exclude: [
      "**/.{idea,git,cache,output,temp}/**",
      "**/cypress/**",
      "**/dist/**",
      "**/node_modules/**",
      "./test/pages/**",
    ],
    globals: true,
    setupFiles: ["./tests/setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

/** @type {import('next').NextConfig} */
const cfg = {
  output: "export",
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["ipfs.io"],
  },
  trailingSlash: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty");
    return config;
  },
};

import { withSentryConfig } from "@sentry/nextjs";

export default withSentryConfig(cfg, {
  org: "massmarket",
  project: "app",
  sentryUrl: "https://glitchtip.mass.market/",
  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: false,
  // Automatically annotate React components to show their full name in breadcrumbs and session replay
  reactComponentAnnotation: {
    enabled: true,
  },
  // Hides source maps from generated client bundles
  hideSourceMaps: false,
  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: false,
  // Disable release creation, until fixed: https://gitlab.com/glitchtip/glitchtip-backend/-/issues/356
  release: {
    create: false,
    finalize: false,
  },
  sourcemaps: {
    disable: true,
  },
});

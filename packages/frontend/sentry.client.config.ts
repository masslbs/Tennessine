import * as Sentry from "@sentry/nextjs";
const isProd = process.env.NEXT_PUBLIC_CHAIN_NAME == "mainnet";
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: isProd ? "production" : "development",
});

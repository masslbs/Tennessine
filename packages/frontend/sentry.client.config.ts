import * as Sentry from "@sentry/nextjs";
import process from "node:process";
const isProd = process.env.NEXT_PUBLIC_CHAIN_NAME == "mainnet";
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: isProd ? "production" : "development",
});

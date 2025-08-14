import type { MassMarketConfig } from "./MassMarketContext.ts";
/**
 * Common parameters for all hooks
 */
export interface HookParams {
  /** Optional configuration override */
  config?: MassMarketConfig;
}

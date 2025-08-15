import type { Hex } from "viem";
import type { Dispatch, SetStateAction } from "react";
import type { AbstractStore } from "@massmarket/store";

/**
 * This type defines the available configuration parameters that can be
 * passed to the MassMarket provider and used by various hooks.
 */
export type MassMarketConfig = {
  // todo @nullradix <2025-05-28> maybe should be a bigint
  shopId?: string;
  relayTokenId?: Hex;
  chainName?: string;
  relayEndpoint?: string;
  /** Database store instance - accepts any compatible store implementation */
  db?: AbstractStore;
};

/**
 * This defines the shape of the context object that will be provided
 * to all components wrapped by MassMarketProvider.
 */
export type MassMarketContextType = {
  authenticationError: Error | null;
  setAuthenticationError: Dispatch<SetStateAction<Error | null>>;
  config: MassMarketConfig;
};

/**
 * This interface provides a standardized way to pass configuration overrides
 * to any hook that needs access to MassMarket configuration.
 */
export interface HookParams {
  /** Optional configuration override */
  config?: MassMarketConfig;
}

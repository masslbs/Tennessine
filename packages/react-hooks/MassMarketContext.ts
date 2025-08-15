import { createContext, createElement, useState } from "react";

import type { MassMarketConfig, MassMarketContextType } from "./types.ts";

export type { MassMarketConfig, MassMarketContextType };

/**
 * React context for MassMarket configuration and state.
 */
export const MassMarketContext: React.Context<
  MassMarketContextType | undefined
> = createContext<
  MassMarketContextType | undefined
>(
  undefined,
);

/**
 * This component should wrap your app to provide MassMarket configuration
 * and state to all child components that use MassMarket hooks.
 */
export function MassMarketProvider(
  parameters: React.PropsWithChildren<{
    config?: MassMarketConfig;
    blockingModal?: (
      children: React.ReactNode,
      errorMessage: string,
    ) => React.ReactNode;
  }>,
): React.ReactElement {
  const [authenticationError, setAuthenticationError] = useState<Error | null>(
    null,
  );

  const value = {
    authenticationError,
    setAuthenticationError,
    config: parameters.config ?? {},
  };

  if (authenticationError instanceof Error) {
    if (!parameters.blockingModal) {
      throw new Error(
        "authentication error occurred but blocking modal was not supplied",
      );
    }
    return createElement(MassMarketContext.Provider, {
      value,
      children: parameters.blockingModal(
        parameters.children,
        authenticationError.message,
      ),
    });
  }
  return createElement(MassMarketContext.Provider, {
    value,
    children: parameters.children,
  });
}

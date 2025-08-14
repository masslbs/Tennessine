import {
  createContext,
  createElement,
  type Dispatch,
  type SetStateAction,
  useState,
} from "react";

import type { AbstractStore } from "@massmarket/store";

import type { Hex } from "viem";

export type MassMarketConfig = {
  // todo @nullradix <2025-05-28> maybe should be a bigint
  shopId?: string;
  relayTokenId?: Hex;
  chainName?: string;
  relayEndpoint?: string;
  db?: AbstractStore;
};

export type MassMarketContextType = {
  authenticationError: Error | null;
  setAuthenticationError: Dispatch<SetStateAction<Error | null>>;
  config: MassMarketConfig;
};

export const MassMarketContext = createContext<
  MassMarketContextType | undefined
>(
  undefined,
);

export function MassMarketProvider(
  parameters: React.PropsWithChildren<{
    config?: MassMarketConfig;
    blockingModal?: (
      children: React.ReactNode,
      errorMessage: string,
    ) => React.ReactNode;
  }>,
) {
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

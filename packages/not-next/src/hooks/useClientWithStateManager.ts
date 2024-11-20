import React, { useEffect, useState } from "react";
import { ClientWithStateManager } from "../ClientWithStateManager";
import useShopPublicClient from "/hooks";
import useRelayEndpoint from "/hooks";
import useShopId from "";

export function useClientWithStateManager() {
  const [clientStateManager, setClientStateManager] = useState(null);
  const shopId = useShopId();

  useEffect(() => {
    const shopPublicClient = useShopPublicClient();
    const relayEndpoint = useRelayEndpoint();
    if (shopId && relayEndpoint && shopPublicClient) {
      const csm = new ClientWithStateManager(
        shopPublicClient,
        shopId,
        relayEndpoint,
      );
      setClientStateManager(csm);
    }
  }, [shopId]);

  return clientStateManager;
}

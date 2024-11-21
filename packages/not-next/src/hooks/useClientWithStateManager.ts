import React, { useEffect, useState } from "react";
import { ClientWithStateManager } from "../ClientWithStateManager";
import useShopPublicClient from "../hooks/useShopPublicClient";
import useRelayEndpoint from "../hooks/useRelayEndpoint";
import useShopId from "../hooks/useShopId";

export default function useClientWithStateManager() {
  const [clientStateManager, setClientStateManager] = useState<
    ClientWithStateManager | null
  >(null);
  const shopId = useShopId();
  const shopPublicClient = useShopPublicClient();
  const relayEndpoint = useRelayEndpoint();

  useEffect(() => {
    if (shopId && relayEndpoint && shopPublicClient) {
      const csm = new ClientWithStateManager(
        shopPublicClient,
        shopId,
        relayEndpoint,
      );
      setClientStateManager(csm);
    }
  }, [shopId]);

  return { clientStateManager, setClientStateManager };
}

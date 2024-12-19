import { useContext, useEffect, useMemo } from "react";
import { MassMarketContext } from "../MassMarketContext.tsx";
import { usePublicClient } from "./usePublicClient.ts";
import { useShopId } from "./useShopId.ts";
import { useQuery } from "./useQuery.ts";
import { useKeycard } from "./useKeycard.ts";
import { useRelayEndpoint } from "./useRelayEndpoint.ts";
import { ClientWithStateManager } from "../ClientWithStateManager.ts";

export function useClientWithStateManager() {
  const { clientStateManager, setClientStateManager } =
    useContext(MassMarketContext);
  const [keycard] = useKeycard();
  const { relayEndpoint } = useRelayEndpoint();
  const { shopId } = useShopId();
  const shopPublicClient = usePublicClient();

  const currentClientStateManager = useMemo(() => {
    if (
      shopId &&
      relayEndpoint &&
      shopPublicClient &&
      clientStateManager?.shopId !== shopId
    ) {
      return new ClientWithStateManager(
        // @ts-expect-error
        shopPublicClient,
        shopId,
        relayEndpoint,
      );
    }
    return clientStateManager;
  }, [shopId, relayEndpoint, shopPublicClient, clientStateManager?.shopId]);

  useEffect(() => {
    if (currentClientStateManager !== clientStateManager) {
      setClientStateManager(currentClientStateManager);
    }
  }, [currentClientStateManager, clientStateManager]);

  const result = useQuery(async () => {}, [keycard, clientStateManager]);

  return { clientStateManager: currentClientStateManager, ...result };
}

// import { useContext, useEffect } from "react";
// import { ClientWithStateManager } from "../ClientWithStateManager.ts";
// import { MassMarketContext } from "../MassMarketContext.tsx";
// import { useShopPublicClient } from "./useShopPublicClient.ts";
// import { useRelayEndpoint } from "./useRelayEndpoint.ts";
// import { useKeycard } from "./useKeycard.ts";
// import { useShopId } from "./useShopId.ts";
// import { useQuery } from "./useQuery.ts";

export function useClientWithStateManager() {
  // const { clientStateManager, setClientStateManager } = useContext(
  //   MassMarketContext,
  // );
  // const { isMerchantKeyCard, isGuestKeyCard, keycard } = useKeycard();
  // const shopId = useShopId();
  // const shopPublicClient = useShopPublicClient();
  // const relayEndpoint = useRelayEndpoint();

  // Create a new ClientWithStateManager instance when shopId changes
  // useEffect(() => {
  //   if (
  //     shopId && relayEndpoint && shopPublicClient &&
  //     clientStateManager.shopId !== shopId // make sure we are not creating a new instance with the same shopId
  //   ) {
  //     const csm = new ClientWithStateManager(
  //       shopPublicClient,
  //       shopId,
  //       relayEndpoint,
  //     );
  //     setClientStateManager(csm);
  //   }
  // }, [shopId]);

  // const result = useQuery(async () => {
  //   if (isMerchantKeyCard) {
  //     await clientStateManager.setClientAndConnect(keycard);
  //     await clientStateManager.sendMerchantSubscriptionRequest();
  //   } else if (!keycard) {
  //     //If no keycards are cached, create relayClient with guest wallet, then connect without enrolling a kc or authenticating.
  //     await clientStateManager.sendGuestSubscriptionRequest();
  //   } else if (isGuestKeyCard) {
  //     //If guestCheckout keycard is cached, connect, authenticate, and subscribe to orders.
  //     await clientStateManager.setClientAndConnect(keycard);
  //     await clientStateManager.sendGuestCheckoutSubscriptionRequest();
  //   }
  // }, [keycard, clientStateManager]);

  // return { clientStateManager, ...result };
}

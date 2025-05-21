import { useAccount, useWalletClient } from "wagmi";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { getLogger } from "@logtape/logtape";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { RelayClient } from "@massmarket/client";
import { getWindowLocation } from "@massmarket/utils";

import { useShopId } from "./useShopId.ts";
import { KeycardRole } from "../types.ts";
import { useRelayEndpoint } from "./useRelayEndpoint.ts";

const logger = getLogger(["mass-market", "frontend", "useKeycard"]);

/**
 * This hook returns a keycard for the browser session.
 * The async queryFn where we enroll the keycard only executes once unless variables in the queryKey changes.
 * The keycard will be cached for the duration of the browser session regardless of refreshes.
 */
export function useKeycard(role: KeycardRole = "guest") {
  const { shopId } = useShopId();
  const { data: wallet } = useWalletClient();
  const { address } = useAccount();
  const { relayEndpoint } = useRelayEndpoint();
  const queryClient = useQueryClient();

  return useQuery({
    // queryFn will not execute till these variables are defined.
    enabled: !!shopId && !!wallet && !!relayEndpoint && !!address,
    queryKey: [
      "keycard",
      address,
      role,
    ],
    queryFn: async () => {
      /**
       * 1. Generate KC
       * 2. Enroll KC
       * 3. Return the KC
       */

      const privateKey = generatePrivateKey();

      // This relay instance is just to enroll the keycard.
      const relayClient = new RelayClient({
        relayEndpoint,
        walletClient: wallet,
        keycard: privateKeyToAccount(privateKey),
        shopId,
      });

      const res = await relayClient.enrollKeycard(
        wallet,
        address,
        role === "guest",
        getWindowLocation(),
      );

      if (!res.ok) {
        throw new Error(`Failed to enroll keycard: ${res}`);
      }
      logger.debug(`Success: Enrolled new ${role} keycard`);

      const kc = {
        privateKey,
        role,
        address,
      };
      // Return this keycard for all guest keycard queries.
      // This is needed for merchant enrolls, since we don't want enrolled merchant keycards to be overwritten by guest keycards.
      // setQueriesData also ensures that any component using the query will re-render with the new keycard.
      queryClient.setQueriesData(
        { queryKey: ["keycard", address, "guest"] },
        kc,
      );

      return kc;
    },
    // This ensures that the keycard is not discarded during the browser session.
    gcTime: Infinity,
    staleTime: Infinity,
  });
}

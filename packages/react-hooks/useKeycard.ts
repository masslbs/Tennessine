import { useAccount, useWalletClient } from "wagmi";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { getLogger } from "@logtape/logtape";
import { skipToken, useQuery } from "@tanstack/react-query";
import { RelayClient } from "@massmarket/client";
import { getWindowLocation } from "@massmarket/utils";

import { useShopId } from "./useShopId.ts";
import { useRelayEndpoint } from "./useRelayEndpoint.ts";
import type { MassMarketConfig } from "./MassMarketContext.ts";

const logger = getLogger(["mass-market", "frontend", "useKeycard"]);

/**
 *  The role of the keycard, which determines what state it can access and update
 */
export type KeycardRole = "merchant" | "guest";

/**
 * This hook returns a keycard for a shop - if there is no keycard already cached, it will generate and enroll a new keycard with the role passed as the param.
 * The async queryFn where we enroll the keycard only executes once unless variables in the queryKey changes.
 * The keycard will be cached with tanstack's cache for the duration of the browser session regardless of refreshes.
 */
export function useKeycard(
  params: { config?: MassMarketConfig; role?: KeycardRole } = {
    role: "guest",
  },
) {
  // wagmi hooks
  const { data: wallet } = useWalletClient();
  const { address } = useAccount();
  // massmarket hooks
  const { shopId } = useShopId(params);
  const { relayEndpoint } = useRelayEndpoint(params);

  const enabled = !!shopId && !!wallet && !!relayEndpoint && !!address;
  const qResult = useQuery({
    // queryFn will not execute till these variables are defined.
    queryKey: [
      "keycard",
      address,
      // browser caches like localStorage cannot serialize BigInts, so we convert to string.
      String(shopId),
      params.role,
    ],
    queryFn: enabled
      ? async ({ client }) => {
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
          params.role === "guest",
          getWindowLocation(),
        );

        if (!res.ok) {
          const error = new Error(`Failed to enroll keycard: ${res.status}`);
          logger.error(
            `failed to enroll ${params.role} keycard for shop ${shopId}`,
            {
              error,
            },
          );
          throw error;
        }
        logger.debug(`Success: Enrolled new ${params.role} keycard`);

        const kc = {
          privateKey,
          role: params.role,
          address,
        };
        // Return this keycard for all guest keycard queries.
        // This is needed for merchant enrolls, so that subsequent queries will return this merchant keycard instead of trying to enroll multiple different keycards.
        // setQueriesData also ensures that any component using the query will re-render with the new keycard.
        if (params.role === "merchant") {
          client.setQueriesData(
            { queryKey: ["keycard", address, String(shopId), "guest"] },
            kc,
          );
        }

        return kc;
      }
      : skipToken,
    // This ensures that the keycard is not discarded during the browser session.
    gcTime: Infinity,
    staleTime: Infinity,
  });
  return { keycard: qResult.data, ...qResult };
}

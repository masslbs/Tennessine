import { useAccount, useWalletClient } from "wagmi";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { getLogger } from "@logtape/logtape";
import {
  skipToken,
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query";
import { RelayClient } from "@massmarket/client";
import { getBurnerWallet, getWindowLocation } from "@massmarket/utils";

import { useShopId } from "./useShopId.ts";
import { useRelayEndpoint } from "./useRelayEndpoint.ts";
import type { HookParams } from "./types.ts";
import { useShopPublicClient } from "./useShopPublicClient.ts";
import type { Hex } from "viem";

const logger = getLogger(["mass-market", "frontend", "useKeycard"]);

/**
 *  The role of the keycard, which determines what state it can access and update
 */
export type KeycardRole = "merchant" | "guest";

/**
 * The keycard which are device keys for Mass Market
 */
export type Keycard = { privateKey: Hex; role: KeycardRole; address: Hex };

/**
 * This hook returns a keycard for a shop - if there is no keycard already cached, it will generate and enroll a new keycard with the role passed as the param.
 * The keycard will be cached with tanstack's cache for the duration of the browser session regardless of refreshes.
 */
export function useKeycard(
  params: HookParams & { role?: KeycardRole } = {
    role: "guest",
  },
): UseQueryResult<Keycard> & { keycard: Keycard | undefined } {
  const role = params.role || "guest";
  // wagmi hooks
  const { data: connectedWallet } = useWalletClient();
  const { address: connectedAddress } = useAccount();

  // massmarket hooks
  const { shopId } = useShopId(params);
  const { relayEndpoint } = useRelayEndpoint(params);
  const { shopPublicClient } = useShopPublicClient(params);

  const enabled = !!shopId && !!relayEndpoint && !!shopPublicClient && (
    role === "guest" ? true : !!connectedAddress
  );
  const qResult = useQuery({
    // queryFn will not execute till these variables are defined.
    queryKey: [
      "keycard",
      // browser caches like localStorage cannot serialize BigInts, so we convert to string.
      String(shopId),
      role,
    ],
    queryFn: enabled
      ? async ({ client }) => {
        /**
         * 1. Generate KC
         * 2. Enroll KC
         * 3. Return the KC
         */
        const { burnerWallet, burnerAccount } = getBurnerWallet(
          shopPublicClient.chain!,
        );

        const privateKey = generatePrivateKey();
        const account = connectedAddress ?? burnerAccount;
        const address = connectedAddress ?? burnerAccount.address;
        const wallet = connectedWallet ?? burnerWallet;

        // This relay instance is just to enroll the keycard.
        const relayClient = new RelayClient({
          relayEndpoint,
          walletClient: wallet,
          keycard: privateKeyToAccount(privateKey),
          shopId,
        });
        const res = await relayClient.enrollKeycard(
          wallet,
          account,
          role === "guest",
          getWindowLocation(),
        );

        if (!res.ok) {
          const error = new Error(`Failed to enroll keycard: ${res.status}`);
          logger.error(
            `failed to enroll ${role} keycard for shop ${shopId}`,
            {
              error,
            },
          );
          throw error;
        }
        logger.debug(`Success: Enrolled new ${role} keycard`);

        const kc = {
          privateKey,
          role,
          address,
        };
        // Return this keycard for all guest keycard queries.
        // This is needed for merchant enrolls, so that subsequent queries will return this merchant keycard instead of trying to enroll multiple different keycards.
        // setQueryData also ensures that any component using the query will re-render with the new keycard.
        if (role === "merchant") {
          client.setQueryData(
            ["keycard", String(shopId), "guest"],
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
  if (qResult.error) {
    logger.error`Failed to enroll keycard: ${qResult.error}`;
  }
  return { keycard: qResult.data, ...qResult };
}

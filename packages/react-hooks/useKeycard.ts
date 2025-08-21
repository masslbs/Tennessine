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
import { useShopPublicClient } from "./useShopPublicClient.ts";
import { useIsOwner } from "./useIsOwner.ts";

import type { HookParams } from "./types.ts";
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
 * This hook returns a keycard for a shop - if there is no keycard already cached, it will generate and enroll a new keycard.
 * The keycard will be cached with tanstack's cache for the duration of the browser session regardless of refreshes.
 */
export function useKeycard(
  params?: HookParams,
): UseQueryResult<Keycard> & { keycard: Keycard | undefined } {
  // wagmi hooks
  const { data: connectedWallet } = useWalletClient();
  const { address: connectedAddress } = useAccount();

  // massmarket hooks
  const { shopId } = useShopId(params);
  const { relayEndpoint } = useRelayEndpoint(params);
  const { shopPublicClient } = useShopPublicClient(params);
  const { isOwner, isPending } = useIsOwner();

  // There is an edge case with using isOwner as query key:
  // If the user is initially enrolled as a guest, and they connect to a merchant account during checkout to pay, this query will rerun, and the user will lose their order.
  const enabled = !!shopId && !!relayEndpoint && !!shopPublicClient &&
    !isPending;
  const qResult = useQuery({
    // queryFn will not execute till these variables are defined.
    queryKey: [
      "keycard",
      // browser caches like localStorage cannot serialize BigInts, so we convert to string.
      String(shopId),
      isOwner,
    ],
    queryFn: enabled
      ? async () => {
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
          !isOwner,
          getWindowLocation(),
        );
        const enrolledAs: KeycardRole = isOwner ? "merchant" : "guest";
        if (!res.ok) {
          const error = new Error(`Failed to enroll keycard: ${res.status}`);
          logger.error(
            `failed to enroll ${enrolledAs} keycard for shop ${shopId}`,
            {
              error,
            },
          );
          throw error;
        }
        logger.debug(`Success: Enrolled new ${enrolledAs} keycard`);

        const kc = {
          privateKey,
          role: enrolledAs,
          address,
        };

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

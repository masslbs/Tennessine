import { assert } from "@std/assert";
import { useLocalStorage } from "@uidotdev/usehooks";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { getLogger } from "@logtape/logtape";
import { useWalletClient } from "wagmi";
import { useQuery } from "@tanstack/react-query";

import { RelayClient } from "@massmarket/client";
import { getWindowLocation } from "@massmarket/utils";

import { useShopId } from "./useShopId.ts";
import { KeycardRole } from "../types.ts";
import { useRelayEndpoint } from "./useRelayEndpoint.ts";

type Keycard = {
  privateKey: `0x${string}`;
  role: KeycardRole;
  address: `0x${string}`;
} | null;

const logger = getLogger(["mass-market", "frontend", "useKeycard"]);

export function useKeycard(role: KeycardRole = "guest") {
  const { shopId } = useShopId();
  const { data: wallet } = useWalletClient();
  const { relayEndpoint } = useRelayEndpoint();
  const [keycard, setKeycard] = useLocalStorage<Keycard>(
    "keycard" + shopId,
    null,
  );

  const { isPending, data } = useQuery({
    queryKey: ["keycard", shopId?.toString(), relayEndpoint, wallet, role],
    queryFn: async () => {
      // 1. Generate KC
      // 2. Enroll KC
      // 3. Save to localStorage

      // This is for instances when the user has a guest keycard and wants to log in as a merchant.
      const guestToMerchant = role === "merchant" && keycard?.role === "guest";
      if (keycard && !guestToMerchant) {
        return keycard;
      }
      if (!shopId || !relayEndpoint || !wallet) {
        assert(shopId, "shopId is required");
        assert(relayEndpoint, "relayEndpoint is required");
        assert(wallet, "wallet is required");
      }

      const privateKey = generatePrivateKey();
      const account = privateKeyToAccount(privateKey);

      // This relay instance is just to enroll the keycard.
      const relayClient = new RelayClient({
        relayEndpoint,
        walletClient: wallet,
        keycard: account,
        shopId,
      });

      const res = await relayClient.enrollKeycard(
        wallet,
        account,
        true,
        getWindowLocation(),
      );
      if (!res.ok) {
        throw new Error(`Failed to enroll keycard: ${res}`);
      }
      const kc = {
        privateKey,
        role,
        address: account!.address,
      };
      setKeycard(kc);
      logger.debug("Success: Enrolled new guest keycard");
      return kc;
    },
  });

  return {
    data,
    isPending,
  };
}

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

export function useKeycard(role: KeycardRole = "guest") {
  const { shopId } = useShopId();
  const { data: wallet } = useWalletClient();
  const account = useAccount();
  const { relayEndpoint } = useRelayEndpoint();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [
      "keycard",
      account?.address,
      role,
    ],
    queryFn: async () => {
      // 1. Generate KC
      // 2. Enroll KC
      // 3. Save to localStorage
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
        account,
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
        address: account!.address,
      };
      // Return this keycard for all guest keycard queries. This is needed for merchant enrolls. 
      queryClient.setQueriesData(
        { queryKey: ["keycard", account?.address, "guest"] },
        kc,
      );

      return kc;
    },
    enabled: !!shopId && !!wallet && !!relayEndpoint && !!account,
  });
}

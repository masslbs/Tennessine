import { createWalletClient, http } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { skipToken, useQuery } from "@tanstack/react-query";
import { useShopPublicClient } from "./useShopPublicClient.ts";

export function useBurnerWallet() {
  const { shopPublicClient } = useShopPublicClient();
  const enabled = !!shopPublicClient;
  const qResult = useQuery({
    queryKey: ["burner-wallet"],
    queryFn: enabled
      ? () => {
        const privateKey = generatePrivateKey();
        const burnerAccount = privateKeyToAccount(privateKey);
        const burnerWallet = createWalletClient({
          account: burnerAccount,
          chain: shopPublicClient.chain,
          transport: http(),
        });
        return { burnerWallet, burnerAccount };
      }
      : skipToken,
    staleTime: Infinity,
    gcTime: Infinity,
  });
  if (qResult.error) {
    throw qResult.error;
  }
  return {
    burnerWallet: qResult.data?.burnerWallet,
    burnerAccount: qResult.data?.burnerAccount,
  };
}

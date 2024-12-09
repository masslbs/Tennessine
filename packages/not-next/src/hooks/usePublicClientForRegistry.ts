import { usePublicClient } from "npm:wagmi";
import * as chains from "npm:viem/chains";
import process from "node:process";

export function usePublicClientForRegistry(id?: number) {
  const chainName = process.env.NEXT_PUBLIC_CHAIN_NAME!;
  let chainId: number;
  // use case for no chainId provided would be for shopPublicClient
  if (id) {
    chainId = id;
  } else {
    chainId = chains[chainName].id;
  }

  const shopPublicClient = usePublicClient({
    chainId,
  });

  return { shopPublicClient };
}

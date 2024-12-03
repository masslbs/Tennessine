import { usePublicClient } from "wagmi";
import * as chains from "viem/chains";

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

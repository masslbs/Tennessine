import { usePublicClient as usePC } from "wagmi";
import * as chains from "wagmi/chains";

export function usePublicClient(
  id = chains[import.meta.env.VITE_CHAIN_NAME as keyof typeof chains]?.id,
) {
  const shopPublicClient = usePC({
    chainId: id,
  });

  return { shopPublicClient };
}

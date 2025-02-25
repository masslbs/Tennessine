import { usePublicClient as usePC } from "wagmi";
import * as chains from "wagmi/chains";
import { env } from "../utils/env.ts";

export function usePublicClient(
  id: number = chains[env?.VITE_CHAIN_NAME as keyof typeof chains]?.id ?? 1,
) {
  const shopPublicClient = usePC({
    chainId: id,
  })!;

  return { shopPublicClient };
}

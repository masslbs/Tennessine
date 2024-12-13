import { usePublicClient as usePC } from "npm:wagmi";
import * as chains from "npm:wagmi/chains";
import process from "node:process";

export function usePublicClient(
  id = chains[process.env.NEXT_PUBLIC_CHAIN_NAME as keyof typeof chains].id,
) {
  const shopPublicClient = usePC({
    chainId: id,
  });

  return { shopPublicClient };
}

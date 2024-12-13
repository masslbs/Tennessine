import { usePublicClient } from "npm:wagmi";
import * as chains from "npm:wagmi/chains";
import process from "node:process";

export function useClient(
  id = chains[process.env.NEXT_PUBLIC_CHAIN_NAME as keyof typeof chains].id,
) {
  const shopPublicClient = usePublicClient({
    chainId: id,
  });

  return { shopPublicClient };
}

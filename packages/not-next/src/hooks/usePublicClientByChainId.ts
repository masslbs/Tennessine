import { usePublicClient } from "wagmi";
import { hardhat, mainnet, sepolia } from "viem/chains";

export default function usePublicClientByChainId(id?: number) {
  const chainName = process.env.NEXT_PUBLIC_CHAIN_NAME!;
  let chainId: number;
  // use case for no chainId provided would be for shopPublicClient
  if (id) {
    chainId = id;
  } else {
    switch (chainName) {
      case "hardhat":
        chainId = hardhat.id;
        break;
      case "sepolia":
        chainId = sepolia.id;
        break;
      case "mainnet":
        chainId = mainnet.id;
        break;
      default:
        throw new Error(`unhandled chain name ${chainName}`);
    }
  }

  const shopPublicClient = usePublicClient({
    chainId,
  });

  return { shopPublicClient };
}

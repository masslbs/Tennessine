import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  hardhat,
  mainnet,
  optimism,
  optimismSepolia,
  sepolia,
} from "wagmi/chains";
import { http } from "wagmi";

export const config = getDefaultConfig({
  appName: "Mass Labs",
  projectId: "6c432edcd930e0fa2c87a8d940ae5b91",
  chains: [mainnet, optimism, sepolia, hardhat, optimismSepolia],
  ssr: false,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [hardhat.id]: http(),
    [optimism.id]: http(),
    [optimismSepolia.id]: http(),
  },
});

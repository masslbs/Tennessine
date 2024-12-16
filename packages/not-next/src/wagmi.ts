import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { hardhat, mainnet, optimism, sepolia } from "wagmi/chains";
import { fallback, http, unstable_connector } from "wagmi";
import { injected } from "wagmi/connectors";

export function getConfig() {
  // First we try to connect to the block using window.ethereum
  // if that does not exist (metamask is not installed) we try to connect using the http provider
  const transport = fallback([
    unstable_connector(injected),
    http(),
  ]);
  return getDefaultConfig({
    appName: "Mass Labs",
    projectId: "6c432edcd930e0fa2c87a8d940ae5b91",
    chains: [mainnet, optimism, sepolia, hardhat],
    ssr: false,
    transports: {
      [mainnet.id]: transport,
      [sepolia.id]: transport,
      [hardhat.id]: transport,
      [optimism.id]: transport,
    },
  });
}

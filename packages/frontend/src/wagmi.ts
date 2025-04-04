import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { hardhat, mainnet, optimism, sepolia } from "wagmi/chains";
import { fallback, http, unstable_connector } from "wagmi";
import { injected } from "wagmi/connectors";
import { isTesting } from "./utils/env.ts";

export function getConfig() {
  // First we try to connect to the block using window.ethereum
  // if that does not exist (metamask is not installed) we try to connect using the http provider
  const transport = fallback([
    unstable_connector(injected),
    http(),
  ]);

  const transports = isTesting
    ? {
      [hardhat.id]: transport,
    }
    : {
      [hardhat.id]: transport,
      [mainnet.id]: transport,
      [sepolia.id]: transport,
      [optimism.id]: transport,
    };
  const chains = isTesting ? [hardhat] : [hardhat, mainnet, optimism, sepolia];
  return getDefaultConfig({
    appName: "Mass Labs",
    projectId: "6c432edcd930e0fa2c87a8d940ae5b91",
    ssr: false,
    chains,
    transports,
  });
}

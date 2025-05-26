import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { hardhat, mainnet, optimism, sepolia } from "wagmi/chains";
import { type Config, connect, type Connector } from "@wagmi/core";
import { burner } from "burner-connector";
import type { Transport } from "viem";
import { fallback, http, unstable_connector } from "wagmi";
import { injected } from "wagmi/connectors";
import { isTesting } from "./utils/env.ts";

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

export const config = getDefaultConfig({
  appName: "Mass Labs",
  projectId: "6c432edcd930e0fa2c87a8d940ae5b91",
  ssr: false,
  chains: isTesting ? [hardhat] : [hardhat, mainnet, optimism, sepolia],
  transports: transports as unknown as Record<string, Transport>,
}) as Config;

const connector = burner() as unknown as Connector;
// connect the buner wallet
await connect(config, { connector });

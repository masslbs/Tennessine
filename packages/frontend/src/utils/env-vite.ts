// Vite uses import.meta.env, but deno doesn't.
// This is a workaround for deno test ts check
const viteEnv = Reflect.get(import.meta, "env");

export const envConfig = {
  chainName: viteEnv?.VITE_CHAIN_NAME || "hardhat",
  ethRPCUrl: viteEnv?.VITE_ETH_RPC_URL || "http://localhost:8545",
  shopTokenId: viteEnv?.VITE_SHOP_TOKEN_ID as `0x${string}`,
  relayEndpoint: viteEnv?.VITE_RELAY_ENDPOINT || "ws://localhost:4444/v3",
  relayTokenId: viteEnv?.VITE_RELAY_TOKEN_ID as `0x${string}`,
  sentryDSN: viteEnv?.VITE_SENTRY_DSN,
  matomoURL: viteEnv?.VITE_MATOMO_URL,
};

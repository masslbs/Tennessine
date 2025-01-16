/// <reference types="vite/client" />
/// <reference types="vite/types/importMeta.d.ts" />

interface ImportMetaEnv {
  readonly VITE_RELAY_ENDPOINT: string;
  readonly VITE_CHAIN_NAME: string;
  readonly VITE_RELAY_TOKEN_ID: string;
  readonly VITE_ETH_RPC_URL: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

import {
  createTestClient,
  http,
  publicActions,
  type PublicClient,
  walletActions,
  type WalletClient,
} from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { foundry } from "viem/chains";
import { mintShop } from "@massmarket/blockchain";

import { discoverRelay, RelayClient } from "./mod.ts";

export const relayURL = Deno.env.get("RELAY_ENDPOINT") ||
  "http://localhost:4444/v4";

export function createTestBlockchainClient() {
  return createTestClient({
    chain: foundry,
    mode: "anvil",
    transport: http(),
  }).extend(publicActions)
    .extend(walletActions);
}

export async function createTestRelayClient(
  blockchainClient: WalletClient & PublicClient,
) {
  const shopId = BigInt(Math.floor(Math.random() * 1000000));
  // get an account from anvil
  const [account] = await blockchainClient.requestAddresses();

  const transactionHash = await mintShop(blockchainClient, account, [
    shopId,
    account,
  ]);
  // this is still causing a leak
  // https://github.com/wevm/viem/issues/2903
  await blockchainClient.waitForTransactionReceipt({
    hash: transactionHash,
  });

  const relayEndpoint = await discoverRelay(relayURL);
  const pk = generatePrivateKey();
  const kc = privateKeyToAccount(pk);
  const relayClient = new RelayClient({
    relayEndpoint,
    walletClient: blockchainClient,
    keycard: kc,
    shopId,
  });

  await relayClient.enrollKeycard(
    blockchainClient,
    account,
    false,
  );
  return relayClient;
}

export async function createTestClients() {
  const blockchainClient = createTestBlockchainClient();
  const relayClient = await createTestRelayClient(blockchainClient);
  return { relayClient, blockchainClient };
}

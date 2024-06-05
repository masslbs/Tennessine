import { program } from "commander";
import { createWalletClient, http } from "viem";
import { BlockchainClient } from "@massmarket/client/lib/blockchainClient";
import { privateKeyToAccount } from "viem/accounts";
import * as chains from "viem/chains";

program
  .command("create <id>")
  .option("-n, --network <network>", "network")
  .option("-pk, --private-key <privateKey>", "Private key")
  .action(async (id, options) => {
    const account = privateKeyToAccount(options.pk);
    const chain = chains[options.network as keyof typeof chains];
    const wallet = createWalletClient({
      account,
      chain,
      transport: http(),
    });
    const client = new BlockchainClient(id);
    const r = await client.createStore(wallet);
    console.log(r);
  });

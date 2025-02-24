import "./happyDomSetup.ts";

import { expect } from "jsr:@std/expect";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";

import { anvilPrivateKey } from "@massmarket/contracts";
import { random256BigInt } from "@massmarket/utils";
import { mintShop } from "@massmarket/blockchain";

Deno.test("Fetch API works with happy-dom", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async () => {
  const shopId = random256BigInt();
  const wallet = createWalletClient({
    account: privateKeyToAccount(
      anvilPrivateKey,
    ),
    chain: hardhat,
    transport: http(),
  });
  const publicClient = createPublicClient({
    chain: hardhat,
    transport: http(),
  });
  const transactionHash = await mintShop(wallet, [
    shopId,
    wallet.account.address,
  ]);
  const receipt = await publicClient.waitForTransactionReceipt({
    hash: transactionHash,
  });
  expect(receipt.status).toBe("success");
});

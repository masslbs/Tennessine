import "./happyDomSetup.ts";

import { expect } from "@std/expect";
import { createClient, publicActions, walletActions, webSocket } from "viem";
import { hardhat } from "viem/chains";

import { random256BigInt } from "@massmarket/utils";
import { mintShop } from "@massmarket/contracts";

//  i'm not sure these actually run in happy-dom

Deno.test("Fetch API works with happy-dom", {
  sanitizeResources: false,
  sanitizeOps: false,
}, async (t) => {
  const shopId = random256BigInt();
  const client = createClient({
    chain: hardhat,
    transport: webSocket("ws://localhost:8545"),
  }).extend(walletActions).extend(publicActions);
  const [account] = await client.requestAddresses();

  await t.step("mintShop", async () => {
    const transactionHash = await mintShop(client, account, [
      shopId,
      account,
    ]);
    // this is still causing a leak
    // https://github.com/wevm/viem/issues/2903
    const receipt = await client.waitForTransactionReceipt({
      hash: transactionHash,
    });
    expect(receipt.status).toBe("success");
  });
});

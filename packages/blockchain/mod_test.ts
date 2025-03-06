import { expect } from "@std/expect";
import {
  type Address,
  createClient,
  http,
  publicActions,
  walletActions,
} from "@wevm/viem";

import { hardhat } from "@wevm/viem/chains";
import * as abi from "@massmarket/contracts";
import { random256BigInt } from "@massmarket/utils";
import { mintShop, setTokenURI } from "./mod.ts";

const shopId = random256BigInt();

Deno.test({
  name: "blockChain Client",
  sanitizeResources: false,
  sanitizeOps: false,
  async fn(t) {
    const client = createClient({
      chain: hardhat,
      transport: http(),
    }).extend(walletActions).extend(publicActions);
    const [account] = await client.requestAddresses();

    await t.step("mintShop", async () => {
      const transactionHash = await mintShop(client, account, [
        shopId,
        account,
      ]);
      const receipt = await client.waitForTransactionReceipt({
        hash: transactionHash,
      });
      expect(receipt.status).toBe("success");
    });
    await t.step("setTokenURI", async () => {
      const test_uri = "/testing/path";
      const transactionHash = await setTokenURI(client, account, [
        shopId,
        test_uri,
      ]);
      const receipt = await client.waitForTransactionReceipt({
        hash: transactionHash,
      });
      expect(receipt.status).toBe("success");

      const uri = await client.readContract({
        address: abi.addresses.ShopReg as Address,
        abi: abi.shopRegAbi,
        functionName: "tokenURI",
        args: [shopId],
      });
      expect(uri).toEqual(test_uri);
    });
  },
});

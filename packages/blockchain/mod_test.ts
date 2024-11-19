import { expect } from "jsr:@std/expect";
import { describe, it } from "jsr:@std/testing/bdd";
import {
  type Address,
  createPublicClient,
  createWalletClient,
  http,
} from "viem";

import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";
import * as abi from "@massmarket/contracts";
import { random256BigInt } from "@massmarket/utils";
import { mintShop, setTokenURI } from "./mod.ts";

const account = privateKeyToAccount(
  "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
);

const shopId = random256BigInt();

describe({
  name: "blockChain Client",
  sanitizeResources: false,
  sanitizeOps: false,
  fn() {
    const wallet = createWalletClient({
      account,
      chain: hardhat,
      transport: http(),
    });
    const publicClient = createPublicClient({
      chain: hardhat,
      transport: http(),
    });
    it("mintShop", async () => {
      const transactionHash = await mintShop(wallet, [
        shopId,
        wallet.account.address,
      ]);
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: transactionHash,
      });
      expect(receipt.status).toBe("success");
    });
    it("setTokenURI", async () => {
      const test_uri = "/testing/path";
      const transactionHash = await setTokenURI(wallet, [shopId, test_uri]);
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: transactionHash,
      });
      expect(receipt.status).toBe("success");

      const uri = await publicClient.readContract({
        address: abi.addresses.ShopReg as Address,
        abi: abi.shopRegAbi,
        functionName: "tokenURI",
        args: [shopId],
      });
      expect(uri).toEqual(test_uri);
    });
  },
});

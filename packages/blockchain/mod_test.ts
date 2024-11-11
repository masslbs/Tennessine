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
import { random32BytesHex } from "@massmarket/utils";
import { BlockchainClient } from "./mod.ts";

const account = privateKeyToAccount(
  "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
);

let blockChainClient: BlockchainClient;
const shopId = random32BytesHex();

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
    it("createShop", async () => {
      blockChainClient = new BlockchainClient(shopId);
      const transactionHash = await blockChainClient.createShop(wallet);
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: transactionHash,
      });
      expect(receipt.status).toBe("success");
    });
    it("setShopMetadataURI", async () => {
      blockChainClient = new BlockchainClient(shopId);
      const test_uri = "/testing/path";
      await blockChainClient.setShopMetadataURI(wallet, test_uri);

      const uri = await publicClient.readContract({
        address: abi.addresses.ShopReg as Address,
        abi: abi.ShopReg,
        functionName: "tokenURI",
        args: [shopId],
      });
      expect(uri).toEqual(test_uri);
    });
  },
});

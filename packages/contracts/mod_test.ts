import { expect } from "@std/expect";
import { createClient, http, publicActions, walletActions } from "viem";
import { hardhat } from "viem/chains";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

import { random256BigInt } from "@massmarket/utils";
import {
  abi,
  checkPermissions,
  mintShop,
  permissions,
  publishInviteVerifier,
  redeemInviteSecret,
  setTokenURI,
} from "./mod.ts";

const retryCount = 10;

const client = createClient({
  chain: hardhat,
  transport: http(),
}).extend(walletActions).extend(publicActions);

Deno.test({
  name: "blockChain Client",
  sanitizeResources: false,
  sanitizeOps: false,
  async fn(t) {
    const shopId = random256BigInt();
    const [account] = await client.requestAddresses();

    await t.step("mintShop", async () => {
      const hash = await mintShop(client, account, [
        shopId,
        account,
      ]);
      // this is still causing a leak
      // https://github.com/wevm/viem/issues/2903
      const receipt = await client.waitForTransactionReceipt({
        hash,
        retryCount,
      });
      expect(receipt.status).toBe("success");
    });
    await t.step("setTokenURI", async () => {
      const test_uri = "/testing/path";
      const hash = await setTokenURI(client, account, [
        shopId,
        test_uri,
      ]);
      const receipt = await client.waitForTransactionReceipt({
        hash,
        retryCount,
      });
      expect(receipt.status).toBe("success");

      const uri = await client.readContract({
        address: abi.shopRegAddress,
        abi: abi.shopRegAbi,
        functionName: "tokenURI",
        args: [shopId],
      });
      expect(uri).toEqual(test_uri);
    });
  },
});

Deno.test({
  name: "blockChain: registrationTokenRedeem",
  sanitizeResources: false,
  sanitizeOps: false,
  async fn(t) {
    const shopId = random256BigInt();
    // still contrived, we would use a separate keypair in reality and pass it via some sidechannel
    //
    // acc2 is the "long term wallet" of the new user
    // if we knew that before hand, we could just call registerUser(acc2.address, Clerk)
    // but we do this to exercise the invite flow
    const client = createClient({
      chain: hardhat,
      transport: http(),
    }).extend(walletActions).extend(publicActions);
    const [account1, account2] = await client.requestAddresses();

    await t.step("mintShop", async () => {
      const hash = await mintShop(client, account1, [
        shopId,
        account1,
      ]);
      const receipt = await client.waitForTransactionReceipt({
        hash,
        retryCount,
      });
      expect(receipt.status).toBe("success");
    });

    const sk = generatePrivateKey();
    await t.step("publishInviteVerifier", async () => {
      const token = privateKeyToAccount(sk);

      const hash = await publishInviteVerifier(client, account1, [
        shopId,
        token.address,
      ]);

      // wait for the transaction to be included in the blockchain
      const receipt = await client.waitForTransactionReceipt({
        hash,
        retryCount,
      });
      expect(receipt.status).toBe("success");
    });

    await t.step("redeemInviteSecret", async () => {
      const client2 = createClient({
        chain: hardhat,
        transport: http(),
      }).extend(walletActions).extend(publicActions);

      const hash = await redeemInviteSecret(sk, client2, account2, shopId);
      // wait for the transaction to be included in the blockchain
      const transaction = await client2.waitForTransactionReceipt({
        hash,
        retryCount,
      });
      expect(transaction.status).toBe("success");

      const canUpdateRootHash = await checkPermissions(client2, [
        shopId,
        account2,
        permissions.updateRootHash,
      ]);
      expect(canUpdateRootHash).toBe(true);
    });
  },
});

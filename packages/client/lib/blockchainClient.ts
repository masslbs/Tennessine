import {
  bytesToHex,
  hexToBytes,
  Address,
  type WalletClient,
  type Transport,
  type Account,
  type Chain,
} from "viem";

import * as abi from "@massmarket/contracts";
import { eventId, randomBytes } from "./utils";
import { privateKeyToAccount } from "viem/accounts";

export type WalletClientWithAccount = WalletClient<
  Transport,
  Chain,
  Account
> & {
  account: Account;
};

export class BlockchainClient {
  constructor(public storeId: `0x${string}` = bytesToHex(eventId())) {}

  async createStore(wallet: WalletClientWithAccount) {
    const hash = await wallet.writeContract({
      address: abi.addresses.StoreReg as Address,
      abi: abi.StoreReg,
      functionName: "mint",
      args: [BigInt(this.storeId), wallet.account.address],
    });

    return hash;
    // return wallet.waitForTransactionReceipt({
    //   hash,
    // });
  }

  async createInviteSecret(wallet: WalletClientWithAccount) {
    const privateKey = bytesToHex(randomBytes(32)) as `0x${string}`;
    const token = privateKeyToAccount(privateKey);
    // Save the public key onchain
    await wallet.writeContract({
      address: abi.addresses.StoreReg as Address,
      abi: abi.StoreReg,
      functionName: "publishInviteVerifier",
      args: [BigInt(this.storeId), token.address],
    });
    return privateKey;
  }

  async redeemInviteSecret(
    secret: `0x${string}`,
    wallet: WalletClientWithAccount,
  ) {
    const message = "enrolling:" + wallet.account.address.toLowerCase();
    const tokenAccount = privateKeyToAccount(secret);
    const sig = await tokenAccount.signMessage({
      message,
    });
    const sigBytes = hexToBytes(sig);
    const v = sigBytes[64];
    const r = bytesToHex(sigBytes.slice(0, 32));
    const s = bytesToHex(sigBytes.slice(32, 64));
    return wallet.writeContract({
      address: abi.addresses.StoreReg as Address,
      abi: abi.StoreReg,
      functionName: "redeemInvite",
      args: [BigInt(this.storeId), v, r, s, wallet.account.address],
    });
  }
}

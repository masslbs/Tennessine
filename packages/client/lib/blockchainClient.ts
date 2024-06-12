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
import { eventId } from "./utils";
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

  createStore(wallet: WalletClientWithAccount) {
    return wallet.writeContract({
      address: abi.addresses.StoreReg as Address,
      abi: abi.StoreReg,
      functionName: "mint",
      args: [BigInt(this.storeId), wallet.account.address],
    });
  }

  createInviteSecret(wallet: WalletClientWithAccount, token: `0x${string}`) {
    // Save the public key onchain
    return wallet.writeContract({
      address: abi.addresses.StoreReg as Address,
      abi: abi.StoreReg,
      functionName: "publishInviteVerifier",
      args: [BigInt(this.storeId), token],
    });
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

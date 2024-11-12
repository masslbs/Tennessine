// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: MIT

import {
  type Account,
  type Address,
  bytesToHex,
  type Chain,
  hexToBytes,
  type Transport,
  type WalletClient,
} from "viem";

import { randomBytes } from "@massmarket/utils";

import * as abi from "@massmarket/contracts";
import { privateKeyToAccount } from "viem/accounts";

export type ConcreteWalletClient = WalletClient<Transport, Chain, Account>;

export class BlockchainClient {
  constructor(public shopId = bytesToHex(randomBytes(32))) {}

  transferTokens(
    wallet: ConcreteWalletClient,
    paymentArgs,
    isERC20Payment: boolean,
  ) {
    // Pass value parameter only if sending ETH
    return isERC20Payment
      ? wallet.writeContract({
        address: abi.addresses.Payments as Address,
        abi: abi.PaymentsByAddress,
        functionName: "pay",
        args: [paymentArgs],
      })
      : wallet.writeContract({
        address: abi.addresses.Payments as Address,
        abi: abi.PaymentsByAddress,
        functionName: "pay",
        args: [paymentArgs],
        value: paymentArgs[4],
      });
  }

  preApproveERC20(wallet: ConcreteWalletClient, tokenAddress, total) {
    return wallet.writeContract({
      address: tokenAddress,
      abi: abi.ERC20,
      functionName: "approve",
      args: [abi.addresses.Payments, total],
    });
  }

  addRelay(wallet: ConcreteWalletClient, tokenId: `0x${string}`) {
    return wallet.writeContract({
      address: abi.addresses.ShopReg as Address,
      abi: abi.ShopReg,
      functionName: "addRelay",
      args: [BigInt(this.shopId), tokenId],
    });
  }
  createShop(wallet: ConcreteWalletClient) {
    return wallet.writeContract({
      address: abi.addresses.ShopReg as Address,
      abi: abi.ShopReg,
      functionName: "mint",
      args: [BigInt(this.shopId), wallet.account.address],
    });
  }

  setShopMetadataURI(wallet: ConcreteWalletClient, uri: string) {
    return wallet.writeContract({
      address: abi.addresses.ShopReg as Address,
      abi: abi.ShopReg,
      functionName: "setTokenURI",
      args: [BigInt(this.shopId), uri],
    });
  }

  createInviteSecret(wallet: ConcreteWalletClient, token: Address) {
    // Save the public key onchain
    return wallet.writeContract({
      address: abi.addresses.ShopReg as Address,
      abi: abi.ShopReg,
      functionName: "publishInviteVerifier",
      args: [BigInt(this.shopId), token],
    });
  }

  async redeemInviteSecret(secret: Address, wallet: ConcreteWalletClient) {
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
      address: abi.addresses.ShopReg as Address,
      abi: abi.ShopReg,
      functionName: "redeemInvite",
      args: [BigInt(this.shopId), v, r, s, wallet.account.address],
    });
  }
}

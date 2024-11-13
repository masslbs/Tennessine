// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: MIT

import {
  type Account,
  type Address,
  bytesToHex,
  type Chain,
  hexToBytes,
  type PublicClient,
  type Transport,
  type WalletClient,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { randomBytes } from "@massmarket/utils";
import * as abi from "@massmarket/contracts";

export type ConcreteWalletClient = WalletClient<Transport, Chain, Account>;

export interface PaymentArgs {
  wallet: ConcreteWalletClient;
  chainId: number;
  ttl: number;
  orderHash: `0x${string}`;
  currencyAddress: Address;
  total: bigint;
  payeeAddress: Address;
  isPaymentEndpoint: boolean;
  shopId: `0x${string}`;
  shopSignature: `0x${string}`;
}

export function payTokenPreApproved(args: PaymentArgs) {
  const paymentArgs = [
    args.chainId,
    args.ttl,
    args.orderHash,
    args.currencyAddress,
    args.total,
    args.payeeAddress,
    args.isPaymentEndpoint,
    args.shopId,
    args.shopSignature,
  ];
  return args.wallet.writeContract({
    address: abi.addresses.Payments as Address,
    abi: abi.PaymentsByAddress,
    functionName: "payTokenPreApproved",
    args: [paymentArgs],
  });
}

export function payNative(args: PaymentArgs) {
  const paymentArgs = [
    args.chainId,
    args.ttl,
    args.orderHash,
    args.currencyAddress,
    args.total,
    args.payeeAddress,
    args.isPaymentEndpoint,
    args.shopId,
    args.shopSignature,
  ];
  return args.wallet.writeContract({
    address: abi.addresses.Payments as Address,
    abi: abi.PaymentsByAddress,
    functionName: "payNative",
    value: args.total,
    args: [paymentArgs],
  });
}

export function getPaymentAddress(
  args: Omit<PaymentArgs, "wallet"> & {
    refundAddress: Address;
    wallet: PublicClient;
  },
) {
  const paymentArgs = [
    args.chainId,
    args.ttl,
    args.orderHash,
    args.currencyAddress,
    args.total,
    args.payeeAddress,
    args.isPaymentEndpoint,
    args.shopId,
    args.shopSignature,
  ];
  return args.wallet.readContract({
    address: abi.addresses.Payments as Address,
    abi: abi.PaymentsByAddress,
    functionName: "getPaymentAddress",
    args: [paymentArgs, args.refundAddress],
  }) as Promise<Address>;
}

export function getPaymentId(
  args: Omit<PaymentArgs, "wallet"> & {
    wallet: PublicClient;
  },
) {
  const paymentArgs = [
    args.chainId,
    args.ttl,
    args.orderHash,
    args.currencyAddress,
    args.total,
    args.payeeAddress,
    args.isPaymentEndpoint,
    args.shopId,
    args.shopSignature,
  ];
  return args.wallet.readContract({
    address: abi.addresses.Payments as Address,
    abi: abi.PaymentsByAddress,
    functionName: "getPaymentId",
    args: [paymentArgs],
  }) as Promise<bigint>;
}

export async function getPaymentAddressAndID(
  args: Omit<PaymentArgs, "wallet"> & {
    refundAddress: Address;
    wallet: PublicClient;
  },
) {
  return {
    address: await getPaymentAddress(args),
    id: await getPaymentId(args),
  };
}

export function approveERC20(
  wallet: ConcreteWalletClient,
  currencyAddress: Address,
  amount: bigint,
) {
  return wallet.writeContract({
    address: currencyAddress,
    abi: abi.ERC20,
    functionName: "approve",
    args: [abi.addresses.Payments, amount],
  });
}

export class BlockchainClient {
  constructor(public shopId = bytesToHex(randomBytes(32))) {}

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

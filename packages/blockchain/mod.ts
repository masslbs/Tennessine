// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: MIT
import {
  type Abi,
  type Account,
  type Address,
  bytesToHex,
  type Chain,
  type ContractFunctionArgs,
  type ContractFunctionName,
  type ContractFunctionReturnType,
  hexToBytes,
  type PublicClient,
  type Transport,
  type WalletClient,
  type WriteContractParameters,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import * as abi from "@massmarket/contracts";

export type ConcreteWalletClient = WalletClient<Transport, Chain, Account>;

type Mutable = "nonpayable" | "payable";
type ReadOnly = "view" | "pure";

export function genericWriteContract<
  const abiT extends Abi,
  const FuncName extends ContractFunctionName<abiT, Mutable>,
>(abi: abiT, functionName: FuncName, address: Address) {
  return (
    wallet: ConcreteWalletClient,
    args: ContractFunctionArgs<abiT, Mutable, FuncName>,
  ) => {
    return wallet.writeContract({
      chain: wallet.chain,
      account: wallet.account,
      address,
      abi,
      functionName,
      args,
    } as WriteContractParameters);
  };
}

export function genericReadContract<
  const abiT extends Abi,
  const FuncName extends ContractFunctionName<abiT, ReadOnly>,
>(abi: abiT, functionName: FuncName, address: Address) {
  return (
    wallet: PublicClient,
    args: ContractFunctionArgs<abiT, ReadOnly, FuncName>,
  ): Promise<
    ContractFunctionReturnType<
      abiT,
      ReadOnly,
      FuncName,
      ContractFunctionArgs<abiT, ReadOnly, FuncName>
    >
  > => {
    return wallet.readContract({
      address,
      abi,
      functionName,
      args,
    });
  };
}

// Logic for payNative vs. payTokenPreApproved is already baked into the pay contract function.
// Not using genericWriteContract here since we need to pass in the value param for native payments.
export function pay(
  wallet: ConcreteWalletClient,
  args: ContractFunctionArgs<
    typeof abi.paymentsByAddressAbi,
    "nonpayable" | "payable",
    "payTokenPreApproved" | "payNative"
  >,
) {
  return wallet.writeContract({
    address: abi.addresses.Payments,
    abi: abi.paymentsByAddressAbi,
    functionName: "pay",
    args,
    // If paying in native currency, pass in the value param.
    ...(args[0].currency === abi.addresses.zeroAddress &&
      { value: args[0].amount }),
  });
}

export const getPaymentAddress = genericReadContract(
  abi.paymentsByAddressAbi,
  "getPaymentAddress",
  abi.addresses.Payments,
);

export const getPaymentId = genericReadContract(
  abi.paymentsByAddressAbi,
  "getPaymentId",
  abi.addresses.Payments,
);

export function approveERC20(
  wallet: ConcreteWalletClient,
  address: Address,
  args: ContractFunctionArgs<
    typeof abi.eddiesAbi,
    "nonpayable" | "payable",
    "approve"
  >,
) {
  return wallet.writeContract({
    address,
    abi: abi.eddiesAbi,
    functionName: "approve",
    args,
  });
}
export const addRelay = genericWriteContract(
  abi.shopRegAbi,
  "addRelay",
  abi.addresses.ShopReg,
);

export const setTokenURI = genericWriteContract(
  abi.shopRegAbi,
  "setTokenURI",
  abi.addresses.ShopReg,
);

export const publishInviteVerifier = genericWriteContract(
  abi.shopRegAbi,
  "publishInviteVerifier",
  abi.addresses.ShopReg,
);

export const redeemInvite = genericWriteContract(
  abi.shopRegAbi,
  "redeemInvite",
  abi.addresses.ShopReg,
);
export const checkPermissions = genericReadContract(
  abi.shopRegAbi,
  "hasPermission",
  abi.addresses.ShopReg,
);

export const mintShop = genericWriteContract(
  abi.shopRegAbi,
  "mint",
  abi.addresses.ShopReg,
);
export async function redeemInviteSecret(
  secret: Address,
  wallet: ConcreteWalletClient,
  shopId: bigint,
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
  return redeemInvite(wallet, [shopId, v, r, s, wallet.account.address]);
}

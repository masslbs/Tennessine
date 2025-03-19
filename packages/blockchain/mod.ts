// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: MIT
import {
  type Abi,
  type Account,
  bytesToHex,
  type Chain,
  type ContractFunctionArgs,
  type ContractFunctionName,
  type ContractFunctionReturnType,
  ethAddress,
  type Hex,
  hexToBytes,
  numberToBytes,
  pad,
  type PublicClient,
  type Transport,
  type WalletClient,
  type WriteContractParameters,
} from "viem";
import { parseAccount, privateKeyToAccount } from "viem/accounts";
import * as abi from "@massmarket/contracts";

export type ConcreteWalletClient = WalletClient<Transport, Chain, Account>;

type Mutable = "nonpayable" | "payable";
type ReadOnly = "view" | "pure";

export function genericWriteContract<
  const abiT extends Abi,
  const FuncName extends ContractFunctionName<abiT, Mutable>,
>(abi: abiT, functionName: FuncName, address: Hex) {
  return (
    wallet: WalletClient,
    account: Account | Hex,
    args: ContractFunctionArgs<abiT, Mutable, FuncName>,
  ) => {
    return wallet.writeContract({
      chain: wallet.chain,
      account,
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
>(abi: abiT, functionName: FuncName, address: Hex) {
  return (
    publicClient: PublicClient,
    args: ContractFunctionArgs<abiT, ReadOnly, FuncName>,
  ): Promise<
    ContractFunctionReturnType<
      abiT,
      ReadOnly,
      FuncName,
      ContractFunctionArgs<abiT, ReadOnly, FuncName>
    >
  > => {
    return publicClient.readContract({
      address,
      abi,
      functionName,
      args,
    });
  };
}

export const payTokenPreApproved = genericWriteContract(
  abi.paymentsByAddressAbi,
  "payTokenPreApproved",
  abi.paymentsByAddressAddress,
);

export const payNative = genericWriteContract(
  abi.paymentsByAddressAbi,
  "payNative",
  abi.paymentsByAddressAddress,
);

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
    address: abi.paymentsByAddressAddress,
    abi: abi.paymentsByAddressAbi,
    functionName: "pay",
    args,
    // If paying in native currency, pass in the value param.
    ...(args[0].currency === ethAddress &&
      { value: args[0].amount }),
  });
}
export const getAllowance = genericReadContract(
  abi.eddiesAbi,
  "allowance",
  abi.eddiesAddress,
);

export const getPaymentAddress = genericReadContract(
  abi.paymentsByAddressAbi,
  "getPaymentAddress",
  abi.paymentsByAddressAddress,
);

export const getPaymentIdRaw = genericReadContract(
  abi.paymentsByAddressAbi,
  "getPaymentId",
  abi.paymentsByAddressAddress,
);

export async function getPaymentId(
  ...args: Parameters<typeof getPaymentIdRaw>
): Promise<Uint8Array> {
  const result: bigint = await getPaymentIdRaw(...args);
  return pad(numberToBytes(result));
}

export function approveERC20(
  wallet: ConcreteWalletClient,
  address: Hex,
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
  abi.shopRegAddress,
);

export const setTokenURI = genericWriteContract(
  abi.shopRegAbi,
  "setTokenURI",
  abi.shopRegAddress,
);

export const publishInviteVerifier = genericWriteContract(
  abi.shopRegAbi,
  "publishInviteVerifier",
  abi.shopRegAddress,
);

export const redeemInvite = genericWriteContract(
  abi.shopRegAbi,
  "redeemInvite",
  abi.shopRegAddress,
);
export const checkPermissions = genericReadContract(
  abi.shopRegAbi,
  "hasPermission",
  abi.shopRegAddress,
);

export const mintShop = genericWriteContract(
  abi.shopRegAbi,
  "mint",
  abi.shopRegAddress,
);

export const relayRegGetOwnerOf = genericReadContract(
  abi.relayRegAbi,
  "ownerOf",
  abi.relayRegAddress,
);

export async function redeemInviteSecret(
  secret: Hex,
  wallet: WalletClient,
  account: Hex | Account,
  shopId: bigint,
) {
  const address = parseAccount(account).address;
  const message = "enrolling:" + address.toLowerCase();
  const tokenAccount = privateKeyToAccount(secret);
  const sig = await tokenAccount.signMessage({
    message,
  });
  const sigBytes = hexToBytes(sig);
  const v = sigBytes[64];
  const r = bytesToHex(sigBytes.slice(0, 32));
  const s = bytesToHex(sigBytes.slice(32, 64));
  return redeemInvite(wallet, account, [
    shopId,
    v,
    r,
    s,
    address,
  ]);
}

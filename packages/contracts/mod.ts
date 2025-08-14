// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: Unlicense
import {
  type Abi,
  type Account,
  bytesToHex,
  type ContractFunctionArgs,
  type ContractFunctionName,
  type ContractFunctionReturnType,
  type Hex,
  hexToBytes,
  numberToBytes,
  pad,
  type PublicClient,
  type WalletClient,
  type WriteContractParameters,
  zeroAddress,
} from "viem";
import { parseAccount, privateKeyToAccount } from "viem/accounts";
import tokenAddresses from "./tokenAddresses.json" with { type: "json" };
export { tokenAddresses };
import * as abi from "./src/generated.ts";
export { abi };

export const permissions = {
  addPermission: 0,
  removePermission: 1,
  updateRootHash: 2,
  addRelay: 3,
  removeRelay: 4,
  replaceRelay: 5,
  registerUser: 6,
  removeUser: 7,
  publishInviteVerifier: 8,
} as const;

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
  wallet: WalletClient,
  account: Account | Hex,
  args: ContractFunctionArgs<
    typeof abi.paymentsByAddressAbi,
    "nonpayable" | "payable",
    "payTokenPreApproved" | "payNative"
  >,
) {
  if (Number(args[0].chainId) !== wallet.chain?.id) {
    throw new Error("Chain ID mismatch");
  }
  return wallet.writeContract({
    chain: wallet.chain,
    address: abi.paymentsByAddressAddress,
    account,
    abi: abi.paymentsByAddressAbi,
    functionName: "pay",
    args,
    // If paying in native currency, pass in the value param.
    ...(args[0].currency === zeroAddress &&
      { value: args[0].amount }),
  });
}

export function getAllowance(
  publicClient: PublicClient,
  contractAddress: Hex,
  args: ContractFunctionArgs<
    typeof abi.eddiesAbi,
    "view" | "pure",
    "allowance"
  >,
) {
  return publicClient.readContract({
    address: contractAddress,
    abi: abi.eddiesAbi,
    functionName: "allowance",
    args,
  });
}

export function getTokenInformation(
  publicClient: PublicClient,
  tokenAddress: `0x${string}`,
): Promise<{ symbol: string; decimal: number }> {
  if (tokenAddress === zeroAddress) {
    return new Promise((resolve) => {
      resolve({ symbol: "ETH", decimal: 18 });
    });
  }

  const symbol = publicClient.readContract({
    address: tokenAddress,
    abi: abi.eddiesAbi,
    functionName: "symbol",
    args: [],
  }) as Promise<string>;

  const decimal = publicClient.readContract({
    address: tokenAddress,
    abi: abi.eddiesAbi,
    functionName: "decimals",
    args: [],
  }) as Promise<number>;

  return Promise.all([symbol, decimal]).then(([symbol, decimal]) => ({
    symbol,
    decimal,
  }));
}

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
  wallet: WalletClient,
  account: Account | Hex,
  address: Hex,
  args: ContractFunctionArgs<
    typeof abi.eddiesAbi,
    "nonpayable" | "payable",
    "approve"
  >,
) {
  return wallet.writeContract({
    chain: wallet.chain,
    address,
    account,
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

export const balanceOf = genericReadContract(
  abi.shopRegAbi,
  "balanceOf",
  abi.shopRegAddress,
);

export const tokenOfOwnerByIndex = genericReadContract(
  abi.shopRegAbi,
  "tokenOfOwnerByIndex",
  abi.shopRegAddress,
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

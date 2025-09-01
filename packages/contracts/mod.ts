/**
 * This module provides utilities for interacting with the Mass Market smart contracts using viem.
 * It includes functions for payments, token approvals, shop registration, and relay management.
 *
 * @module
 */

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
  type WriteContractReturnType,
  zeroAddress,
} from "viem";
import { parseAccount, privateKeyToAccount } from "viem/accounts";
import tokenAddresses from "./tokenAddresses.json" with { type: "json" };
export { tokenAddresses };
import * as abi from "./src/generated.ts";
export { abi };

/**
 * Permission constants used for shop management operations.
 */
export const permissions = {
  /** Permission to add new permissions */
  addPermission: 0,
  /** Permission to remove existing permissions */
  removePermission: 1,
  /** Permission to update the root hash */
  updateRootHash: 2,
  /** Permission to add a relay */
  addRelay: 3,
  /** Permission to remove a relay */
  removeRelay: 4,
  /** Permission to replace a relay */
  replaceRelay: 5,
  /** Permission to register a user */
  registerUser: 6,
  /** Permission to remove a user */
  removeUser: 7,
  /** Permission to publish an invite verifier */
  publishInviteVerifier: 8,
} as const;

type Mutable = "nonpayable" | "payable";
type ReadOnly = "view" | "pure";

/**
 * A generic factory for producing functions for writing to a smart contract.
 * @example
 * ```ts
 * const writeFunc = genericWriteContract(myAbi, "myFunction", contractAddress);
 * await writeFunc(wallet, account, [arg1, arg2]);
 * ```
 */
export function genericWriteContract<
  const abiT extends Abi,
  const FuncName extends ContractFunctionName<abiT, Mutable>,
>(abi: abiT, functionName: FuncName, address: Hex): {
  (
    wallet: WalletClient,
    account: Account | Hex,
    args: ContractFunctionArgs<abiT, Mutable, FuncName>,
  ): Promise<WriteContractReturnType>;
} {
  return (
    wallet,
    account,
    args,
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

/**
 * A generic factory for producing functions for reading from a smart contract.
 *
 * @example
 * ```ts
 * const readFunc = genericReadContract(myAbi, "myViewFunction", contractAddress);
 * const result = await readFunc(publicClient, [arg1, arg2]);
 * ```
 */
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

/**
 * Function to pay with pre-approved tokens.
 */
export const payTokenPreApproved = genericWriteContract(
  abi.paymentsByAddressAbi,
  "payTokenPreApproved",
  abi.paymentsByAddressAddress,
);

/**
 * Function to pay with native currency.
 */
export const payNative = genericWriteContract(
  abi.paymentsByAddressAbi,
  "payNative",
  abi.paymentsByAddressAddress,
);

/**
 * Function to make a payment, automatically choosing between native and token payment.
 */
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

/**
 * Get the allowance for a spender on a token contract.
 *
 * @param publicClient - The public client to use for reading from the blockchain
 * @param contractAddress - The address of the token contract
 * @param args - The arguments for the allowance function [owner, spender]
 * @returns The allowance amount
 *
 * @example
 * ```ts
 * const allowance = await getAllowance(publicClient, tokenAddress, [ownerAddress, spenderAddress]);
 * console.log(allowance); // 1000000000000000000n (1 token with 18 decimals)
 * ```
 */
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

/**
 * Get token information (symbol and decimals) for a given token address.
 *
 * @param publicClient - The public client to use for reading from the blockchain
 * @param tokenAddress - The address of the token contract
 * @returns An object containing the token symbol and decimal count
 *
 * @example
 * ```ts
 * const tokenInfo = await getTokenInformation(publicClient, tokenAddress);
 * console.log(tokenInfo.symbol); // "ETH" or "DAI", etc.
 * console.log(tokenInfo.decimal); // 18
 * ```
 */
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

/**
 * Get the payment address for a given payment ID.
 */
export const getPaymentAddress = genericReadContract(
  abi.paymentsByAddressAbi,
  "getPaymentAddress",
  abi.paymentsByAddressAddress,
);

const getPaymentIdRaw = genericReadContract(
  abi.paymentsByAddressAbi,
  "getPaymentId",
  abi.paymentsByAddressAddress,
);

/**
 * Get the payment ID for the given parameters as a Uint8Array.
 */
export async function getPaymentId(
  ...args: Parameters<typeof getPaymentIdRaw>
): Promise<Uint8Array> {
  const result: bigint = await getPaymentIdRaw(...args);
  return pad(numberToBytes(result));
}

/**
 * Approve an ERC20 token for spending by another address.
 */
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

/**
 * Adds a relay to a shop.
 */
export const addRelay = genericWriteContract(
  abi.shopRegAbi,
  "addRelay",
  abi.shopRegAddress,
);

/**
 * Set the token URI for a shop.
 */
export const setTokenURI = genericWriteContract(
  abi.shopRegAbi,
  "setTokenURI",
  abi.shopRegAddress,
);

/**
 * Publish an invite verifier for a shop.
 */
export const publishInviteVerifier = genericWriteContract(
  abi.shopRegAbi,
  "publishInviteVerifier",
  abi.shopRegAddress,
);

/**
 * Redeem an invite for a shop.
 */
export const redeemInvite = genericWriteContract(
  abi.shopRegAbi,
  "redeemInvite",
  abi.shopRegAddress,
);

/**
 * Check if an address has a specific permission for a shop.
 */
export const checkPermissions = genericReadContract(
  abi.shopRegAbi,
  "hasPermission",
  abi.shopRegAddress,
);

/**
 * Mint a new shop.
 */
export const mintShop = genericWriteContract(
  abi.shopRegAbi,
  "mint",
  abi.shopRegAddress,
);

/**
 * Get the owner of a relay.
 */
export const relayRegGetOwnerOf = genericReadContract(
  abi.relayRegAbi,
  "ownerOf",
  abi.relayRegAddress,
);

/**
 * Get the balance of shops owned by an address.
 */
export const balanceOf = genericReadContract(
  abi.shopRegAbi,
  "balanceOf",
  abi.shopRegAddress,
);

/**
 * Get the token URI for a shop.
 */
export const getTokenURI = genericReadContract(
  abi.shopRegAbi,
  "tokenURI",
  abi.shopRegAddress,
);

/**
 * Get a shop token ID owned by an address at a specific index.
 */
export const tokenOfOwnerByIndex = genericReadContract(
  abi.shopRegAbi,
  "tokenOfOwnerByIndex",
  abi.shopRegAddress,
);

/**
 * Redeem an invite using a secret key.
 */
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

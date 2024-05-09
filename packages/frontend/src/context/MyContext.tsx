// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  useAccount,
  useEnsName,
  useBalance,
  useEnsAvatar,
  useWalletClient,
} from "wagmi";
import {
  RelayClient,
  ClientArgs,
  WalletClientWithAccount,
} from "@massmarket/client";
import { hardhat, sepolia, mainnet, type Chain } from "viem/chains";
import { http, createPublicClient, hexToBytes, bytesToHex } from "viem";
import { IRelayClient, ClientContext } from "@/context/types";
import { useAuth } from "@/context/AuthContext";
import * as abi from "@massmarket/contracts";
import { IStatus } from "../types";

export const MyContext = createContext<ClientContext>({
  walletAddress: null,
  balance: null,
  avatar: null,
  name: null,
  relayClient: null,
  publicClient: null,
  inviteSecret: null,
  setInviteSecret: () => {},
  setWallet: () => {},
  getTokenInformation: () =>
    new Promise(() => {
      return { name: "", symbol: "", decimals: 0 };
    }),
});

export const MyContextProvider = (
  props: React.HTMLAttributes<HTMLDivElement>,
) => {
  const [walletAddress, setWalletAddress] = useState<`0x${string}` | null>(
    null,
  );
  const [relayClient, setRelayClient] = useState<IRelayClient | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [ensName, setEnsName] = useState<string | null>(null);
  const [clientWallet, setWallet] = useState<WalletClientWithAccount | null>(
    null,
  );
  const [inviteSecret, setInviteSecret] = useState<`0x${string}` | null>(null);
  const { address, isConnected } = useAccount();
  const name = useEnsName({ address })?.data || null;
  const ensAvatar = useEnsAvatar({ name: ensName! })?.data;
  const { data: _wallet, status: walletStatus } = useWalletClient();
  const { setIsAuthenticated } = useAuth();

  if (typeof window == "undefined") {
    console.warn("not a browser session");
    return;
  }
  const storeId =
    localStorage.getItem("storeId") || process.env.NEXT_PUBLIC_STORE_ID;

  if (!storeId) {
    throw Error("missing store ID");
  }
  const savedKC = localStorage.getItem("keyCard") as `0x${string}`;

  let usedChain: Chain;
  const chainName = process.env.NEXT_PUBLIC_CHAIN_NAME!;
  switch (chainName) {
    case "hardhat":
      usedChain = hardhat;
      break;
    case "sepolia":
      usedChain = sepolia;
      break;
    case "mainnet":
      usedChain = mainnet;
      break;
    default:
      throw new Error(`unhandled chain name ${chainName}`);
  }

  const publicClient = createPublicClient({
    chain: usedChain,
    transport: http(),
  });
  const { data } = useBalance({
    address: address as `0x${string}`,
  });

  const getTokenInformation = async (erc20Addr: `0x${string}`) => {
    const name = (await publicClient.readContract({
      address: erc20Addr,
      abi: abi.ERC20,
      functionName: "name",
      args: [],
    })) as string;
    const symbol = (await publicClient.readContract({
      address: erc20Addr,
      abi: abi.ERC20,
      functionName: "symbol",
      args: [],
    })) as string;
    const decimals = (await publicClient.readContract({
      address: erc20Addr,
      abi: abi.ERC20,
      functionName: "decimals",
      args: [],
    })) as number;
    return { name, symbol, decimals };
  };

  useEffect(() => {
    if (_wallet && walletStatus == "success") {
      setWallet(_wallet);
    }
  }, [walletStatus]);

  useEffect(() => {
    if (clientWallet) {
      address && setWalletAddress(address);
      data?.formatted && setBalance(data.formatted);
      ensAvatar && setAvatar(ensAvatar);
      ensName && setEnsName(name);
    }
  }, [isConnected, clientWallet, data, ensAvatar, name]);

  useEffect(() => {
    if (clientWallet) {
      let keyCard = new Uint8Array(32);
      crypto.getRandomValues(keyCard);
      if (!savedKC) {
        localStorage.setItem("keyCardToEnroll", bytesToHex(keyCard));
      } else {
        keyCard = hexToBytes(savedKC);
      }
      const user: ClientArgs = {
        relayEndpoint:
          process.env.NEXT_PUBLIC_RELAY_ENDPOINT ||
          "wss://relay-beta.mass.market/v1",
        privateKey: inviteSecret ? hexToBytes(inviteSecret) : keyCard,
        storeId: storeId as `0x${string}`,
        wallet: clientWallet,
        chain: usedChain,
      };
      const _relayClient = new RelayClient(user);
      // @ts-expect-error FIXME
      setRelayClient(_relayClient);
      console.log(
        `relay client set ${user.relayEndpoint} with store: ${storeId}`,
      );
    }
    const user: ClientArgs = {
      relayEndpoint: process.env.NEXT_PUBLIC_RELAY_ENDPOINT,
      privateKey: inviteSecret ? hexToBytes(inviteSecret) : keyCard,
      storeId: storeId,
      chain: usedChain,
    };
    const _relayClient = new RelayClient(user);
    setRelayClient(_relayClient);
    console.log(
      `relay client set ${user.relayEndpoint} with store: ${storeId}`,
    );
  }, [clientWallet]);

  useEffect(() => {
    if (savedKC && relayClient) {
      //if we already have a saved KC, then just log in.
      relayClient.once("login", async () => {
        const authenticated = await relayClient.login();
        if (authenticated) {
          console.log("authenticated");
          setIsAuthenticated(IStatus.Complete);
        } else {
          setIsAuthenticated(IStatus.Failed);
          localStorage.removeItem("keyCard");
        }
      });
      relayClient.emit("login");
    }
  }, [relayClient]);

  const value = {
    name,
    walletAddress,
    balance,
    avatar,
    ensName,
    relayClient,
    publicClient,
    inviteSecret,
    setInviteSecret,
    setWallet,
    getTokenInformation,
  };

  return (
    <MyContext.Provider value={value}>{props.children}</MyContext.Provider>
  );
};

export const useMyContext = () => useContext(MyContext);

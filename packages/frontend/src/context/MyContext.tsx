// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { createContext, useContext, useEffect, useState } from "react";
import { useEnsAvatar, useWalletClient } from "wagmi";
import {
  RelayClient,
  discoverRelay,
  type WalletClientWithAccount,
} from "@massmarket/client";
import { hardhat, sepolia, mainnet, type Chain } from "viem/chains";
import { http, createPublicClient, createWalletClient } from "viem";
import { useAuth } from "@/context/AuthContext";
import * as abi from "@massmarket/contracts";
import { Status, ShopId } from "@/types";
import { type ClientContext } from "@/context/types";
import { privateKeyToAccount } from "viem/accounts";
import { usePathname } from "next/navigation";
import { random32BytesHex } from "@massmarket/utils";
import { useSearchParams } from "next/navigation";
import { zeroAddress } from "@massmarket/contracts";

export const MyContext = createContext<ClientContext>({
  walletAddress: null,
  ensName: null,
  shopId: "0x",
  avatar: null,
  relayClient: null,
  publicClient: null,
  inviteSecret: null,
  clientWallet: null,
  keyCardEnrolled: false,
  createNewRelayClient: () =>
    new Promise(() => {
      return null;
    }),
  setShopId: () => {},
  setKeyCardEnrolled: () => {},
  setInviteSecret: () => {},
  setRelayClient: () => {},
  setWallet: () => {},
  checkPermissions: () =>
    new Promise(() => {
      return false;
    }),
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
  const [relayClient, setRelayClient] = useState<RelayClient | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [ensName, setEnsName] = useState<string | null>(null);
  const [clientWallet, setWallet] = useState<WalletClientWithAccount | null>(
    null,
  );
  const [inviteSecret, setInviteSecret] = useState<`0x${string}` | null>(null);

  const ensAvatar = useEnsAvatar({ name: ensName! })?.data;
  const { data: _wallet, status: walletStatus } = useWalletClient();
  const {
    setIsConnected,
    setIsMerchantView,
    setUpdateRootHashPerm,
    isConnected,
  } = useAuth();
  const [keyCardEnrolled, setKeyCardEnrolled] = useState<boolean>(false);
  const searchParams = useSearchParams();

  const [shopId, setShopId] = useState<ShopId | null>(null);
  const pathname = usePathname();
  const isMerchantPath = [`/merchants/`, `/create-store/`].includes(pathname);
  const [guestKeyCard, setGuestKeyCard] = useState<`0x${string}` | null>(null);
  const [merchantKeyCard, setMerchantKeyCard] = useState<`0x${string}` | null>(
    null,
  );

  useEffect(() => {
    if (isMerchantPath) {
      localStorage.removeItem("merchantKeyCard");
      localStorage.removeItem("guestKeyCard");
    }
    //If shopId is provided as a query, set it as shopId, otherwise check for storeId in localStorage.
    const _shopId =
      (searchParams!.get("shopId") as `0x${string}`) ||
      localStorage.getItem("shopId");
    if (_shopId && !isMerchantPath) {
      localStorage.setItem("shopId", _shopId);
      setShopId(_shopId);
    }

    //Retrieve any saved keycards
    const gKC = localStorage.getItem("guestKeyCard") as `0x${string}`;
    const mKC = localStorage.getItem("merchantKeyCard") as `0x${string}`;

    if (gKC) {
      setGuestKeyCard(gKC);
    } else if (mKC) {
      setMerchantKeyCard(mKC);
    }
  }, []);

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

  const publicClient =
    chainName === "sepolia"
      ? createPublicClient({
          chain: usedChain,
          transport: http("https://rpc2.sepolia.org"),
        })
      : createPublicClient({
          chain: usedChain,
          transport: http(),
        });

  useEffect(() => {
    if (_wallet && walletStatus == "success") {
      setWallet(_wallet);
    }
  }, [walletStatus]);

  useEffect(() => {
    if (clientWallet) {
      setWalletAddress(clientWallet.account.address);
      ensAvatar && setAvatar(ensAvatar);
      ensName && setEnsName(clientWallet.account.address);
    }
  }, [clientWallet, ensAvatar]);

  useEffect(() => {
    if (isMerchantPath) return;
    let keyCard = random32BytesHex();

    if (!keyCardEnrolled && !guestKeyCard && !merchantKeyCard) {
      //If there is no enrolled keycards already saved in localStorage, save the new randomly generated hex to enroll.
      localStorage.setItem("keyCardToEnroll", keyCard);
    } else if (guestKeyCard) {
      //In the case of refresh, reuse the enrolled guest kc saved in localStorage
      keyCard = guestKeyCard;
    } else if (merchantKeyCard) {
      //In the case of refresh, reuse the enrolled merchant kc saved in localStorage
      keyCard = merchantKeyCard;
    }
    const privateKey = inviteSecret ? inviteSecret : keyCard;
    const keyCardWallet = privateKeyToAccount(privateKey);
    const relayUrl = process.env.NEXT_PUBLIC_RELAY_ENDPOINT!;
    (async () => {
      const relayEndpoint = process.env.NEXT_PUBLIC_RELAY_TOKEN_ID
        ? {
            url: new URL(relayUrl),
            tokenId: process.env.NEXT_PUBLIC_RELAY_TOKEN_ID as `0x${string}`,
          }
        : await discoverRelay(relayUrl);
      const user = {
        relayEndpoint,
        keyCardWallet,
        chain: usedChain,
      };
      console.log(
        `relay client set ${user.relayEndpoint.url} with shop: ${shopId}`,
      );
      const rc = new RelayClient(user);
      setRelayClient(rc);

      //Only enroll the keycard if no KC is saved in localStorage.
      if (!guestKeyCard && !merchantKeyCard && !keyCardEnrolled && shopId) {
        console.log("enrolling KC with guest wallet...");
        const guestWallet = createWalletClient({
          account: privateKeyToAccount(random32BytesHex()),
          chain: usedChain,
          transport: http(),
        });
        const res = await rc.enrollKeycard(
          guestWallet,
          true,
          shopId,
          new URL(window.location.href),
        );
        if (res.ok) {
          setKeyCardEnrolled(true);
          privateKey && localStorage.setItem("guestKeyCard", privateKey);
          setIsConnected(Status.Complete);
        } else {
          setIsConnected(Status.Failed);
          localStorage.removeItem("shopId");
        }
        localStorage.removeItem("keyCardToEnroll");
      } else if (guestKeyCard && isConnected === Status.Pending) {
        //If guestKeyCard exists, connect to client without enrolling
        console.log(`connecting to client with guest KC : ${guestKeyCard}`);
        setKeyCardEnrolled(true);
      } else if (
        merchantKeyCard &&
        walletAddress &&
        isConnected === Status.Pending
      ) {
        //If merchantKeyCard exists, double check that the KC has permissions, then connect to client without enrolling.
        const hasAccess = await checkPermissions();
        if (hasAccess) {
          setUpdateRootHashPerm(true);
          setIsMerchantView(true);
        }
        setKeyCardEnrolled(true);
      }
    })();
  }, [walletAddress, shopId, guestKeyCard, merchantKeyCard]);

  useEffect(() => {
    //This will be called once keycard is successfully enrolled, to connect to client.
    if (keyCardEnrolled) {
      (async () => {
        console.log("connecting to client...");
        const authenticated = await relayClient!.connect();
        console.log({ authenticated });
        if (authenticated) {
          setIsConnected(Status.Complete);
        } else {
          setIsConnected(Status.Failed);
        }
      })();
    }
  }, [keyCardEnrolled]);

  const getTokenInformation = async (address: `0x${string}`) => {
    if (address === zeroAddress) {
      return { name: "Ethereum", symbol: "ETH", decimals: 18 };
    }
    const name = (await publicClient.readContract({
      address: address,
      abi: abi.ERC20,
      functionName: "name",
      args: [],
    })) as string;
    const symbol = (await publicClient.readContract({
      address: address,
      abi: abi.ERC20,
      functionName: "symbol",
      args: [],
    })) as string;
    const decimals = (await publicClient.readContract({
      address: address,
      abi: abi.ERC20,
      functionName: "decimals",
      args: [],
    })) as number;
    return { name, symbol, decimals };
  };
  const checkPermissions = async () => {
    if (walletAddress) {
      const hasAccess = (await publicClient.readContract({
        address: abi.addresses.ShopReg as `0x${string}`,
        abi: abi.ShopReg,
        functionName: "hasPermission",
        args: [shopId, walletAddress, abi.permissions.updateRootHash],
      })) as boolean;
      return hasAccess;
    } else return false;
  };

  const createNewRelayClient = async () => {
    const keyCard = random32BytesHex();
    const keyCardWallet = privateKeyToAccount(keyCard);
    localStorage.setItem("keyCardToEnroll", keyCard);
    const relayUrl = process.env.NEXT_PUBLIC_RELAY_ENDPOINT!;
    const relayEndpoint = process.env.NEXT_PUBLIC_RELAY_TOKEN_ID
      ? {
          url: new URL(relayUrl),
          tokenId: process.env.NEXT_PUBLIC_RELAY_TOKEN_ID as `0x${string}`,
        }
      : await discoverRelay(relayUrl);
    const user = {
      relayEndpoint,
      keyCardWallet,
      shopId: shopId as `0x${string}`,
      chain: usedChain,
    };

    return new RelayClient(user);
  };

  const value = {
    walletAddress,
    avatar,
    ensName,
    relayClient,
    publicClient,
    inviteSecret,
    clientWallet,
    keyCardEnrolled,
    setInviteSecret,
    setWallet,
    getTokenInformation,
    setKeyCardEnrolled,
    shopId,
    setShopId,
    checkPermissions,
    setRelayClient,
    createNewRelayClient,
  };

  return (
    <MyContext.Provider value={value}>{props.children}</MyContext.Provider>
  );
};

export const useMyContext = () => useContext(MyContext);

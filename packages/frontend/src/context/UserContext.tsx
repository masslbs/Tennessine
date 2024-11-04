// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { createContext, useContext, useEffect, useState } from "react";
import { useEnsAvatar, useWalletClient } from "wagmi";
import { http, createPublicClient, createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat, mainnet, sepolia } from "viem/chains";
import { usePathname } from "next/navigation";
import { useSearchParams } from "next/navigation";
import debugLib from "debug";

import {
  discoverRelay,
  type RelayEndpoint,
  type WalletClientWithAccount,
} from "@massmarket/client";
import { random32BytesHex } from "@massmarket/utils";
import * as abi from "@massmarket/contracts";

import { useAuth } from "@/context/AuthContext";
import { type ClientContext } from "@/context/types";
import { Status, ShopId } from "@/types";
import { ClientWithStateManager } from "@/app/ClientWithStateManager";

export const UserContext = createContext<ClientContext>({
  walletAddress: null,
  avatar: null,
  ensName: null,
  clientWallet: null,
  shopPublicClient: null,
  inviteSecret: null,
  shopId: "0x",
  relayEndpoint: null,
  clientWithStateManager: null,
  setWallet: () => {},
  setInviteSecret: () => {},
  setShopId: () => {},
  checkPermissions: () =>
    new Promise(() => {
      return false;
    }),
  upgradeGuestToCustomer: () => new Promise(() => {}),
  setClientStateManager: () => {},
});

export const UserContextProvider = (
  props: React.HTMLAttributes<HTMLDivElement>,
) => {
  const debug = debugLib("frontend:UserContext");
  const log = debugLib("log:UserContext");
  log.color = "242";

  const [walletAddress, setWalletAddress] = useState<`0x${string}` | null>(
    null,
  );

  const [avatar, setAvatar] = useState<string | null>(null);
  const [ensName, setEnsName] = useState<string | null>(null);
  const [clientWallet, setWallet] = useState<WalletClientWithAccount | null>(
    null,
  );
  const [inviteSecret, setInviteSecret] = useState<`0x${string}` | null>(null);

  const ensAvatar = useEnsAvatar({ name: ensName! })?.data;
  const { data: _wallet, status: walletStatus } = useWalletClient();
  const { setIsConnected, setIsMerchantView, clientConnected } = useAuth();
  const searchParams = useSearchParams();

  const [shopId, setShopId] = useState<ShopId | null>(null);
  const pathname = usePathname();
  const isMerchantPath = [
    "/merchants/",
    "/create-store/",
    "/merchants/connect/",
  ].includes(pathname);

  const [merchantKC, setmerchantKC] = useState<`0x${string}` | null>(null);
  const [guestCheckoutKC, setGuestKC] = useState<`0x${string}` | null>(null);
  const [clientWithStateManager, setClientStateManager] =
    useState<ClientWithStateManager | null>(null);

  const [relayEndpoint, setRelayEndpoint] = useState<RelayEndpoint | null>(
    null,
  );

  useEffect(() => {
    if (process && process.env["NEXT_PUBLIC_RELAY_TOKEN_ID"]) {
      const re = {
        url: new URL(process.env["NEXT_PUBLIC_RELAY_ENDPOINT"] as string),
        tokenId: process.env["NEXT_PUBLIC_RELAY_TOKEN_ID"] as `0x${string}`,
      };
      setRelayEndpoint(re);
      log("using environment variables for relay endpoint %o", re);
    } else {
      discoverRelay("ws://localhost:4444/v3").then((relayEndpoint) => {
        if (!relayEndpoint.url) throw new Error("Relay endpoint URL not set");
        if (!relayEndpoint.tokenId)
          throw new Error("Relay endpoint tokenId not set");
        setRelayEndpoint(relayEndpoint);
        log("using testing relay endpoint %o", relayEndpoint);
      });
    }
  }, []);

  useEffect(() => {
    if (isMerchantPath) {
      localStorage.removeItem("merchantKC");
      localStorage.removeItem("guestCheckoutKC");
    }
    //If shopId is provided as a query, set it as shopId, otherwise check for storeId in localStorage.
    const _shopId =
      (searchParams!.get("shopId") as `0x${string}`) ||
      localStorage.getItem("shopId");
    if (_shopId && !isMerchantPath) {
      localStorage.setItem("shopId", _shopId);
      setShopId(_shopId);
    }

    //Load cached keycards
    const mKC = localStorage.getItem("merchantKC") as `0x${string}`;
    const gKC = localStorage.getItem("guestCheckoutKC") as `0x${string}`;
    if (mKC) {
      setmerchantKC(mKC);
    } else if (gKC) {
      setGuestKC(gKC);
    }
  }, []);

  const getUsedChain = () => {
    const chainName = process.env.NEXT_PUBLIC_CHAIN_NAME!;
    switch (chainName) {
      case "hardhat":
        return hardhat;
      case "sepolia":
        return sepolia;
      case "mainnet":
        return mainnet;
      default:
        throw new Error(`unhandled chain name ${chainName}`);
    }
  };

  const shopPublicClient = createPublicClient({
    chain: getUsedChain(),
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
    //If it's the connect merchant page we return, because this useEffect will rerun after setShopId is called in that component and reset the ClientWithStateManager, which we don't want.
    if (
      !shopId ||
      !relayEndpoint ||
      pathname === "/merchants/connect/" ||
      clientConnected !== Status.Pending
    )
      return;

    const clientStateManager = new ClientWithStateManager(
      shopPublicClient,
      shopId,
      relayEndpoint,
    );
    log("ClientWithStateManager set");
    setClientStateManager(clientStateManager);

    if (isMerchantPath) return;
    try {
      (async () => {
        //If merchantKC is cached, double check that the KC has permission, then connect & authenticate.
        if (merchantKC && walletAddress) {
          log("Connecting with merchant keycard");
          await clientStateManager.setClientAndConnect(merchantKC);
          const hasAccess = await checkPermissions();
          if (hasAccess) {
            setIsMerchantView(true);
            await clientStateManager.sendMerchantSubscriptionRequest();
            setIsConnected(Status.Complete);
          }
        } else if (!merchantKC && !guestCheckoutKC) {
          //If no keycards are cached, create relayClient with guest wallet, then connect without enrolling a kc or authenticating.
          log("Connecting without keycard");
          await clientStateManager.sendGuestSubscriptionRequest();
          setIsConnected(Status.Complete);
        } else if (guestCheckoutKC) {
          //If guestCheckout keycard is cached, connect, authenticate, and subscribe to orders.
          log("Connecting with guest checkout keycard");
          setIsConnected(Status.Complete);
          await clientStateManager.setClientAndConnect(guestCheckoutKC);
          await clientStateManager.sendGuestCheckoutSubscriptionRequest();
          log("Success: sendGuestCheckoutSubscriptionRequest");
        }
      })();
    } catch (error) {
      debug(error);
    }
  }, [relayEndpoint, walletAddress, shopId, merchantKC, guestCheckoutKC]);

  const checkPermissions = async () => {
    if (walletAddress) {
      const hasAccess = (await shopPublicClient.readContract({
        address: abi.addresses.ShopReg as `0x${string}`,
        abi: abi.ShopReg,
        functionName: "hasPermission",
        args: [shopId, walletAddress, abi.permissions.updateRootHash],
      })) as boolean;
      return hasAccess;
    } else return false;
  };

  const upgradeGuestToCustomer = async () => {
    //Enroll KC with guest wallet.
    const guestWallet = createWalletClient({
      account: privateKeyToAccount(random32BytesHex()),
      chain: getUsedChain(),
      transport: http(),
    });
    const keyCard = localStorage.getItem("keyCardToEnroll");
    const res = await clientWithStateManager!.relayClient!.enrollKeycard(
      guestWallet,
      true,
      shopId!,
      new URL(window.location.href),
    );
    if (res.ok) {
      //Cancel and renew subscription with orders
      await clientWithStateManager!.relayClient!.cancelSubscriptionRequest();
      const { response } =
        await clientWithStateManager!.relayClient!.authenticate();
      if (response.error) {
        debug(response.error);
        throw new Error("Error while authenticating");
      }
      await clientWithStateManager!.sendGuestCheckoutSubscriptionRequest();
      localStorage.setItem("guestCheckoutKC", keyCard!);
      setIsConnected(Status.Complete);
    } else {
      debug("Failed to enroll keycard while upgrading subscription");
    }
  };

  const value = {
    walletAddress,
    avatar,
    ensName,
    clientWallet,
    shopPublicClient,
    inviteSecret,
    shopId,
    relayEndpoint,
    clientWithStateManager,
    setWallet,
    setInviteSecret,
    setShopId,
    checkPermissions,
    upgradeGuestToCustomer,
    setClientStateManager,
  };

  return (
    <UserContext.Provider value={value}>{props.children}</UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);

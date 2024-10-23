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
  RelayClient,
  discoverRelay,
  type RelayEndpoint,
  type WalletClientWithAccount,
} from "@massmarket/client";
import { random32BytesHex } from "@massmarket/utils";
import * as abi from "@massmarket/contracts";

import { useAuth } from "@/context/AuthContext";
import { type ClientContext } from "@/context/types";
import { Status, ShopId } from "@/types";

export const UserContext = createContext<ClientContext>({
  walletAddress: null,
  ensName: null,
  shopId: "0x",
  avatar: null,
  relayClient: null,
  shopPublicClient: null,
  inviteSecret: null,
  clientWallet: null,
  createNewRelayClient: () =>
    new Promise(() => {
      return null;
    }),
  setShopId: () => {},
  setInviteSecret: () => {},
  setRelayClient: () => {},
  setWallet: () => {},
  checkPermissions: () =>
    new Promise(() => {
      return false;
    }),
  upgradeGuestToCustomer: () => new Promise(() => {}),
});

export const MyContextProvider = (
  props: React.HTMLAttributes<HTMLDivElement>,
) => {
  const debug = debugLib("frontend: UserContext");

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
  const isMerchantPath = [`/merchants/`, `/create-store/`].includes(pathname);
  const [merchantKeyCard, setMerchantKeyCard] = useState<`0x${string}` | null>(
    null,
  );
  const [guestCheckoutKC, setGuestKC] = useState<`0x${string}` | null>(null);

  const [relayClient, setRelayClient] = useState<RelayClient | null>(null);
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
      debug("using environment variables for relay endpoint %o", re);
    } else {
      discoverRelay("ws://localhost:4444/v3").then((relayEndpoint) => {
        if (!relayEndpoint.url) throw new Error("Relay endpoint URL not set");
        if (!relayEndpoint.tokenId)
          throw new Error("Relay endpoint tokenId not set");
        setRelayEndpoint(relayEndpoint);
        debug("using testing relay endpoint %o", relayEndpoint);
      });
    }
  }, []);

  useEffect(() => {
    if (isMerchantPath) {
      localStorage.removeItem("merchantKeyCard");
      localStorage.removeItem("guestCheckoutKC");
      localStorage.removeItem("seqNo");
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
    const mKC = localStorage.getItem("merchantKeyCard") as `0x${string}`;
    const gKC = localStorage.getItem("guestCheckoutKC") as `0x${string}`;
    if (mKC) {
      setMerchantKeyCard(mKC);
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
    if (isMerchantPath || !shopId) return;
    const seqNo = localStorage.getItem("seqNo") || 0;
    //If merchantKeyCard is cached, double check that the KC has permission, then connect & authenticate.
    if (
      merchantKeyCard &&
      walletAddress &&
      clientConnected === Status.Pending
    ) {
      const keyCardWallet = privateKeyToAccount(merchantKeyCard);
      const rc = new RelayClient({
        relayEndpoint: relayEndpoint!,
        keyCardWallet,
      });
      setRelayClient(rc);
      checkPermissions().then((hasAccess) => {
        if (hasAccess) {
          setIsMerchantView(true);
          rc.connect().then(() => {
            rc.authenticate().then(() => {
              rc.sendMerchantSubscriptionRequest(shopId, Number(seqNo)).then(
                () => setIsConnected(Status.Complete),
              );
            });
          });
        }
      });
    } else if (!merchantKeyCard && !guestCheckoutKC) {
      //If no keycards are cached, create relayClient with guest wallet, then connect without enrolling a kc or authenticating.
      createNewRelayClient().then((rc) => {
        setRelayClient(rc);
        rc.connect().then(() => {
          rc.sendGuestSubscriptionRequest(shopId, Number(seqNo)).then(() =>
            setIsConnected(Status.Complete),
          );
        });
      });
    } else if (guestCheckoutKC && clientConnected === Status.Pending) {
      //If already enrolled with guestCheckout keycard, connect, authenticate, and subscribe to orders.
      const keyCardWallet = privateKeyToAccount(guestCheckoutKC);
      const rc = new RelayClient({
        relayEndpoint: relayEndpoint!,
        keyCardWallet,
      });
      setRelayClient(rc);
      rc.connect().then(() => {
        rc.authenticate().then(() => {
          rc.sendGuestCheckoutSubscriptionRequest(shopId, Number(seqNo)).then(
            () => {
              setIsConnected(Status.Complete);
            },
          );
        });
      });
    }
  }, [relayEndpoint, walletAddress, shopId, merchantKeyCard, guestCheckoutKC]);

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
    const res = await relayClient!.enrollKeycard(
      guestWallet,
      true,
      shopId!,
      new URL(window.location.href),
    );
    if (res.ok) {
      //Cancel and renew subscription with orders
      await relayClient!.cancelSubscriptionRequest();
      const { response } = await relayClient!.authenticate();
      if (response.error) {
        debug(response.error);
        throw new Error("Error while authenticating");
      }
      await relayClient!.sendGuestCheckoutSubscriptionRequest(shopId!);
      localStorage.setItem("guestCheckoutKC", keyCard!);
      setIsConnected(Status.Complete);
    } else {
      debug("Failed to enroll keycard while upgrading subscription");
    }
  };

  const createNewRelayClient = async () => {
    if (!relayEndpoint) throw new Error("Relay endpoint not set");
    if (!relayEndpoint.url) throw new Error("Relay endpoint URL not set");
    if (!relayEndpoint.tokenId)
      throw new Error("Relay endpoint tokenId not set");
    debug(`Relay endpoint: %o`, relayEndpoint);
    const keyCard = random32BytesHex();
    const keyCardWallet = privateKeyToAccount(keyCard);
    localStorage.setItem("keyCardToEnroll", keyCard);
    return new RelayClient({
      relayEndpoint: relayEndpoint!,
      keyCardWallet,
    });
  };

  const value = {
    walletAddress,
    avatar,
    ensName,
    relayClient,
    shopPublicClient,
    inviteSecret,
    clientWallet,
    setInviteSecret,
    setWallet,
    shopId,
    setShopId,
    checkPermissions,
    setRelayClient,
    createNewRelayClient,
    upgradeGuestToCustomer,
  };

  return (
    <UserContext.Provider value={value}>{props.children}</UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);

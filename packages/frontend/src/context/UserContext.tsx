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
import { hardhat, mainnet, sepolia } from "viem/chains";
import { http, createPublicClient, createWalletClient } from "viem";
import { useAuth } from "@/context/AuthContext";
import * as abi from "@massmarket/contracts";
import { Status, ShopId, ObjectType } from "@/types";
import { type ClientContext } from "@/context/types";
import { privateKeyToAccount } from "viem/accounts";
import { usePathname } from "next/navigation";
import { random32BytesHex } from "@massmarket/utils";
import { useSearchParams } from "next/navigation";
import debugLib from "debug";

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
  sendGuestCheckoutSubscription: () => new Promise(() => {}),
});

export const MyContextProvider = (
  props: React.HTMLAttributes<HTMLDivElement>,
) => {
  const debug = debugLib("frontend: UserContext");

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
  const { setIsConnected, setIsMerchantView, clientConnected } = useAuth();
  const searchParams = useSearchParams();

  const [shopId, setShopId] = useState<ShopId | null>(null);
  const pathname = usePathname();
  const isMerchantPath = [`/merchants/`, `/create-store/`].includes(pathname);
  const [merchantKeyCard, setMerchantKeyCard] = useState<`0x${string}` | null>(
    null,
  );
  const [guestCheckoutKC, setGuestKC] = useState<`0x${string}` | null>(null);
  const relayURL =
    (process && process.env["NEXT_PUBLIC_RELAY_TOKEN_ID"]) ||
    "ws://localhost:4444/v3";

  useEffect(() => {
    if (isMerchantPath) {
      localStorage.removeItem("merchantKeyCard");
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

  const shopPublicClient = createPublicClient({
    chain: process.env.DEV || process.env.NEXT_PUBLIC_DEV ? hardhat : mainnet,
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
    discoverRelay(relayURL).then((relayEndpoint) => {
      //If merchantKeyCard is cached, double check that the KC has permission, then connect & authenticate.
      if (
        merchantKeyCard &&
        walletAddress &&
        clientConnected === Status.Pending
      ) {
        const keyCardWallet = privateKeyToAccount(merchantKeyCard);
        const rc = new RelayClient({
          relayEndpoint,
          keyCardWallet,
        });
        setRelayClient(rc);
        checkPermissions()
          .then((hasAccess) => {
            if (hasAccess) {
              setIsMerchantView(true);
              rc.connect().then(() => {
                rc.authenticate().then(() => {
                  const filters = [
                    { objectType: ObjectType.OBJECT_TYPE_LISTING },
                    { objectType: ObjectType.OBJECT_TYPE_TAG },
                    { objectType: ObjectType.OBJECT_TYPE_ORDER },
                    { objectType: ObjectType.OBJECT_TYPE_ACCOUNT },
                    { objectType: ObjectType.OBJECT_TYPE_MANIFEST },
                    { objectType: ObjectType.OBJECT_TYPE_INVENTORY },
                  ];

                  rc.sendSubscriptionRequest(
                    shopId,
                    filters,
                    Number(seqNo),
                  ).then();
                  setIsConnected(Status.Complete);
                });
              });
            }
          })
          .catch();
      } else if (!merchantKeyCard && !guestCheckoutKC) {
        //If no keycards are cached, create relayClient with guest wallet, then connect without enrolling a kc or authenticating.
        createNewRelayClient().then((rc) => {
          setRelayClient(rc);
          rc.connect().then(() => {
            const filters = [
              { objectType: ObjectType.OBJECT_TYPE_LISTING },
              { objectType: ObjectType.OBJECT_TYPE_TAG },
              { objectType: ObjectType.OBJECT_TYPE_MANIFEST },
              { objectType: ObjectType.OBJECT_TYPE_ACCOUNT },
            ];
            rc.sendSubscriptionRequest(shopId!, filters, Number(seqNo)).then();
            setIsConnected(Status.Complete);
          });
        });
      } else if (guestCheckoutKC) {
        //If already enrolled with guestCheckout keycard, connect, authenticate, and subscribe to orders.
        const keyCardWallet = privateKeyToAccount(guestCheckoutKC);
        const rc = new RelayClient({
          relayEndpoint,
          keyCardWallet,
        });
        setRelayClient(rc);
        rc.connect().then(() => {
          rc.authenticate().then(() => {
            const filters = [
              { objectType: ObjectType.OBJECT_TYPE_LISTING },
              { objectType: ObjectType.OBJECT_TYPE_TAG },
              { objectType: ObjectType.OBJECT_TYPE_MANIFEST },
              { objectType: ObjectType.OBJECT_TYPE_ORDER },
              { objectType: ObjectType.OBJECT_TYPE_ACCOUNT },
            ];
            rc.sendSubscriptionRequest(shopId!, filters, Number(seqNo)).then(
              () => {
                setIsConnected(Status.Complete);
              },
            );
          });
        });
      }
    });
  }, [walletAddress, shopId, merchantKeyCard, guestCheckoutKC]);

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

  const sendGuestCheckoutSubscription = async () => {
    let usedChain;
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
    //Enroll KC with guest wallet.
    const guestWallet = createWalletClient({
      account: privateKeyToAccount(random32BytesHex()),
      chain: usedChain,
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
      const filters = [
        { objectType: ObjectType.OBJECT_TYPE_LISTING },
        { objectType: ObjectType.OBJECT_TYPE_TAG },
        { objectType: ObjectType.OBJECT_TYPE_MANIFEST },
        { objectType: ObjectType.OBJECT_TYPE_ORDER },
      ];
      await relayClient!.sendSubscriptionRequest(shopId!, filters);
      localStorage.setItem("guestCheckoutKC", keyCard!);
      setIsConnected(Status.Complete);
    }
  };

  const createNewRelayClient = async () => {
    const keyCard = random32BytesHex();
    const keyCardWallet = privateKeyToAccount(keyCard);
    localStorage.setItem("keyCardToEnroll", keyCard);
    const relayEndpoint = await discoverRelay(relayURL);
    const user = {
      relayEndpoint,
      keyCardWallet,
    };

    return new RelayClient(user);
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
    sendGuestCheckoutSubscription,
  };

  return (
    <UserContext.Provider value={value}>{props.children}</UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);

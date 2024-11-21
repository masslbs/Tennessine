// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useEnsAvatar, useWalletClient } from "wagmi";
import { hardhat, mainnet, sepolia } from "viem/chains";
import { usePathname, useSearchParams } from "next/navigation";

import { discoverRelay, type RelayEndpoint } from "@massmarket/client";
import { logger } from "@massmarket/utils";
import * as abi from "@massmarket/contracts";

import {
  createGuestWalletClientForChain,
  createPublicClientForChain,
  isMerchantPath,
} from "@/app/utils";
import { useClient } from "@/context/AuthContext";
import { type ClientContext } from "@/context/types";
import { ShopId, Status } from "@/types";
import { ClientWithStateManager } from "@/app/ClientWithStateManager";

export const UserContext = createContext<ClientContext>({
  walletAddress: null,
  avatar: null,
  ensName: null,
  clientWallet: null,
  shopPublicClient: null,
  inviteSecret: null,
  shopId: null,
  relayEndpoint: null,
  clientWithStateManager: null,
  setInviteSecret: () => {},
  setShopId: () => {},
  checkPermissions: () =>
    new Promise(() => {
      return false;
    }),
  upgradeGuestToCustomer: () => new Promise(() => {}),
  setClientStateManager: () => {},
});

const namespace = "frontend:user-context";
const debug = logger(namespace);

export const UserContextProvider = (
  props: React.HTMLAttributes<HTMLDivElement>,
) => {
  const pathname = usePathname();
  const { data: _wallet, status: walletStatus } = useWalletClient();
  const { setIsConnected, setIsMerchantView, clientConnected } = useClient();
  const searchParams = useSearchParams();

  const [walletAddress, setWalletAddress] = useState<`0x${string}` | null>(
    null,
  );
  const [avatar, setAvatar] = useState<string | null>(null);
  const [ensName, setEnsName] = useState<string | null>(null);
  const [clientWallet, setWallet] = useState(null);
  const [inviteSecret, setInviteSecret] = useState<`0x${string}` | null>(null);
  const [shopId, setShopId] = useState<ShopId | null>(null);
  const [merchantKC, setmerchantKC] = useState<`0x${string}` | null>(null);
  const [guestCheckoutKC, setGuestKC] = useState<`0x${string}` | null>(null);
  const [clientWithStateManager, setClientStateManager] = useState<
    ClientWithStateManager | null
  >(null);
  const [relayEndpoint, setRelayEndpoint] = useState<RelayEndpoint | null>(
    null,
  );
  const authenticated = useRef(false);

  const ensAvatar = useEnsAvatar({ name: ensName! })?.data;
  const merchantPath = isMerchantPath(pathname);

  useEffect(() => {
    if (process && process.env["NEXT_PUBLIC_RELAY_TOKEN_ID"]) {
      const re = {
        url: new URL(process.env["NEXT_PUBLIC_RELAY_ENDPOINT"] as string),
        tokenId: process.env["NEXT_PUBLIC_RELAY_TOKEN_ID"] as `0x${string}`,
      };
      setRelayEndpoint(re);
      debug(`using environment variables for relay endpoint ${re.url}`);
    } else {
      discoverRelay("ws://localhost:4444/v3").then((discovered) => {
        if (!discovered.url) throw new Error("Relay endpoint URL not set");
        if (!discovered.tokenId) {
          throw new Error("Relay endpoint tokenId not set");
        }
        setRelayEndpoint(discovered);
        debug(`using testing relay endpoint ${discovered.url}`);
      });
    }
  }, []);

  useEffect(() => {
    if (merchantPath) {
      localStorage.removeItem("merchantKC");
      localStorage.removeItem("guestCheckoutKC");
    }
    //If shopId is provided as a query, set it as shopId, otherwise check for storeId in localStorage.
    const _shopId = searchParams!.get("shopId") ||
      localStorage.getItem("shopId");

    if (_shopId && !merchantPath) {
      localStorage.setItem("shopId", _shopId);
      setShopId(BigInt(_shopId));
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

  function getUsedChain() {
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
  }

  const shopPublicClient = createPublicClientForChain(getUsedChain());

  async function checkPermissions() {
    if (walletAddress) {
      const hasAccess = (await shopPublicClient.readContract({
        address: abi.addresses.ShopReg as `0x${string}`,
        abi: abi.shopRegAbi,
        functionName: "hasPermission",
        args: [shopId, walletAddress, abi.permissions.updateRootHash],
      })) as boolean;
      return hasAccess;
    } else return false;
  }

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
    if (
      !shopId ||
      !relayEndpoint ||
      //If it's the connect merchant page we return, because this useEffect will rerun after setShopId is called in that component and reset the ClientWithStateManager, which we don't want.
      pathname === "/merchants/connect/" ||
      clientConnected !== Status.Pending ||
      authenticated.current
    ) {
      return;
    }
    const clientStateManager = new ClientWithStateManager(
      shopPublicClient,
      shopId,
      relayEndpoint,
    );
    debug("ClientWithStateManager set");
    setClientStateManager(clientStateManager);

    if (merchantPath) return;
    (async () => {
      //If merchantKC is cached, double check that the KC has permission, then connect & authenticate.
      if (merchantKC && walletAddress) {
        debug("Connecting with merchant keycard");
        await clientStateManager.setClientAndConnect(merchantKC);
        const hasAccess = await checkPermissions();
        if (hasAccess) {
          setIsMerchantView(true);
          await clientStateManager.sendMerchantSubscriptionRequest();
          setIsConnected(Status.Complete);
        }
      } else if (!merchantKC && !guestCheckoutKC) {
        //If no keycards are cached, create relayClient with guest wallet, then connect without enrolling a kc or authenticating.
        await clientStateManager.sendGuestSubscriptionRequest();
        debug("connected without keycard");
        setIsConnected(Status.Complete);
      } else if (guestCheckoutKC) {
        authenticated.current = true;

        //If guestCheckout keycard is cached, connect, authenticate, and subscribe to orders.
        await clientStateManager.setClientAndConnect(guestCheckoutKC);
        await clientStateManager.sendGuestCheckoutSubscriptionRequest();
        debug(`connected with guest checkout keycard ${guestCheckoutKC}`);
        setIsConnected(Status.Complete);
      }
    })();
  }, [relayEndpoint, walletAddress, shopId, merchantKC, guestCheckoutKC]);

  async function upgradeGuestToCustomer() {
    //Enroll KC with guest wallet.
    const guestWallet = createGuestWalletClientForChain(getUsedChain());
    const keyCard = localStorage.getItem("keyCardToEnroll");
    debug(`Enrolling KC ${keyCard}`);
    const res = await clientWithStateManager!.relayClient!.enrollKeycard(
      guestWallet,
      true,
      shopId!,
      new URL(globalThis.location.href),
    );
    if (!res.ok) {
      throw new Error(`Failed to enroll keycard: ${res.error}`);
    }
    debug("Keycard enrolled");
    //Cancel and renew subscription with orders
    await clientWithStateManager!.relayClient!.cancelSubscriptionRequest();
    const { response } = await clientWithStateManager!.relayClient!
      .authenticate();
    if (response.error) {
      throw new Error(`Error while authenticating: ${response.error}`);
    }
    await clientWithStateManager!.sendGuestCheckoutSubscriptionRequest();
    localStorage.setItem("guestCheckoutKC", keyCard!);
    debug("Success: upgradeGuestToCustomer");
    setIsConnected(Status.Complete);
  }

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

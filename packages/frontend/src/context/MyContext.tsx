// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, {
  createContext,
  useContext,
  useRef,
  useEffect,
  useState,
} from "react";
import {
  useAccount,
  useEnsName,
  useBalance,
  useEnsAvatar,
  useWalletClient,
} from "wagmi";
import { RelayClient, type WalletClientWithAccount } from "@massmarket/client";
import { hardhat, sepolia, mainnet, type Chain } from "viem/chains";
import {
  http,
  createPublicClient,
  hexToBytes,
  bytesToHex,
  parseAbiItem,
  createWalletClient,
} from "viem";
import { useAuth } from "@/context/AuthContext";
import * as abi from "@massmarket/contracts";
import { IStatus } from "../types";
import { type ClientContext, ShopId } from "./types";
import { privateKeyToAccount, Address } from "viem/accounts";
import { usePathname } from "next/navigation";
import { random32BytesHex } from "@massmarket/client/src/utils";

export const MyContext = createContext<ClientContext>({
  walletAddress: null,
  shopId: "0x",
  balance: null,
  avatar: null,
  name: null,
  relayClient: null,
  publicClient: null,
  inviteSecret: null,
  clientWallet: null,
  setShopId: () => {},
  setKcEnrolled: () => {},
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
  const [relayClient, setRelayClient] = useState<RelayClient | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [ensName, setEnsName] = useState<string | null>(null);
  const [clientWallet, setWallet] = useState<WalletClientWithAccount | null>(
    null,
  );
  const [kcEnrolled, setKcEnrolled] = useState(false);
  const [inviteSecret, setInviteSecret] = useState<`0x${string}` | null>(null);
  const { address, isConnected } = useAccount();
  const name = useEnsName({ address })?.data || null;
  const ensAvatar = useEnsAvatar({ name: ensName! })?.data;
  const { data: _wallet, status: walletStatus } = useWalletClient();
  const { setIsAuthenticated } = useAuth();

  const [storeIds, setStoreIds] = useState<null | Map<ShopId, boolean>>(null);
  const [shopId, setShopId] = useState<ShopId>(
    (localStorage.getItem("shopId") as ShopId) ||
      (process.env.NEXT_PUBLIC_STORE_ID as ShopId),
  );

  const storeIdsVerified = useRef(false);
  const pathname = usePathname();

  if (typeof window == "undefined") {
    console.warn("not a browser session");
    return;
  }

  if (!shopId) {
    throw Error("missing shop ID");
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

  const checkPermissions = async () => {
    console.log("in here");
    if (publicClient) {
      const PERMRootHash = await publicClient.readContract({
        address: abi.addresses.ShopReg as `0xs${string}`,
        abi: abi.ShopReg,
        functionName: "PERM_updateRootHash",
      });
      const _hasAccess = await publicClient.readContract({
        address: abi.addresses.ShopReg as `0x${string}`,
        abi: abi.ShopReg,
        functionName: "hasPermission",
        args: [shopId, walletAddress, PERMRootHash],
      });
      return _hasAccess;
    }
  };

  const getStores = async () => {
    const stores = new Map();

    const logs = await publicClient.getLogs({
      address: abi.addresses.ShopReg as Address,
      event: parseAbiItem(
        "event Transfer(address indexed from, address indexed to, uint256 value)",
      ),
      fromBlock: "earliest",
      toBlock: "latest",
      args: {
        to: walletAddress,
      },
    });
    logs.map(async (l) => {
      //@ts-expect-error FIXME
      stores.set(l.topics?.[3], 1);
    });
    return stores;
  };

  useEffect(() => {
    (async () => {
      if (publicClient && walletAddress && !storeIdsVerified.current) {
        storeIdsVerified.current = true;
        const _storeIds = await getStores();
        setStoreIds(_storeIds);
      }
    })();
  }, [walletAddress, publicClient]);

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
    let keyCard = random32BytesHex();
    if (!savedKC) {
      localStorage.setItem("keyCardToEnroll", keyCard);
    } else {
      keyCard = savedKC;
    }
    const privateKey = inviteSecret ? inviteSecret : keyCard;
    const keyCardWallet = privateKeyToAccount(privateKey);
    console.log({ keyCardWallet });
    const user = {
      relayEndpoint:
        process.env.NEXT_PUBLIC_RELAY_ENDPOINT ||
        "wss://relay-beta.mass.market/v1",
      keyCardWallet,
      shopId: shopId as `0x${string}`,
      chain: usedChain,
    };
    const _relayClient = new RelayClient(user);
    setRelayClient(_relayClient);
    if (
      !pathname.includes("connect-wallet") &&
      !pathname.includes("create-store")
    ) {
      if (!savedKC) {
        (async () => {
          const guestWallet = createWalletClient({
            account: privateKeyToAccount(
              "0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6",
            ),
            chain: usedChain,
            transport: http(),
          });
          const res = await _relayClient.enrollKeycard(guestWallet, false);
          if (res.ok) {
            setKcEnrolled(true);
            privateKey && localStorage.setItem("keyCard", privateKey);
          } else {
            setIsAuthenticated(IStatus.Failed);
            localStorage.removeItem("keyCard");
          }
          localStorage.removeItem("keyCardToEnroll");
        })();
      } else {
        setKcEnrolled(true);
      }
    } else {
      //for create store page
      (async () => {
        console.log("relay client inside enrollkeycard");
        if (!clientWallet) return;
        const access = await checkPermissions();
        const res = await _relayClient!.enrollKeycard(clientWallet, access);
        if (res.ok) {
          setKcEnrolled(true);
          keyCard && localStorage.setItem("keyCard", keyCard);
          console.log("KC reenrolled");
        } else {
          setIsAuthenticated(IStatus.Failed);
          localStorage.removeItem("keyCard");
        }
        localStorage.removeItem("keyCardToEnroll");
      })();
    }

    console.log(`relay client set ${user.relayEndpoint} with shop: ${shopId}`);
  }, [shopId]);

  useEffect(() => {
    (async () => {
      if (kcEnrolled && relayClient) {
        const authenticated = await relayClient.connect();
        console.log("connecting to client...");
        console.log({ authenticated });
        if (authenticated) {
          setIsAuthenticated(IStatus.Complete);
        } else {
          setIsAuthenticated(IStatus.Failed);
        }
      }
    })();
  }, [kcEnrolled]);

  const reenrollKC = async () => {
    if (!clientWallet) return;
    setKcEnrolled(false);
    const keyCard = random32BytesHex();
    const keyCardWallet = privateKeyToAccount(keyCard);
    const user = {
      relayEndpoint:
        process.env.NEXT_PUBLIC_RELAY_ENDPOINT ||
        "wss://relay-beta.mass.market/v1",
      keyCardWallet,
      shopId: shopId as `0x${string}`,
      chain: usedChain,
    };
    const _relayClient = new RelayClient(user);
    const access = await checkPermissions();
    const res = await _relayClient!.enrollKeycard(clientWallet, access);
    setRelayClient(_relayClient);
    if (res.ok) {
      setKcEnrolled(true);
      keyCard && localStorage.setItem("keyCard", keyCard);
      console.log("KC reenrolled");
    } else {
      setIsAuthenticated(IStatus.Failed);
      localStorage.removeItem("keyCard");
    }
    localStorage.removeItem("keyCardToEnroll");
  };

  const value = {
    name,
    walletAddress,
    balance,
    avatar,
    ensName,
    relayClient,
    publicClient,
    inviteSecret,
    clientWallet,
    setInviteSecret,
    setWallet,
    getTokenInformation,
    setKcEnrolled,
    storeIds,
    shopId,
    setShopId,
    checkPermissions,
    reenrollKC,
  };

  return (
    <MyContext.Provider value={value}>{props.children}</MyContext.Provider>
  );
};

export const useMyContext = () => useContext(MyContext);

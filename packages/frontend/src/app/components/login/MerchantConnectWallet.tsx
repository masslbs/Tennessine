// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Connector, useConnect } from "wagmi";
import { useMyContext } from "@/context/MyContext";
import { parseAbiItem } from "viem";
import * as abi from "@massmarket/contracts";

import { useAuth } from "@/context/AuthContext";
import { IStatus } from "@/types";
import { Address } from "viem/accounts";
import { ShopId } from "@/context/types";
import { useMerchantContext } from "@/context/MerchantContext";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

const MerchantConnectWallet = ({ close }: { close: () => void }) => {
  const { connectors, connect } = useConnect();
  const {
    walletAddress,
    publicClient,
    clientWallet,
    setShopId,
    setRelayClient,
    setKeyCardEnrolled,
    createNewRelayClient,
  } = useMyContext();
  const { isConnected, setIsConnected, setIsMerchantView } = useAuth();
  const enrollKeycard = useRef(false);

  const { setStoreIds } = useMerchantContext();
  const storeIdsVerified = useRef(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const shopId = searchParams!.get("shopId") as `0x${string}`;
  const chainName = process.env.NEXT_PUBLIC_CHAIN_NAME!;

  if (typeof window == "undefined") {
    console.warn("not a browser session");
    return;
  }
  useEffect(() => {
    if (shopId) {
      localStorage.setItem("shopId", shopId);
      setShopId(shopId);
    }
  });

  useEffect(() => {
    (async () => {
      if (publicClient && walletAddress && !storeIdsVerified.current) {
        storeIdsVerified.current = true;
        let usedShopId;
        if (shopId) {
          usedShopId = shopId;
        } else {
          const _storeIds = await getShops();
          console.log({ _storeIds });
          setStoreIds(_storeIds);
          const _shopIds = Array.from([..._storeIds.keys()]);
          usedShopId = _shopIds[_shopIds.length - 1];
        }
        await enroll(usedShopId);
      }
    })();
  }, [walletAddress, publicClient]);

  const getShops = async () => {
    const stores = new Map();
    const block = await publicClient!.getBlockNumber();
    const logs = await publicClient!.getLogs({
      address: abi.addresses.ShopReg as Address,
      event: parseAbiItem(
        "event Transfer(address indexed from, address indexed to, uint256 value)",
      ),
      fromBlock: chainName === "hardhat" ? "earliest" : block - BigInt(20000),
      toBlock: "latest",
      args: {
        to: walletAddress,
      },
    });
    console.log({ logs });
    logs.map(async (l) => {
      //@ts-expect-error FIXME
      stores.set(l.topics?.[3], 1);
    });
    return stores;
  };

  const enroll = async (shopId: ShopId) => {
    console.log(`enrolling with shopId: ${shopId}`);
    if (shopId) {
      if (
        clientWallet &&
        isConnected === IStatus.Pending &&
        !enrollKeycard.current
      ) {
        enrollKeycard.current = true;
        setShopId(shopId);
        localStorage.setItem("shopId", shopId);
        (async () => {
          const _relayClient = await createNewRelayClient();
          if (!_relayClient) return;
          const keyCardToEnroll = localStorage.getItem(
            "keyCardToEnroll",
          ) as `0x${string}`;
          const res = await _relayClient.enrollKeycard(
            clientWallet,
            false,
            shopId,
            new URL(window.location.href),
          );
          if (res.ok) {
            console.log(`Keycard enrolled: ${keyCardToEnroll}`);
            setIsMerchantView(true);
            setRelayClient(_relayClient);
            setKeyCardEnrolled(true);
            keyCardToEnroll &&
              localStorage.setItem("merchantKeyCard", keyCardToEnroll);
            setIsConnected(IStatus.Complete);
          } else {
            enrollKeycard.current = false;
            setIsConnected(IStatus.Failed);
            localStorage.removeItem("keyCard");
          }
          localStorage.removeItem("keyCardToEnroll");
        })();
      }
    } else {
      console.log("you have no shops created. Redirecting to create a shop.");
      router.push("/create-store");
    }
  };

  const displayConnectors = () => {
    return connectors.map((connector: Connector) => (
      <button
        key={connector.uid}
        onClick={() => connect({ connector })}
        className="p-4 bg-white my-4 border rounded w-full"
      >
        {connector.name}
      </button>
    ));
  };

  return (
    <section className="bg-gray-100 h-screen absolute top-0	right-0	left-0">
      <div className="h-fit w-full border border-gray-200 p-4 text-base flex justify-between">
        <div className="flex">
          <p className="ml-2">Connect Wallet</p>
        </div>
        <Image
          src="/assets/quit.svg"
          width={24}
          height={24}
          alt="quit-icon"
          className="h-6"
          onClick={close}
        />
      </div>
      <section className="mx-4 my-6">
        <p className="font-sans">Connect your wallet</p>
        <div>{displayConnectors()}</div>
      </section>
    </section>
  );
};

export default MerchantConnectWallet;

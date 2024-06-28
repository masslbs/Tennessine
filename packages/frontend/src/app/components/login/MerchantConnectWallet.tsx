// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Connector, useConnect, useWalletClient } from "wagmi";
import { useMyContext } from "@/context/MyContext";
import { parseAbiItem } from "viem";
import * as abi from "@massmarket/contracts";

import { useAuth } from "@/context/AuthContext";
import { IStatus } from "@/types";
import { Address } from "viem/accounts";
import { ShopId } from "@/context/types";
import { useMerchantContext } from "@/context/MerchantContext";

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
  const [pending, setPending] = useState<boolean>(false);
  const [hasAccess, setAccess] = useState<boolean>(false);
  const { isConnected, setIsConnected, setIsMerchantView } = useAuth();
  const enrollKeycard = useRef(false);
  const { data: _wallet, status: walletStatus } = useWalletClient();
  const [connectionStatus, setConnectionStatus] = useState<IStatus>(
    IStatus.Pending,
  );
  const { setStoreIds } = useMerchantContext();
  const keyCardToEnroll = localStorage.getItem(
    "keyCardToEnroll",
  ) as `0x${string}`;
  const storeIdsVerified = useRef(false);

  if (typeof window == "undefined") {
    console.warn("not a browser session");
    return;
  }
  useEffect(() => {
    setIsMerchantView(true);
  }, []);

  useEffect(() => {
    (async () => {
      if (publicClient && walletAddress && !storeIdsVerified.current) {
        storeIdsVerified.current = true;
        const _storeIds = await getShops();
        console.log({ _storeIds });
        setStoreIds(_storeIds);
        const _shopIds = Array.from([..._storeIds.keys()]);
        await enroll(_shopIds[0]);
      }
    })();
  }, [walletAddress, publicClient]);

  const getShops = async () => {
    const stores = new Map();
    const logs = await publicClient!.getLogs({
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

  const enroll = async (shopId: ShopId) => {
    if (shopId) {
      if (
        keyCardToEnroll &&
        clientWallet &&
        isConnected === IStatus.Pending &&
        !enrollKeycard.current
      ) {
        enrollKeycard.current = true;
        setShopId(shopId);
        (async () => {
          const _relayClient = createNewRelayClient();
          const res = await _relayClient.enrollKeycard(
            clientWallet,
            !hasAccess,
            shopId,
          );
          if (res.ok) {
            console.log(`Keycard enrolled`);
            setRelayClient(_relayClient);
            setKeyCardEnrolled(true);
            keyCardToEnroll && localStorage.setItem("keyCard", keyCardToEnroll);
            setIsConnected(IStatus.Complete);
            setConnectionStatus(IStatus.Complete);
          } else {
            enrollKeycard.current = false;
            setConnectionStatus(IStatus.Failed);
            setIsConnected(IStatus.Failed);
            localStorage.removeItem("keyCard");
          }
          localStorage.removeItem("keyCardToEnroll");
        })();
      }
    } else {
      console.log("you have no shops created. Redirecting to create a shop.");
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

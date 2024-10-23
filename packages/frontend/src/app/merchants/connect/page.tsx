// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import debugLib from "debug";
import { useAccount } from "wagmi";
import { Address } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import * as abi from "@massmarket/contracts";
import { Status, ShopId } from "@/types";
import { isValidHex } from "@/app/utils";
import ErrorMessage from "@/app/common/components/ErrorMessage";
import Button from "@/app/common/components/Button";
import { useAuth } from "@/context/AuthContext";
import { useUserContext } from "@/context/UserContext";
import Confirmation from "./Confirmation";

const MerchantConnectWallet = () => {
  const {
    shopPublicClient,
    clientWallet,
    setShopId,
    setRelayClient,
    createNewRelayClient,
  } = useUserContext();
  const { clientConnected, setIsConnected, setIsMerchantView } = useAuth();
  const enrollKeycard = useRef(false);

  const { status } = useAccount();
  const debug = debugLib("frontend: Connect Merchant");

  const [searchShopId, setSearchShopId] = useState<string>("");
  const [step, setStep] = useState<"search" | "connect" | "confirmation">(
    "search",
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [shopData, setShopData] = useState<{
    name: string;
    image: string;
  } | null>(null);

  const getButton = () => {
    if (step === "search") {
      return <Button onClick={handleSearchForShop}>Search for shop</Button>;
    } else if (shopData) {
      return (
        <div className="flex flex-col gap-4">
          <div className="flex gap-3">
            <div className="overflow-hidden	rounded-full w-12 h-12">
              <Image
                src={shopData.image || "/icons/mass-labs-logo.svg"}
                width={50}
                height={50}
                alt="mass-labs-logo"
                unoptimized={true}
                className="w-12 h-12"
              />
            </div>
            <p className="flex items-center">{shopData.name}</p>
          </div>
          <ConnectButton />
          <Button disabled={status !== "connected"} onClick={enroll}>
            Connect to shop
          </Button>
        </div>
      );
    }
  };
  const handleClearShopIdInput = () => {
    setSearchShopId("");
    setStep("search");
  };
  const handleSearchForShop = async () => {
    if (!isValidHex(searchShopId)) {
      setErrorMsg("Enter a valid shop ID");
      return;
    }
    const uri = (await shopPublicClient!.readContract({
      address: abi.addresses.ShopReg as Address,
      abi: abi.ShopReg,
      functionName: "tokenURI",
      args: [searchShopId],
    })) as string;
    if (uri) {
      const res = await fetch(uri);
      const data = await res.json();
      setShopData(data);
      setStep("connect");
      return;
    }

    setErrorMsg("Shop not found");
  };

  const enroll = async () => {
    if (clientConnected === Status.Pending && !enrollKeycard.current) {
      enrollKeycard.current = true;
      const id = searchShopId as ShopId;
      setShopId(id);
      localStorage.setItem("shopId", id);
      localStorage.removeItem("seqNo");

      try {
        (async () => {
          const _relayClient = await createNewRelayClient();
          if (!_relayClient) return;
          const keyCardToEnroll = localStorage.getItem(
            "keyCardToEnroll",
          ) as `0x${string}`;
          const res = await _relayClient.enrollKeycard(
            clientWallet!,
            false,
            id,
            new URL(window.location.href),
          );
          if (res.ok) {
            console.log(`Keycard enrolled: ${keyCardToEnroll}`);
            //Once merchant keycard is enrolled, connect and authenticate.
            await _relayClient.connect();
            await _relayClient.authenticate();
            await _relayClient!.sendMerchantSubscriptionRequest(id);
            setRelayClient(_relayClient);
            setIsMerchantView(true);
            keyCardToEnroll &&
              localStorage.setItem("merchantKeyCard", keyCardToEnroll);
            setIsConnected(Status.Complete);
            setStep("confirmation");
          } else {
            enrollKeycard.current = false;
            setIsConnected(Status.Failed);
            throw new Error("Failed to enroll keycard");
          }
          localStorage.removeItem("keyCardToEnroll");
        })();
      } catch (error) {
        setErrorMsg("Something went wrong");
        debug(error);
      }
    } else {
      setErrorMsg("Something went wrong");
    }
  };
  if (step === "confirmation") {
    return <Confirmation />;
  }
  return (
    <main className="pt-under-nav h-screen p-4 mt-5">
      <ErrorMessage
        errorMessage={errorMsg}
        onClose={() => {
          setErrorMsg(null);
        }}
      />
      <section className="mt-2 flex flex-col gap-4 bg-white p-6 rounded-lg">
        <h1>Connect to your shop</h1>
        <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
          <label className="font-medium" htmlFor="storeName">
            Shop ID
          </label>
          <div className="flex gap-2">
            <input
              className="border-2 border-solid mt-1 p-2 rounded-md bg-background-gray grow"
              data-testid="storeName"
              name="storeName"
              value={searchShopId}
              onChange={(e) => setSearchShopId(e.target.value)}
            />
            <button onClick={handleClearShopIdInput}>
              <Image
                src={`/icons/close-icon.svg`}
                width={15}
                height={15}
                alt="close-icon"
                unoptimized={true}
                className="w-4 h-4"
              />
            </button>
          </div>
        </form>

        {getButton()}
      </section>
    </main>
  );
};

export default MerchantConnectWallet;

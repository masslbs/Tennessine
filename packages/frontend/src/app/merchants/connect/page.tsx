// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";
import { Address } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import * as abi from "@massmarket/contracts";
import { assert, logger } from "@massmarket/utils";

import { ShopId, Status } from "@/types";
import { isValidHex } from "@/app/utils";
import { useClient } from "@/context/AuthContext";
import { useUserContext } from "@/context/UserContext";
import ErrorMessage from "@/app/common/components/ErrorMessage";
import Button from "@/app/common/components/Button";
import { ClientWithStateManager } from "@/app/ClientWithStateManager";
import Confirmation from "@/app/merchants/connect/Confirmation";

const namespace = "frontend:connect-merchant";
const debug = logger(namespace);
const errlog = logger(namespace, "error");

const MerchantConnectWallet = () => {
  const {
    shopPublicClient,
    clientWallet,
    setShopId,
    setClientStateManager,
    relayEndpoint,
  } = useUserContext();
  const { clientConnected, setIsConnected, setIsMerchantView } = useClient();
  const enrollKeycard = useRef(false);
  const { status } = useAccount();

  const [searchShopId, setSearchShopId] = useState<string>("");
  const [step, setStep] = useState<"search" | "connect" | "confirmation">(
    "search",
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [shopData, setShopData] = useState<
    {
      name: string;
      image: string;
    } | null
  >(null);

  useEffect(() => {
    //If user connects different wallet, set client connection back to pending.
    setIsConnected(Status.Pending);
    setErrorMsg(null);
  }, [clientWallet?.account.address]);

  function handleClearShopIdInput() {
    setSearchShopId("");
    setStep("search");
  }
  async function handleSearchForShop() {
    if (!isValidHex(searchShopId)) {
      setErrorMsg("Enter a valid shop ID");
      return;
    }
    try {
      const uri = (await shopPublicClient!.readContract({
        address: abi.addresses.ShopReg as Address,
        abi: abi.ShopReg,
        functionName: "tokenURI",
        args: [searchShopId],
      })) as string;
      if (uri) {
        const res = await fetch(uri);
        const data = await res.json();
        debug("Shop found");
        setShopData(data);
        setStep("connect");
        return;
      }
      setErrorMsg("Shop not found");
    } catch (error: unknown) {
      assert(error instanceof Error, "Error is not an instance of Error");
      errlog("Error finding shop", error);
      setErrorMsg("Error finding shop");
    }
  }

  async function enroll() {
    try {
      if (clientConnected !== Status.Pending) {
        throw new Error(`Client not pending. Status: ${clientConnected}`);
      }
      if (enrollKeycard.current) {
        throw new Error("Keycard already enrolled");
      }
      const id = searchShopId as ShopId;
      setShopId(id);
      localStorage.setItem("shopId", id);
      const clientStateManager = new ClientWithStateManager(
        shopPublicClient!,
        id,
        relayEndpoint!,
      );
      setClientStateManager(clientStateManager);
      const rc = clientStateManager.createNewRelayClient();
      const keyCardToEnroll = localStorage.getItem(
        "keyCardToEnroll",
      ) as `0x${string}`;
      const res = await rc.enrollKeycard(
        clientWallet!,
        false,
        id,
        new URL(window.location.href),
      );
      if (res.ok) {
        enrollKeycard.current = true;
        keyCardToEnroll && localStorage.setItem("merchantKC", keyCardToEnroll);
        debug(`Keycard enrolled: ${keyCardToEnroll}`);
        await clientStateManager.createStateManager();
        debug("StateManager created");

        await rc.connect();
        await rc.authenticate();
        await clientStateManager.sendMerchantSubscriptionRequest();
        debug("relayClient connected");
        setIsConnected(Status.Complete);
        setIsMerchantView(true);
        setStep("confirmation");
      } else {
        enrollKeycard.current = false;
        setIsConnected(Status.Failed);
        throw new Error("Failed to enroll keycard");
      }
      localStorage.removeItem("keyCardToEnroll");
    } catch (error: unknown) {
      assert(error instanceof Error, "Error is not an instance of Error");
      errlog("Error enrolling keycard", error);
      setErrorMsg(`Something went wrong. ${error}`);
    }
  }

  function getButton() {
    if (step === "search") {
      return <Button onClick={handleSearchForShop}>Search for shop</Button>;
    } else if (shopData) {
      return (
        <div className="flex flex-col gap-4">
          <div className="flex gap-3">
            <div className="overflow-hidden	rounded-full w-12 h-12">
              <img
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
  }
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
              <img
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

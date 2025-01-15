// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useNavigate } from "@tanstack/react-router";

import * as abi from "@massmarket/contracts";
import { assert, logger, random32BytesHex } from "@massmarket/utils";

import { ShopId } from "../../types.ts";
import ErrorMessage from "../common/ErrorMessage.tsx";
import Button from "../common/Button.tsx";
import { usePublicClient } from "../../hooks/usePublicClient.ts";
import { useClientWithStateManager } from "../../hooks/useClientWithStateManager.ts";
import { useKeycard } from "../../hooks/useKeycard.ts";

const namespace = "frontend:connect-merchant";
const debug = logger(namespace);
const errlog = logger(namespace, "error");

export default function MerchantConnect() {
  const { status } = useAccount();
  const { shopPublicClient } = usePublicClient();
  const { data: wallet } = useWalletClient();
  const [keycard, setKeycard] = useKeycard();
  const { clientStateManager } = useClientWithStateManager();
  const navigate = useNavigate({ from: "/merchant-connect" });

  const [searchShopId, setSearchShopId] = useState<string>("");
  const [step, setStep] = useState<"search" | "connect">(
    "search",
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [shopData, setShopData] = useState<
    {
      name: string;
      image: string;
    } | null
  >(null);

  function handleClearShopIdInput() {
    setSearchShopId("");
    setStep("search");
  }

  async function handleSearchForShop() {
    if (!BigInt(searchShopId)) {
      setErrorMsg("Enter a valid shop ID");
      return;
    }
    try {
      const uri = (await shopPublicClient!.readContract({
        address: abi.addresses.ShopReg,
        abi: abi.shopRegAbi,
        functionName: "tokenURI",
        args: [BigInt(searchShopId)],
      })) as string;
      if (uri) {
        const res = await fetch(uri);
        const data = await res.json();
        debug("Shop found");
        setShopData(data);
        navigate({
          search: { shopId: BigInt(searchShopId) },
        });
        setStep("connect");
      } else {
        setErrorMsg("Shop not found");
      }
    } catch (error: unknown) {
      assert(error instanceof Error, "Error is not an instance of Error");
      errlog("Error finding shop", error);
      setErrorMsg("Error finding shop");
    }
  }

  async function enroll() {
    try {
      //Reset keycard in case there is a keycard already cached.
      const kc = random32BytesHex();
      setKeycard({
        privateKey: kc,
        role: "merchant",
      });
      // Since we are enrolling the keycard in the same function as setKeycard without waiting for the updated clientStateManager,
      // we are setting the keycard in the clientStateManager manually.
      clientStateManager!.keycard = kc;
      const id = BigInt(searchShopId) as ShopId;
      const rc = clientStateManager!.createNewRelayClient();
      const res = await rc.enrollKeycard(
        wallet!,
        false,
        id,
        new URL(globalThis.location.href),
      );
      if (res.ok) {
        debug(`Keycard enrolled: ${keycard.privateKey}`);
        await clientStateManager!.createStateManager();
        debug("StateManager created");
        await rc.connect();
        await rc.authenticate();
        await clientStateManager!.sendMerchantSubscriptionRequest();
        debug("relayClient connected");
        navigate({
          to: "/connect-confirm",
          search: {
            shopId: id,
          },
        });
      } else {
        throw new Error("Failed to enroll keycard");
      }
    } catch (error: unknown) {
      assert(error instanceof Error, "Error is not an instance of Error");
      errlog("Error enrolling keycard", error);
      setErrorMsg(`Something went wrong. ${error}`);
    }
  }

  function getButton() {
    if (step === "search") {
      return <Button onClick={handleSearchForShop}>Search for shop</Button>;
    } else if (shopData && step === "connect") {
      return (
        <div className="flex flex-col gap-4">
          <div className="flex gap-3">
            <div className="overflow-hidden rounded-full w-12 h-12">
              <img
                src={shopData.image ||
                  "/icons/mass-labs-logo.svg"}
                width={50}
                height={50}
                alt="mass-labs-logo"
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
              type="number"
              onChange={(e) => setSearchShopId(e.target.value)}
            />
            <button
              onClick={handleClearShopIdInput}
              className="bg-transparent p-0"
            >
              <img
                src={`/icons/close-icon.svg`}
                width={15}
                height={15}
                alt="close-icon"
                className="w-4 h-4"
              />
            </button>
          </div>
        </form>
        {getButton()}
      </section>
    </main>
  );
}

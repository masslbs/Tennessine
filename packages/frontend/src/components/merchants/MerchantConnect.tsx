// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { useEffect, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useNavigate } from "@tanstack/react-router";

import * as abi from "@massmarket/contracts";
import { assert, logger, random32BytesHex } from "@massmarket/utils";

import ErrorMessage from "../common/ErrorMessage.tsx";
import Button from "../common/Button.tsx";
import { usePublicClient } from "../../hooks/usePublicClient.ts";
import { useClientWithStateManager } from "../../hooks/useClientWithStateManager.ts";
import { useKeycard } from "../../hooks/useKeycard.ts";
import { useShopId } from "../../hooks/useShopId.ts";

const namespace = "frontend:connect-merchant";
const debug = logger(namespace);
const errlog = logger(namespace, "error");

export default function MerchantConnect() {
  const { status } = useAccount();
  const { shopPublicClient } = usePublicClient();
  const { data: wallet } = useWalletClient();
  const [keycard, setKeycard] = useKeycard();
  // Set skipConnect to true so that useQuery does not try to connect and authenticate before enrolling the keycard.
  const { clientStateManager } = useClientWithStateManager(true);
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

  const { shopId } = useShopId();

  useEffect(() => {
    if (shopId) {
      setKeycard({
        privateKey: random32BytesHex(),
        role: "merchant",
      });
    }
  }, [shopId]);

  function handleClearShopIdInput() {
    setSearchShopId("");
    setStep("search");
  }

  async function handleSearchForShop() {
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
          search: { shopId: searchShopId },
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
      if (clientStateManager?.keycard !== keycard.privateKey) {
        errlog("Keycard mismatch");
        return;
      }
      const res = await clientStateManager?.relayClient.enrollKeycard(
        wallet!,
        false,
        shopId,
        new URL(globalThis.location.href),
      );
      if (res.ok) {
        debug(`Keycard enrolled: ${clientStateManager?.keycard}`);
        await clientStateManager!.connectAndAuthenticate();
        debug("RelayClient connected");
        await clientStateManager!.sendMerchantSubscriptionRequest();
        debug("Merchant subscription request sent");
        navigate({
          to: "/connect-confirm",
          search: {
            shopId: `0x${shopId!.toString(16)}`,
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
    <main
      className="pt-under-nav h-screen p-4 mt-5"
      data-testid="merchant-connect-page"
    >
      <ErrorMessage
        errorMessage={errorMsg}
        onClose={() => {
          setErrorMsg(null);
        }}
      />
      <section className="mt-2 flex flex-col gap-4 bg-white p-6 rounded-lg">
        <h1>Connect to your shop</h1>
        <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
          <label className="font-medium" htmlFor="searchShopId">
            Shop ID
          </label>
          <div className="flex gap-2">
            <input
              className="border-2 border-solid mt-1 p-2 rounded-md bg-background-gray grow"
              data-testid="searchShopId"
              name="searchShopId"
              value={searchShopId}
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

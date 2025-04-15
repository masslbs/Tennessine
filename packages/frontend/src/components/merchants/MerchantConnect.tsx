// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { useEffect, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useNavigate } from "@tanstack/react-router";
import { hexToBigInt, isHex, toHex } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

import { abi } from "@massmarket/contracts";
import { getWindowLocation, logger } from "@massmarket/utils";

import ConnectConfirmation from "./ConnectConfirmation.tsx";
import ErrorMessage from "../common/ErrorMessage.tsx";
import Button from "../common/Button.tsx";
import { useKeycard } from "../../hooks/useKeycard.ts";
import { useShopId } from "../../hooks/useShopId.ts";
import { useChain } from "../../hooks/useChain.ts";
import { KeycardRole, SearchShopStep } from "../../types.ts";
import { useRelayClient } from "../../hooks/useRelayClient.ts";
import { useStateManager } from "../../hooks/useStateManager.ts";

const namespace = "frontend:connect-merchant";
const debug = logger(namespace);
const warn = logger(namespace, "warn");
const errlog = logger(namespace, "error");

export default function MerchantConnect() {
  const { status } = useAccount();
  const { chain } = useChain();
  const shopPublicClient = usePublicClient({ chainId: chain.id });
  const { data: wallet } = useWalletClient();
  const { shopId } = useShopId();
  const [keycard, setKeycard] = useKeycard();
  const { relayClient } = useRelayClient();
  const { stateManager } = useStateManager();
  const navigate = useNavigate({ from: "/merchant-connect" });

  const [searchShopId, setSearchShopId] = useState<string>(
    shopId ? toHex(shopId, { size: 32 }) : "",
  );
  const [step, setStep] = useState<SearchShopStep>(
    SearchShopStep.Search,
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [shopData, setShopData] = useState<
    {
      name: string;
      image: string;
    } | null
  >(null);

  useEffect(() => {
    // If keycard is already enrolled as a customer, reset keycard
    if (shopId && keycard.role === KeycardRole.RETURNING_GUEST) {
      const privateKey = generatePrivateKey();
      const account = privateKeyToAccount(privateKey);
      setKeycard({
        privateKey,
        role: KeycardRole.NEW_GUEST,
        address: account.address,
      });
    }
  }, [keycard.role === KeycardRole.RETURNING_GUEST, shopId]);

  function handleClearShopIdInput() {
    setSearchShopId("");
    setStep(SearchShopStep.Search);
  }

  async function handleSearchForShop() {
    setErrorMsg(null);
    if (searchShopId.length > 66) {
      setErrorMsg("Invalid shop ID (input too long)");
      return;
    }
    if (!isHex(searchShopId)) {
      setErrorMsg("Invalid shop ID (input not hex)");
      return;
    }
    const shopID = hexToBigInt(searchShopId as `0x${string}`, { size: 32 });
    try {
      const uri = (await shopPublicClient!.readContract({
        address: abi.shopRegAddress,
        abi: abi.shopRegAbi,
        functionName: "tokenURI",
        args: [shopID],
      })) as string;
      if (uri) {
        const res = await fetch(uri);
        const data = await res.json();
        debug("Shop found");
        setShopData(data);
        navigate({
          search: { shopId: searchShopId },
        });
        setStep(SearchShopStep.Connect);
      } else {
        setErrorMsg("Shop not found");
      }
    } catch (error: unknown) {
      errlog("Error finding shop", error);
      setErrorMsg("Error finding shop");
    }
  }

  async function enroll() {
    try {
      if (!relayClient) {
        throw new Error("Relay client not found");
      }
      if (!stateManager) {
        warn("stateManager is undefined");
        return;
      }
      const res = await relayClient.enrollKeycard(
        wallet!,
        wallet!.account,
        false,
        getWindowLocation(),
      );
      if (!res.ok) {
        throw new Error("Failed to enroll keycard");
      }
      // Reassign keycard role as merchant after enroll.
      setKeycard({
        privateKey: keycard.privateKey,
        role: KeycardRole.MERCHANT,
        address: keycard.address,
      });
      debug(`Keycard enrolled: ${keycard.privateKey}`);
      stateManager!.addConnection(relayClient);
      setStep(SearchShopStep.Confirm);
    } catch (error: unknown) {
      errlog("Error enrolling keycard", error);
      setErrorMsg(`Something went wrong. ${error}`);
    }
  }

  function getButton() {
    if (step === SearchShopStep.Search) {
      return <Button onClick={handleSearchForShop}>Search for shop</Button>;
    } else if (shopData && step === SearchShopStep.Connect) {
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
            <p className="flex items-center" data-testid="shop-name">
              {shopData.name}
            </p>
          </div>
          <ConnectButton chainStatus="name" />
          <div>
            <Button disabled={status !== "connected"} onClick={enroll}>
              Connect to shop
            </Button>
          </div>
        </div>
      );
    }
  }
  function renderContent() {
    if (step === SearchShopStep.Confirm) {
      return <ConnectConfirmation />;
    } else {
      return (
        <section className="md:w-[560px]">
          <ErrorMessage
            errorMessage={errorMsg}
            onClose={() => {
              setErrorMsg(null);
            }}
          />
          <section className="mt-2 flex flex-col gap-4 bg-white p-6 rounded-lg">
            <h1>Connect to your shop</h1>
            <form
              className="flex flex-col"
              onSubmit={(e) => e.preventDefault()}
            >
              <label className="font-medium" htmlFor="searchShopId">
                Shop ID
              </label>
              <div className="flex gap-2">
                <input
                  className="border-2 border-solid mt-1 p-2 rounded-md bg-background-gray grow"
                  data-testid="search-shopId"
                  name="searchShopId"
                  value={searchShopId}
                  onChange={(e) => setSearchShopId(e.target.value)}
                />
                <button
                  onClick={handleClearShopIdInput}
                  style={{ backgroundColor: "transparent", padding: 0 }}
                  type="button"
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
            <div>
              {getButton()}
            </div>
          </section>
        </section>
      );
    }
  }
  return (
    <main
      className="pt-under-nav p-4 mt-5 md:flex justify-center"
      data-testid="merchant-connect-page"
    >
      {renderContent()}
    </main>
  );
}

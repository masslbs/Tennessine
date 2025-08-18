// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useNavigate } from "@tanstack/react-router";
import { hexToBigInt, isHex, toHex } from "viem";
import { getLogger } from "@logtape/logtape";

import { abi } from "@massmarket/contracts";
import {
  useKeycard,
  useShopId,
  useShopPublicClient,
} from "@massmarket/react-hooks";

import ConnectConfirmation from "./ConnectConfirmation.tsx";
import ErrorMessage from "../common/ErrorMessage.tsx";
import Button from "../common/Button.tsx";
import ChevronRight from "../common/ChevronRight.tsx";
import { SearchShopStep } from "../../types.ts";
import { getErrLogger, isValidUrl } from "../../utils/mod.ts";

const baseLogger = getLogger(["mass-market", "frontend", "merchant-connect"]);

const SHOP_NOT_FOUND_ERROR = "Shop not found";

export default function MerchantConnect() {
  const { status } = useAccount();
  const { shopPublicClient } = useShopPublicClient();
  const { shopId } = useShopId();
  const { keycard } = useKeycard();

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

  const logger = baseLogger.with({
    shopId,
    keycardAddress: keycard?.address,
  });
  const logError = getErrLogger(logger);

  useEffect(() => {
    //If shopId is in env, skip the search step and go to connect step.
    if (shopId && step === SearchShopStep.Search) {
      findShopData(shopId).then((found) => {
        if (!found) {
          setErrorMsg(SHOP_NOT_FOUND_ERROR);
        }
      });
    }
  }, [shopId]);

  useEffect(() => {
    if (keycard?.role === "merchant") {
      setStep(SearchShopStep.Confirm);
    }
  }, [keycard]);

  function handleClearShopIdInput() {
    setSearchShopId("");
    setStep(SearchShopStep.Search);
  }

  async function findShopData(id: `0x${string}` | bigint) {
    setErrorMsg(null);
    try {
      // shopId will be hex if user inputs hex, and bigint if shopId is in env or address bar.
      const shopID = isHex(id)
        ? hexToBigInt(id as `0x${string}`, { size: 32 })
        : id;
      const uri = (await shopPublicClient!.readContract({
        address: abi.shopRegAddress,
        abi: abi.shopRegAbi,
        functionName: "tokenURI",
        args: [shopID],
      })) as string;
      if (uri) {
        const res = await fetch(uri);
        const data = await res.json();
        logger.debug("Shop found");
        setShopData(data);
        setStep(SearchShopStep.Connect);
        return true;
      } else {
        return false;
      }
    } catch (error: unknown) {
      logError("Error finding shop", error);
      return false;
    }
  }

  function extractShopId(input: string) {
    if (isHex(input)) {
      return input;
    }
    // If user pastes shop URL in the search field instead of shop ID, extract the shop ID from the URL.
    if (isValidUrl(searchShopId)) {
      const searchParams = new URL(input).searchParams;
      if (searchParams.has("shopId")) {
        return searchParams.get("shopId");
      }
    }
  }

  async function handleSearchForShop() {
    setErrorMsg(null);
    const id = extractShopId(searchShopId);
    if (!id) {
      setErrorMsg("Invalid shop ID");
      return;
    }
    const found = await findShopData(id as `0x${string}`);
    if (!found) {
      setErrorMsg(SHOP_NOT_FOUND_ERROR);
    }
  }

  function connect() {
    try {
      navigate({
        search: { shopId: searchShopId },
      });
    } catch (error: unknown) {
      logError("Error connecting to shop", error);
    }
  }

  function getButton() {
    if (step === SearchShopStep.Search) {
      return (
        <Button
          onClick={handleSearchForShop}
          disabled={searchShopId.length === 0}
        >
          Search for shop
        </Button>
      );
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
            <Button disabled={status !== "connected"} onClick={connect}>
              <div className="flex items-center gap-2">
                <p>Connect to shop</p>
                <ChevronRight hex="#FFF" />
              </div>
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
          <section className="flex flex-col gap-4 bg-white p-6 rounded-lg">
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
                  className="mt-1 p-2 rounded-md grow"
                  style={{ backgroundColor: "#F3F3F3" }}
                  data-testid="search-shopId"
                  name="searchShopId"
                  value={searchShopId}
                  onChange={(e) => setSearchShopId(e.target.value)}
                  placeholder="0xf4fa..."
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
      className="p-5 md:flex justify-center"
      data-testid="merchant-connect-page"
    >
      {renderContent()}
    </main>
  );
}

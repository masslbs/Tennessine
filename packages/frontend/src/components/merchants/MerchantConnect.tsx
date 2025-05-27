// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { useEffect, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useNavigate } from "@tanstack/react-router";
import { hexToBigInt, isHex, toHex } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { getLogger } from "@logtape/logtape";

import { abi } from "@massmarket/contracts";
import { getWindowLocation } from "@massmarket/utils";
import { useShopId } from "@massmarket/react-hooks";

import ConnectConfirmation from "./ConnectConfirmation.tsx";
import ErrorMessage from "../common/ErrorMessage.tsx";
import Button from "../common/Button.tsx";
import { useKeycard } from "../../hooks/useKeycard.ts";
import { useChain } from "../../hooks/useChain.ts";
import { KeycardRole, SearchShopStep } from "../../types.ts";
import { useRelayClient } from "../../hooks/useRelayClient.ts";
import { useStateManager } from "../../hooks/useStateManager.ts";
import { isValidUrl } from "../../utils/mod.ts";

const logger = getLogger(["mass-market", "frontend", "connect-merchant"]);

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

  useEffect(() => {
    //If shopId is in env, skip the search step and go to connect step.
    if (shopId && step === SearchShopStep.Search) {
      findShopData(shopId).then();
    }
  }, [shopId]);

  function handleClearShopIdInput() {
    setSearchShopId("");
    setStep(SearchShopStep.Search);
  }

  async function findShopData(id: `0x${string}` | bigint) {
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
        setErrorMsg("Shop not found");
        return false;
      }
    } catch (error: unknown) {
      logger.error("Error finding shop", { error });
      setErrorMsg("Error finding shop");
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
    // If shop exists, set shop ID in search param.
    if (found) {
      navigate({
        search: { shopId: id },
      });
    }
  }

  async function enroll() {
    try {
      if (!relayClient) {
        throw new Error("Relay client not found");
      }
      if (!stateManager) {
        logger.warn("stateManager is undefined");
        return;
      }
      if (keycard.role === KeycardRole.MERCHANT) {
        logger.debug(
          "Keycard is already enrolled as a merchant. Redirecting to merchant dashboard.",
        );
        navigate({
          to: "/merchant-dashboard",
          search: (prev: Record<string, string>) => ({
            shopId: prev.shopId,
          }),
        });
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
      logger.debug`Keycard enrolled: ${keycard.privateKey}`;
      await relayClient.connect();
      await relayClient.authenticate();
      stateManager!.addConnection(relayClient);
      setStep(SearchShopStep.Confirm);
    } catch (error: unknown) {
      logger.error("Error enrolling keycard {error}", { error });
      setErrorMsg(`Error occurred while enrolling keycard`);
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
      className="p-4 mt-5 md:flex justify-center"
      data-testid="merchant-connect-page"
    >
      {renderContent()}
    </main>
  );
}

// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { useEffect, useState } from "react";
import { getLogger } from "@logtape/logtape";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  useAccount,
  useChainId,
  useConfig,
  useSwitchChain,
  useWalletClient,
} from "wagmi";
import { toBytes, toHex } from "viem";

import { Manifest } from "@massmarket/schema";
import { random256BigInt } from "@massmarket/utils";
import { useShopId, useShopPublicClient } from "@massmarket/react-hooks";

import MintShop from "./MintShop.tsx";
import ManifestForm from "./ManifestForm.tsx";
import Confirmation from "./CreateShopConfirmation.tsx";
import ErrorMessage from "../../common/ErrorMessage.tsx";
import Button from "../../common/Button.tsx";
import BackButton from "../../common/BackButton.tsx";
import ConnectWalletButton from "../../common/ConnectWalletButton.tsx";
import { CreateShopStep, ShopForm } from "../../../types.ts";
import { isValidAddress } from "../../../utils/mod.ts";

const logger = getLogger(["mass-market", "frontend", "CreateShop"]);

export default function () {
  const { data: wallet } = useWalletClient();
  const [shopManifest, setShopManifest] = useState<Manifest>(new Manifest());
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  // Form input fields that are not a part of the manifest.
  const [shopMetadata, setShopMetadata] = useState<ShopForm>(
    {
      shopName: "",
      description: "",
      avatar: null,
      paymentAddress: wallet?.account?.address || "",
    },
  );
  const [step, setStep] = useState<
    CreateShopStep
  >(CreateShopStep.ManifestForm);
  const { status } = useAccount();
  const { shopPublicClient } = useShopPublicClient();
  // Chain that user is connected to
  const chainId = useChainId();
  const { shopId } = useShopId();
  const config = useConfig();
  const { switchChain } = useSwitchChain({ config });
  const navigate = useNavigate({ from: "/create-shop" });
  const search = useSearch({ from: "/create-shop" });
  const shopChain = shopPublicClient?.chain;

  useEffect(() => {
    if (!search.shopId) {
      const newShopId = random256BigInt();
      navigate({ search: { shopId: toHex(newShopId) } });
    }
  }, []);

  useEffect(() => {
    if (wallet?.account) {
      setShopMetadata({
        ...shopMetadata,
        // For autofilling wallet address as payment address.
        paymentAddress: wallet.account.address,
      });
      if (chainId !== shopChain!.id) {
        logger.debug`Switching chainID from ${chainId} to ${shopChain?.id}`;
        switchChain({ chainId: shopChain!.id });
      }
    }
  }, [wallet]);

  function checkRequiredFields() {
    let warning: string | null = null;
    if (!shopMetadata.shopName.length) {
      warning = "Shop name is required.";
    } else if (!shopMetadata.description.length) {
      warning = "Store description is required.";
    } else if (!shopMetadata.paymentAddress) {
      warning = "Payee address is required.";
    } else if (
      !shopManifest.PricingCurrency.Address ||
      !shopManifest.PricingCurrency.ChainID
    ) {
      warning = "Pricing currency is required.";
    } else if (!shopManifest.AcceptedCurrencies.data.size) {
      warning = "Accepted currencies are required.";
    }
    const isTokenAddrHex = isValidAddress(shopManifest.PricingCurrency.Address);
    const isPayeeAddHex = isValidAddress(toBytes(shopMetadata.paymentAddress));
    if (!isTokenAddrHex) {
      warning = "Token address must be a valid address.";
    } else if (!isPayeeAddHex) {
      return "Payee address must be a valid address.";
    }

    if (warning) {
      setValidationError(warning);
      setStep(CreateShopStep.ManifestForm);

      throw Error(`Check all required fields: ${warning}`);
    } else {
      setValidationError(null);
    }

    setStep(CreateShopStep.CreatingShop);
  }

  function renderContent() {
    if (step === CreateShopStep.ManifestForm) {
      return (
        <ManifestForm
          shopManifest={shopManifest}
          setShopManifest={setShopManifest}
          setStep={setStep}
          shopMetadata={shopMetadata}
          setShopMetadata={setShopMetadata}
          validationError={validationError}
          setValidationError={setValidationError}
        />
      );
    } else if (step === CreateShopStep.ConnectWallet) {
      return (
        <section
          className="w-full md:w-[560px] px-5"
          data-testid="connect-wallet-screen"
        >
          <BackButton onClick={() => setStep(CreateShopStep.ManifestForm)} />
          <ErrorMessage
            errorMessage={errorMsg}
            onClose={() => {
              setErrorMsg(null);
            }}
          />
          <h1 className="mt-2">Connect your wallet</h1>
          <section className="mt-2 flex flex-col gap-4 bg-white p-6 rounded-lg">
            {status === "connected"
              ? (
                <div className="flex flex-col gap-4">
                  <ConnectButton chainStatus="name" />
                  <Button
                    onClick={checkRequiredFields}
                    disabled={!wallet || !shopId}
                  >
                    <h6>Mint Shop</h6>
                  </Button>
                </div>
              )
              : <ConnectWalletButton />}
          </section>
        </section>
      );
    } else if (step === CreateShopStep.CreatingShop) {
      return (
        <MintShop
          setStep={setStep}
          shopManifest={shopManifest}
          shopMetadata={shopMetadata}
        />
      );
    } else if (step === CreateShopStep.Confirmation) {
      return <Confirmation />;
    }
  }

  return (
    <main
      className="flex justify-center"
      data-testid="create-shop-screen"
    >
      {renderContent()}
    </main>
  );
}

// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { useState } from "react";
import { getLogger } from "@logtape/logtape";
import { ConnectButton, useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { useAccount, useConfig, usePublicClient, useWalletClient } from "wagmi";
import { simulateContract } from "@wagmi/core";
import { toBytes } from "viem";

import {
  addRelay,
  checkPermissions,
  mintShop,
  setTokenURI,
} from "@massmarket/contracts";
import {
  Manifest,
  ShippingRegion,
  ShippingRegionsMap,
} from "@massmarket/schema";
import { getWindowLocation } from "@massmarket/utils";
import { abi, permissions } from "@massmarket/contracts";

import ManifestForm from "./ManifestForm.tsx";
import Confirmation from "./CreateShopConfirmation.tsx";
import ErrorMessage from "../../common/ErrorMessage.tsx";
import Button from "../../common/Button.tsx";
import LoadingSpinner from "../../common/LoadingSpinner.tsx";
import BackButton from "../../common/BackButton.tsx";
import ConnectWalletButton from "../../common/ConnectWalletButton.tsx";
import { useShopId } from "../../../hooks/useShopId.ts";
import { useShopDetails } from "../../../hooks/useShopDetails.ts";
import { useChain } from "../../../hooks/useChain.ts";
import { CreateShopStep, ShopForm } from "../../../types.ts";
import { isValidAddress } from "../../../utils/mod.ts";
import { useRelayClient } from "../../../hooks/useRelayClient.ts";
import { useStateManager } from "../../../hooks/useStateManager.ts";

// When create shop CTA is clicked, these functions are called:
// 1. mintShop
// 2. enrollAndAddConnection
// 3. updateManifest
// 4. uploadMetadata

const logger = getLogger(["mass-market", "frontend", "CreateShop"]);

const { shopRegAbi, shopRegAddress } = abi;

const retryCount = 10;

export default function () {
  const addRecentTransaction = useAddRecentTransaction();
  const { status } = useAccount();
  //Env chain
  const { chain } = useChain();
  // Chain that user is connected to
  const shopPublicClient = usePublicClient({ chainId: chain.id });
  const { data: wallet } = useWalletClient();
  const { shopId } = useShopId();
  const { setShopDetails } = useShopDetails();
  const { relayClient } = useRelayClient();
  const { stateManager } = useStateManager();
  const { connector } = useAccount();
  const config = useConfig();

  const [shopManifest, setShopManifest] = useState<Manifest>(new Manifest());
  const [storeRegistrationStatus, setStoreRegistrationStatus] = useState<
    string
  >("");
  const [mintedHash, setMintedHash] = useState<string | null>(null);
  const [creatingShop, setCreatingShop] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
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

  function checkRequiredFields() {
    if (!shopMetadata.shopName.length) {
      return "Shop name is required.";
    } else if (!shopMetadata.description.length) {
      return "Store description is required.";
    } else if (!shopMetadata.paymentAddress) {
      return "Payee address is required.";
    } else if (
      !shopManifest.PricingCurrency.Address ||
      !shopManifest.PricingCurrency.ChainID
    ) {
      return "Pricing currency is required.";
    } else if (!shopManifest.AcceptedCurrencies.data.size) {
      return "Accepted currencies are required.";
    }
    const isTokenAddrHex = isValidAddress(shopManifest.PricingCurrency.Address);
    const isPayeeAddHex = isValidAddress(toBytes(shopMetadata.paymentAddress));
    if (!isTokenAddrHex) {
      return "Token address must be a valid address.";
    } else if (!isPayeeAddHex) {
      return "Payee address must be a valid address.";
    }
    return null;
  }

  async function mint() {
    if (!shopPublicClient) {
      logger.warn("shopPublicClient not found");
      return;
    }
    if (!relayClient) {
      logger.warn("relayClient not found");
      return;
    }
    if (!stateManager) {
      logger.warn("stateManager not found");
      return;
    }
    const warning = checkRequiredFields();
    if (warning) {
      setValidationError(warning);
      setStep(CreateShopStep.ManifestForm);

      throw Error(`Check all required fields: ${warning}`);
    } else {
      setValidationError(null);
    }
    logger.debug`creating shop for ${shopId}`;
    setStoreRegistrationStatus("Minting shop...");
    setCreatingShop(true);
    try {
      // This will throw error if simulate fails.
      await simulateContract(config, {
        abi: shopRegAbi,
        address: shopRegAddress,
        functionName: "mint",
        args: [shopId!, wallet!.account.address],
        connector,
      });
      logger.debug`simulateContract success`;
      const hash = await mintShop(wallet!, wallet!.account.address, [
        shopId!,
        wallet!.account.address,
      ]);
      logger.debug`Mint hash: ${hash}`;

      addRecentTransaction({
        hash,
        description: "Mint Shop",
        // confirmations: 2,
      });
      setMintedHash(hash);
      setStoreRegistrationStatus("Waiting to confirm mint transaction...");
      let receipt = await shopPublicClient!.waitForTransactionReceipt({
        hash,
        // confirmations: 2,
        retryCount,
      });
      if (receipt!.status !== "success") {
        throw new Error("Mint shop: transaction failed");
      }

      setStoreRegistrationStatus("Adding relay token ID...");
      // Add relay tokenId for event verification.
      const tokenID = BigInt(
        relayClient.relayEndpoint.tokenId,
      );
      const tx = await addRelay(wallet!, wallet!.account.address, [
        shopId!,
        tokenID,
      ]);
      logger.debug`Added relay token ID:${tokenID}`;
      receipt = await shopPublicClient!.waitForTransactionReceipt({
        hash: tx,
        // confirmations: 2,
        retryCount,
      });
      if (receipt.status !== "success") {
        throw new Error("Error: addRelay");
      }
    } catch (error: unknown) {
      logger.error("Error minting store", { error });
      setErrorMsg(`Error minting store`);
      return;
    }

    await enrollAndAddConnection();
  }

  async function enrollAndAddConnection() {
    if (!shopPublicClient) {
      logger.warn("shopPublicClient not found");
      return;
    }
    if (!relayClient) {
      logger.warn("relayClient not found");
      return;
    }
    if (!stateManager) {
      logger.warn("stateManager not found");
      return;
    }
    setStoreRegistrationStatus("Checking permissions...");
    try {
      const hasAccess = await checkPermissions(shopPublicClient!, [
        shopId!,
        wallet!.account.address,
        permissions.updateRootHash,
      ]);
      if (!hasAccess) {
        throw new Error("Access denied.");
      }
      setStoreRegistrationStatus("Enrolling keycard...");
      const res = await relayClient.enrollKeycard(
        wallet!,
        wallet!.account,
        false,
        getWindowLocation(),
      );
      if (!res.ok) {
        throw Error("Failed to enroll keycard");
      }
      setStoreRegistrationStatus("Adding connection...");

      stateManager.addConnection(relayClient);
      logger.debug("Relay client connected");
    } catch (error: unknown) {
      logger.error("enrollAndAddConnection failed", { error });
      setErrorMsg("Error connecting to client");
      return;
    }
    await updateManifest();
  }

  async function updateManifest() {
    if (!shopPublicClient) {
      logger.warn("shopPublicClient not found");
      return;
    }
    if (!relayClient) {
      logger.warn("relayClient not found");
      return;
    }
    if (!stateManager) {
      logger.warn("stateManager not found");
      return;
    }
    if (!shopId) {
      throw new Error("shopId not found");
    }
    try {
      setStoreRegistrationStatus("Updating manifest...");
      // Since we don't currently have UI for inputting payment address for each chain,
      // Get all unique chain IDs for selected accepted currencies and add payee for each chain.
      const uniqueByChainId = Array.from(
        shopManifest.AcceptedCurrencies.data.keys(),
      );
      uniqueByChainId.forEach((chainId) => {
        shopManifest.Payees.addAddress(
          chainId,
          toBytes(shopMetadata.paymentAddress),
          false,
        );
      });
      shopManifest.ShopID = shopId;
      if (
        !shopManifest.ShippingRegions ||
        shopManifest.ShippingRegions.size === 0
      ) {
        shopManifest.ShippingRegions = new ShippingRegionsMap(
          new Map([
            [
              "default",
              new ShippingRegion(""),
            ],
          ]),
        );
      }

      await stateManager.set(
        ["Manifest"],
        shopManifest,
      );
      logger.debug("Manifest created");
    } catch (error: unknown) {
      logger.error("Error creating shop manifest", { error });
      setErrorMsg("Error creating shop manifest");
      return;
    }

    await uploadMetadata();
  }

  async function uploadMetadata() {
    setStoreRegistrationStatus("Setting shop metadata...");
    try {
      const imgPath = shopMetadata.avatar
        ? await relayClient!.uploadBlob(
          shopMetadata.avatar as FormData,
        )
        : { url: null };
      const metadata = {
        name: shopMetadata.shopName,
        description: shopMetadata.description,
        image: imgPath.url,
      };
      const jsn = JSON.stringify(metadata);
      const blob = new Blob([jsn], { type: "application/json" });
      const file = new File([blob], "file.json");
      const formData = new FormData();
      formData.append("file", file);
      const metadataPath = await relayClient!.uploadBlob(
        formData,
      );

      //Write shop metadata to blockchain client.
      const metadataHash = await setTokenURI(wallet!, wallet!.account, [
        shopId!,
        metadataPath.url,
      ]);

      const transaction = await shopPublicClient!.waitForTransactionReceipt({
        hash: metadataHash,
        retryCount,
      });

      if (transaction.status !== "success") {
        throw new Error("Error: setShopMetadataURI");
      }

      setShopDetails({
        name: shopMetadata.shopName,
        profilePictureUrl: imgPath.url,
      });

      logger.debug("Shop created");
      setCreatingShop(false);
      setStep(CreateShopStep.Confirmation);
    } catch (error: unknown) {
      logger.error("Error uploading metadata", { error });
      setErrorMsg("Error uploading metadata");
    }
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
          className="md:w-[560px] h-[77vh]"
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
                  <p>{storeRegistrationStatus}</p>
                  {mintedHash && (
                    <a
                      href={`${
                        shopPublicClient!.chain.blockExplorers?.default?.url
                      }/tx/${mintedHash}`}
                    >
                      View TX
                    </a>
                  )}
                  {creatingShop ? <LoadingSpinner /> : (
                    <div>
                      <Button onClick={mint} disabled={!wallet || !shopId}>
                        <h6>Mint Shop</h6>
                      </Button>
                    </div>
                  )}
                </div>
              )
              : <ConnectWalletButton />}
          </section>
        </section>
      );
    } else if (step === CreateShopStep.Confirmation) {
      return <Confirmation />;
    }
  }

  return (
    <main
      className="p-4 flex justify-center"
      data-testid="create-shop-screen"
    >
      {renderContent()}
    </main>
  );
}

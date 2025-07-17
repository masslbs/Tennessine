import { useEffect, useRef, useState } from "react";
import { getLogger } from "@logtape/logtape";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { useAccount, useConfig, useWalletClient } from "wagmi";
import { simulateContract } from "@wagmi/core";
import { toBytes } from "viem";

import { abi, addRelay, mintShop, setTokenURI } from "@massmarket/contracts";
import {
  Manifest,
  ShippingRegion,
  ShippingRegionsMap,
} from "@massmarket/schema";
import {
  useKeycard,
  useRelayClient,
  useRelayEndpoint,
  useShopId,
  useShopPublicClient,
  useStateManager,
} from "@massmarket/react-hooks";

import ErrorMessage from "../../common/ErrorMessage.tsx";
import LoadingSpinner from "../../common/LoadingSpinner.tsx";
import { CreateShopStep, ShopForm } from "../../../types.ts";
import { getErrLogger } from "../../../utils/mod.ts";

const { shopRegAbi, shopRegAddress } = abi;
const logger = getLogger(["mass-market", "frontend", "MintShop"]);
const retryCount = 10;

/**
 * 1. mint() => if successful, setShopMinted is set to true.
 * 2. shopMinted = true will trigger useKeycard hook to enroll merchant keycard.
 * 3. the second useEffect will wait for merchant keycard to be enrolled, and for stateManager to update with merchant keycard before calling updateManifest().
 * 4. if updateManifest is successful, uploadMetadata() is called.
 */

export default function (
  { setStep, shopManifest, shopMetadata }: {
    setStep: (step: CreateShopStep) => void;
    shopManifest: Manifest;
    shopMetadata: ShopForm;
  },
) {
  const mintInProgress = useRef<boolean>(false);
  const [storeRegistrationStatus, setStoreRegistrationStatus] = useState<
    string
  >("");
  const [mintedHash, setMintedHash] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [shopMinted, setShopMinted] = useState<boolean>(false);

  const { connector } = useAccount();
  const { shopPublicClient } = useShopPublicClient();
  const { shopId } = useShopId();
  const config = useConfig();
  const { data: wallet } = useWalletClient();
  // We can only enroll merchant keycard after shop is minted so we are checking if shopMinted = true.
  const { keycard } = useKeycard({
    role: shopMinted ? "merchant" : "guest",
  });
  const { relayClient } = useRelayClient();
  const { stateManager } = useStateManager();
  const { relayEndpoint } = useRelayEndpoint();

  const addRecentTransaction = useAddRecentTransaction();
  const logError = getErrLogger(logger, setErrorMsg);

  useEffect(() => {
    // Start mint when we land on this screen.
    if (mintInProgress.current || !relayEndpoint) return;
    mint();
  }, [relayEndpoint]);

  useEffect(() => {
    // We have to wait for merchant keycard to be enrolled, and also for stateManager to be instantiated.
    if (
      keycard?.role === "merchant" &&
      stateManager && relayClient
    ) {
      updateManifest();
    }
  }, [keycard, stateManager, relayClient]);

  async function mint() {
    if (!relayEndpoint) {
      logger.warn("relayClient not found");
      return;
    }
    logger.debug`creating shop for ${shopId}`;
    setStoreRegistrationStatus("Minting shop...");
    mintInProgress.current = true;
    try {
      // This will throw error if simulate fails.
      await simulateContract(config, {
        abi: shopRegAbi,
        address: shopRegAddress,
        functionName: "mint",
        args: [shopId!, wallet!.account.address],
        connector,
      });
      logger.debug("simulateContract success");
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
        relayEndpoint.tokenId,
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
      setStoreRegistrationStatus("Relay token ID added");

      // Set shopMinted as true, so useKeycard hook can enroll merchant keycard.
      setShopMinted(true);
    } catch (err: unknown) {
      logError("Error minting store", err);
      return;
    }
  }
  async function updateManifest() {
    try {
      setStoreRegistrationStatus("Updating manifest...");
      // Since we don't currently have UI for inputting payment address for each chain,
      // Get all unique chain IDs for selected accepted currencies and add payee for each chain.
      // FIXME: separate this out into a util function.
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
      shopManifest.ShopID = shopId!;
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

      await stateManager!.set(
        ["Manifest"],
        shopManifest,
      );

      logger.debug("Manifest created");
    } catch (error: unknown) {
      logError("Error creating shop manifest", error);
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

      logger.debug("Shop created");
      setStep(CreateShopStep.Confirmation);
    } catch (error: unknown) {
      logError("Error uploading metadata", error);
    }
  }

  return (
    <section
      className="w-full md:w-[560px] px-5"
      data-testid="minting-shop"
    >
      <ErrorMessage
        errorMessage={errorMsg}
        onClose={() => {
          setErrorMsg(null);
        }}
      />
      <p data-testid="shop-registration-status">
        {storeRegistrationStatus}
      </p>
      <p>
        {mintedHash && (
          <a
            href={`${
              shopPublicClient!.chain.blockExplorers?.default?.url
            }/tx/${mintedHash}`}
          >
            View TX
          </a>
        )}
      </p>
      <section className="mt-2 flex flex-col gap-4 bg-white p-6 rounded-lg">
        <LoadingSpinner />
      </section>
    </section>
  );
}

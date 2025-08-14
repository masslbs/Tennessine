import { useEffect, useRef, useState } from "react";
import { getLogger } from "@logtape/logtape";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { useAccount, useConfig, useWalletClient } from "wagmi";
import { simulateContract } from "@wagmi/core";
import { toHex } from "viem";
import { useNavigate } from "@tanstack/react-router";

import { abi, addRelay, mintShop } from "@massmarket/contracts";

import {
  useKeycard,
  useRelayEndpoint,
  useShopPublicClient,
} from "@massmarket/react-hooks";
import { random256BigInt } from "@massmarket/utils";

import ErrorMessage from "../../common/ErrorMessage.tsx";
import { CreateShopStep, ShopForm } from "../../../types.ts";
import { getErrLogger } from "../../../utils/mod.ts";
import ProgressScreen from "../../common/ProgressScreen.tsx";

const { shopRegAbi, shopRegAddress } = abi;
const logger = getLogger(["mass-market", "frontend", "MintShop"]);
const retryCount = 10;

const steps = {
  MINT: "Minting your shop",
  ADD_RELAY: "Adding relay token ID",
  ENROLL_KEYCARD: "Enrolling keycard",
};
export default function (
  { setStep, shopMetadata }: {
    setStep: (step: CreateShopStep) => void;
    shopMetadata: ShopForm;
  },
) {
  // This useRef is to track if mint() is in progress to prevent mint() from being called multiple times during initial rerenders when the component mounts.
  const mintInProgress = useRef<boolean>(false);
  const [storeRegistrationStatus, setStoreRegistrationStatus] = useState<
    string
  >("");
  // const [mintedHash, setMintedHash] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { connector } = useAccount();
  const { shopPublicClient } = useShopPublicClient();
  const config = useConfig();
  const { data: wallet } = useWalletClient();
  const { keycard } = useKeycard();

  const { relayEndpoint } = useRelayEndpoint();
  const navigate = useNavigate({ from: "/create-shop" });

  const addRecentTransaction = useAddRecentTransaction();
  const logError = getErrLogger(logger, setErrorMsg);
  const newShopId = random256BigInt();

  useEffect(() => {
    // mint() is called when we land on this screen.
    // wait for relayEndpoint to be loaded.
    if (mintInProgress.current || !relayEndpoint) return;
    mint();
  }, [relayEndpoint]);

  useEffect(() => {
    if (
      keycard?.role === "merchant"
    ) {
      setStep(CreateShopStep.UpdateManifest);
    }
  }, [keycard]);

  async function mint() {
    if (!relayEndpoint) {
      logger.warn("relayClient not found");
      return;
    }
    logger.debug`creating shop for ${newShopId}`;
    setStoreRegistrationStatus(steps.MINT);
    mintInProgress.current = true;
    try {
      // This will throw error if simulate fails.
      await simulateContract(config, {
        abi: shopRegAbi,
        address: shopRegAddress,
        functionName: "mint",
        args: [newShopId!, wallet!.account.address],
        connector,
      });
      logger.debug("simulateContract success");
      const hash = await mintShop(wallet!, wallet!.account.address, [
        newShopId!,
        wallet!.account.address,
      ]);
      logger.debug`Mint hash: ${hash}`;

      addRecentTransaction({
        hash,
        description: "Mint Shop",
        // confirmations: 2,
      });
      // setMintedHash(hash);
      setStoreRegistrationStatus("Waiting to confirm mint transaction...");
      let receipt = await shopPublicClient!.waitForTransactionReceipt({
        hash,
        // confirmations: 2,
        retryCount,
      });
      if (receipt!.status !== "success") {
        throw new Error("Mint shop: transaction failed");
      }

      setStoreRegistrationStatus(steps.ADD_RELAY);
      // Add relay tokenId for event verification.
      const tokenID = BigInt(
        relayEndpoint.tokenId,
      );
      const tx = await addRelay(wallet!, wallet!.account.address, [
        newShopId!,
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
      // Adding the newShopId in search params will trigger useKeycard to enroll for merchant.
      setStoreRegistrationStatus(steps.ENROLL_KEYCARD);
      navigate({ search: { shopId: toHex(newShopId) } });
    } catch (err: unknown) {
      logError("Error minting store", err);
      return;
    }
  }

  let step = 1;
  if (storeRegistrationStatus === steps.MINT) {
    step = 1;
  } else if (storeRegistrationStatus === steps.ADD_RELAY) {
    step = 2;
  } else if (storeRegistrationStatus === steps.ENROLL_KEYCARD) {
    step = 3;
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
      <ProgressScreen
        step={step}
        text={storeRegistrationStatus}
        avatar={shopMetadata.avatar}
      />
    </section>
  );
}

import { useEffect, useRef, useState } from "react";
import { getLogger } from "@logtape/logtape";
import { toBytes } from "viem";

import { useShopId, useStateManager } from "@massmarket/react-hooks";
import {
  Manifest,
  ShippingRegion,
  ShippingRegionsMap,
} from "@massmarket/schema";

import LoadingSpinner from "../../common/LoadingSpinner.tsx";
import ErrorMessage from "../../common/ErrorMessage.tsx";
import { CreateShopStep, ShopForm } from "../../../types.ts";
import { getErrLogger } from "../../../utils/mod.ts";

const logger = getLogger(["mass-market", "frontend", "createManifest"]);

export default function (
  { setStep, shopManifest, shopMetadata }: {
    setStep: (step: CreateShopStep) => void;
    shopManifest: Manifest;
    shopMetadata: ShopForm;
  },
) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [storeRegistrationStatus, setStoreRegistrationStatus] = useState<
    string
  >("");
  const { stateManager } = useStateManager();
  const { shopId } = useShopId();
  // This useRef is to track if createManifest() is in progress to prevent createManifest() from being called multiple times during initial rerenders when the component mounts.
  const createManifestInProgress = useRef<boolean>(false);
  const logError = getErrLogger(logger, setErrorMsg);

  useEffect(() => {
    if (!stateManager || createManifestInProgress.current) return;
    createManifest();
  }, [stateManager]);

  async function createManifest() {
    setStoreRegistrationStatus("Creating manifest...");
    createManifestInProgress.current = true;

    try {
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
      setStep(CreateShopStep.UploadMetadata);
      logger.debug("Manifest created");
    } catch (error: unknown) {
      logError("Error creating shop manifest", error);
      return;
    }
  }

  return (
    <section
      className="w-full md:w-[560px] px-5"
      data-testid="updating-manifest"
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

      <section className="mt-2 flex flex-col gap-4 bg-white p-6 rounded-lg">
        <LoadingSpinner />
      </section>
    </section>
  );
}

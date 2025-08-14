import { useEffect, useRef, useState } from "react";
import { useWalletClient } from "wagmi";
import { getLogger } from "@logtape/logtape";

import {
  useRelayClient,
  useShopId,
  useShopPublicClient,
} from "@massmarket/react-hooks";
import { setTokenURI } from "@massmarket/contracts";

import ErrorMessage from "../../common/ErrorMessage.tsx";
import { CreateShopStep, ShopForm } from "../../../types.ts";
import { getErrLogger } from "../../../utils/mod.ts";
import ProgressScreen from "../../common/ProgressScreen.tsx";

const logger = getLogger(["mass-market", "frontend", "UploadMetadata"]);

export default function UploadMetadata(
  { setStep, shopMetadata }: {
    setStep: (step: CreateShopStep) => void;
    shopMetadata: ShopForm;
  },
) {
  const uploadingMetadata = useRef(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [storeRegistrationStatus, setStoreRegistrationStatus] = useState<
    string
  >("");
  const { data: wallet } = useWalletClient();

  const { relayClient } = useRelayClient();
  const { shopPublicClient } = useShopPublicClient();
  const { shopId } = useShopId();
  const logError = getErrLogger(logger, setErrorMsg);

  useEffect(() => {
    if (!relayClient || uploadingMetadata.current) return;
    uploadMetadata();
  }, [relayClient]);

  async function uploadMetadata() {
    setStoreRegistrationStatus("Setting shop metadata...");
    uploadingMetadata.current = true;
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
        retryCount: 10,
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
      data-testid="updating-manifest"
    >
      <ErrorMessage
        errorMessage={errorMsg}
        onClose={() => {
          setErrorMsg(null);
        }}
      />
      <ProgressScreen
        step={4}
        text={storeRegistrationStatus}
        avatar={shopMetadata.avatar}
      />
    </section>
  );
}

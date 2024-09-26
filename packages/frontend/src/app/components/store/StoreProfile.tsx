// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useEffect, useState } from "react";
import ModalHeader from "@/app/common/components/ModalHeader";
import Button from "@/app/common/components/Button";
import { useStoreContext } from "@/context/StoreContext";
import { useMyContext } from "@/context/MyContext";
import Image from "next/image";
import AvatarUpload from "@/app/common/components/AvatarUpload";
import SecondaryButton from "@/app/common/components/SecondaryButton";
import { ShopManifest, ShopCurrencies, TokenAddr } from "@/types";
import { sepolia, hardhat } from "viem/chains";
import ErrorMessage from "@/app/common/components/ErrorMessage";
import debugLib from "debug";
import ValidationWarning from "@/app/common/components/ValidationWarning";
import { isValidHex } from "@/app/utils";
import { UpdateShopManifest } from "@massmarket/stateManager/types";
import { BlockchainClient } from "@massmarket/blockchain";

const StoreProfile = ({ close }: { close: () => void }) => {
  const { stateManager, shopDetails } = useStoreContext();
  const { relayClient, clientWallet, shopId } = useMyContext();
  const [storeName, setStoreName] = useState<string>("");
  const [baseAddr, setStoreBase] = useState<TokenAddr | null>(null);
  const [avatar, setAvatar] = useState<FormData | null>(null);
  const [addTokenAddr, setAddTokenAddr] = useState<TokenAddr | "">("");
  const [acceptedCurrencies, setAcceptedCurrencies] = useState<
    ShopCurrencies[]
  >([]);
  const [error, setError] = useState<null | string>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const chainName = process.env.NEXT_PUBLIC_CHAIN_NAME!;
  const [addAcceptedChainId, setAddChainId] = useState<number>(
    chainName === "sepolia" ? sepolia.id : hardhat.id,
  );
  const [baseChainId, setBaseChainId] = useState<number>(
    chainName === "sepolia" ? sepolia.id : hardhat.id,
  );
  const debug = debugLib("frontend:storeProfile");

  useEffect(() => {
    const onUpdateEvent = async (updatedManifest: ShopManifest) => {
      const { pricingCurrency, acceptedCurrencies } = updatedManifest;
      setAcceptedCurrencies(acceptedCurrencies);
      setStoreBase(pricingCurrency.address);
    };

    stateManager.manifest
      .get()
      .then((shopManifest) => {
        const { pricingCurrency, acceptedCurrencies } = shopManifest;
        setAcceptedCurrencies(acceptedCurrencies);
        setStoreBase(pricingCurrency.address);
      })
      .catch((e) => {
        debug(e);
      });

    stateManager.manifest.on("update", onUpdateEvent);

    return () => {
      // Cleanup listeners on unmount
      stateManager.manifest.on("update", onUpdateEvent);
    };
  }, []);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shopId!);
  };
  const updateStoreInfo = async () => {
    if (!baseAddr) {
      setValidationError("Missing base currency address for store.");
    } else if (!baseChainId) {
      setValidationError("Missing base currency chainId for store.");
    } else if (!isValidHex(baseAddr)) {
      setValidationError("Base token address must be a valid hex value");
    } else {
      try {
        const manifest: Partial<UpdateShopManifest> = {
          setPricingCurrency: {
            address: baseAddr as TokenAddr,
            chainId: baseChainId,
          },
        };
        await stateManager!.manifest.update(manifest);

        //If avatar or store name changed, setShopMetadataURI.
        if (avatar || storeName !== shopDetails.name) {
          const metadata = {
            name: storeName,
            //If new avatar was uploaded, upload the image, otherwise use previous image.
            image: avatar
              ? (await relayClient!.uploadBlob(avatar as FormData)).url
              : shopDetails.profilePictureUrl,
          };
          const jsn = JSON.stringify(metadata);
          const blob = new Blob([jsn], { type: "application/json" });
          const file = new File([blob], "file.json");
          const formData = new FormData();
          formData.append("file", file);
          relayClient!.uploadBlob(formData).then(({ url }) => {
            const blockchainClient = new BlockchainClient(shopId!);
            blockchainClient
              .setShopMetadataURI(clientWallet!, url)
              .then()
              .catch((e) => debug(e));
          });
        }
        close();
      } catch (error) {
        debug(error);
      }
    }
  };
  const renderAcceptedCurrencies = () => {
    return acceptedCurrencies.map((c, i) => (
      <p data-testid="accepted-currencies" key={i}>
        {c.address}
      </p>
    ));
  };
  const addAcceptedCurrencyFn = async () => {
    if (!addTokenAddr.length) {
      setValidationError("Must enter a token address to add");
    } else if (!addAcceptedChainId) {
      setValidationError("Must enter a token chainId to add");
    } else {
      try {
        await stateManager!.manifest.update({
          addAcceptedCurrencies: [
            {
              address: addTokenAddr as TokenAddr,
              chainId: addAcceptedChainId,
            },
          ],
        });
      } catch (error) {
        debug(error);
        setAddTokenAddr("");
        setError("Failed to add accepted currency");
      }
    }
  };

  return (
    <section className="pt-under-nav h-screen">
      <ModalHeader headerText="Store Profile" goBack={close} />
      <section className="flex flex-col h-5/6">
        <ErrorMessage
          errorMessage={error}
          onClose={() => {
            setError(null);
          }}
        />
        <ValidationWarning
          warningMessage={validationError}
          onClose={() => {
            setValidationError(null);
          }}
        />
        <AvatarUpload setImgBlob={setAvatar} />
        <div className="m-4">
          <p className="font-sans">General</p>
          <section className="text-sm flex flex-col gap-4">
            <div>
              <section className="mt-4">
                <form
                  className="flex flex-col"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <label htmlFor="storeName">Store Name</label>
                  <input
                    className="border-2 border-solid mt-1 p-2 rounded"
                    data-testid="storeName"
                    name="storeName"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                  />
                </form>
              </section>
              <section className="mt-4 flex">
                <form
                  className="flex flex-col"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <label htmlFor="storeId">Store ID</label>
                  <div className="flex gap-2">
                    <input
                      className="border-2 border-solid mt-1 p-2 rounded"
                      id="fname"
                      name="fname"
                      value={shopId!}
                      onChange={() => {}}
                    />
                    <button className="mr-4" onClick={copyToClipboard}>
                      <Image
                        src="/assets/copy-icon.svg"
                        width={14}
                        height={14}
                        alt="copy-icon"
                      />
                    </button>
                  </div>
                </form>
              </section>
              <section className="mt-4">
                <form
                  className="flex flex-col"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <label htmlFor="pricingCurrency">Base Currency</label>
                  <div>
                    <input
                      className="border-2 border-solid mt-1 p-2 rounded"
                      data-testid="baseAddr"
                      name="baseAddr"
                      value={baseAddr ?? ""}
                      onChange={(e) =>
                        setStoreBase(e.target.value as TokenAddr)
                      }
                    />
                    <button className="mr-4" onClick={copyToClipboard}>
                      <Image
                        src="/assets/copy-icon.svg"
                        width={14}
                        height={14}
                        alt="copy-icon"
                      />
                    </button>

                    <input
                      className="border-2 border-solid mt-1 p-2 rounded"
                      data-testid="baseChainId"
                      name="baseChainId"
                      value={baseChainId}
                      onChange={(e) => setBaseChainId(Number(e.target.value))}
                    />
                  </div>
                </form>
              </section>
              <section className="mt-4">
                <p>Accepted currencies:</p>
                {renderAcceptedCurrencies()}
              </section>
              <section className="mt-4">
                <form
                  className="flex flex-col"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <label htmlFor="addTokenAddr">Add Token Address</label>
                  <p>
                    Note: for now it will add with the chainID from env file...
                  </p>
                  <div>
                    <input
                      className="border-2 border-solid mt-1 p-2 rounded "
                      data-testid="addTokenAddr"
                      name="addTokenAddr"
                      value={addTokenAddr}
                      onChange={(e) =>
                        setAddTokenAddr(e.target.value as TokenAddr)
                      }
                    />
                    <input
                      className="border-2 border-solid mt-1 p-2 rounded"
                      data-testid="addTokenChainId"
                      name="addTokenChainId"
                      value={addAcceptedChainId}
                      onChange={(e) => setAddChainId(Number(e.target.value))}
                    />
                    <SecondaryButton
                      className="mr-4"
                      onClick={addAcceptedCurrencyFn}
                    >
                      Add
                    </SecondaryButton>
                  </div>
                </form>
              </section>
            </div>
            <div></div>
          </section>
        </div>
        <div className="mt-auto mx-4">
          <Button onClick={updateStoreInfo}>Update</Button>
        </div>
      </section>
    </section>
  );
};

export default StoreProfile;

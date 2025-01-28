// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useChains, useWalletClient } from "wagmi";
import { Address } from "viem";

import { UpdateShopManifest } from "@massmarket/stateManager/types";
import { setTokenURI } from "@massmarket/blockchain";
import { logger } from "@massmarket/utils";
import { addresses } from "@massmarket/contracts";

import {
  CurrencyChainOption,
  ShopCurrencies,
  ShopManifest,
} from "../../types.ts";
import { getTokenAddress } from "../../utils/token.ts";
import Button from "../common/Button.tsx";
import AvatarUpload from "../common/AvatarUpload.tsx";
import ValidationWarning from "../common/ValidationWarning.tsx";
import ErrorMessage from "../common/ErrorMessage.tsx";
import SuccessToast from "../common/SuccessToast.tsx";
import BackButton from "../common/BackButton.tsx";
import Dropdown from "../common/CurrencyDropdown.tsx";
import { useShopDetails } from "../../hooks/useShopDetails.ts";
import { useShopId } from "../../hooks/useShopId.ts";
import { useClientWithStateManager } from "../../hooks/useClientWithStateManager.ts";

interface AcceptedChain {
  address: Address;
  chainId: number;
  removed?: boolean;
  added?: boolean;
}

const debug = logger("frontend:storeProfile");

export default function ShopSettings() {
  const { shopDetails, setShopDetails } = useShopDetails();
  console.log({ shopDetails });
  const { shopId } = useShopId();
  const { data: wallet } = useWalletClient();
  const { clientStateManager } = useClientWithStateManager();
  const [storeName, setStoreName] = useState<string>(shopDetails.name || "");
  const [avatar, setAvatar] = useState<FormData | null>(null);
  const [acceptedCurrencies, setAcceptedCurrencies] = useState<AcceptedChain[]>(
    [],
  );
  const [pricingToken, setPricingCurrency] = useState<ShopCurrencies | null>(
    null,
  );
  const [error, setError] = useState<null | string>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [manifest, setManifest] = useState<ShopManifest | null>(null);
  const [displayedChains, setRenderChains] = useState<CurrencyChainOption[]>(
    [],
  );

  const chains = useChains();

  useEffect(() => {
    if (chains) {
      const chainsToRender: CurrencyChainOption[] = [];
      chains.map((c) => {
        chainsToRender.push({
          label: `ETH/${c.name}`,
          value: `${addresses.zeroAddress}/${c.id}`,
          address: addresses.zeroAddress,
          chainId: c.id,
        });
        const usdcTokenAddress = getTokenAddress("USDC", String(c.id));
        chainsToRender.push({
          label: `USDC/${c.name}`,
          value: `${usdcTokenAddress}/${c.id}`,
          address: usdcTokenAddress as `0x${string}`,
          chainId: c.id,
        });
      });
      setRenderChains(chainsToRender);
    }
  }, []);

  useEffect(() => {
    function onUpdateEvent(updatedManifest: ShopManifest) {
      const { pricingCurrency, acceptedCurrencies } = updatedManifest;
      setAcceptedCurrencies(acceptedCurrencies);
      setPricingCurrency({
        address: pricingCurrency.address!,
        chainId: pricingCurrency.chainId!,
      });
    }

    clientStateManager!
      .stateManager!.manifest.get()
      .then((shopManifest) => {
        const { pricingCurrency, acceptedCurrencies } = shopManifest;
        setManifest(shopManifest);
        setAcceptedCurrencies(acceptedCurrencies);
        setPricingCurrency({
          address: pricingCurrency.address!,
          chainId: pricingCurrency.chainId!,
        });
      });

    clientStateManager.stateManager.manifest.on("update", onUpdateEvent);

    return () => {
      // Cleanup listeners on unmount
      clientStateManager.stateManager.manifest.removeListener(
        "update",
        onUpdateEvent,
      );
    };
  }, []);

  function copyToClipboard() {
    navigator.clipboard.writeText(String(shopId));
  }
  async function updateShopManifest() {
    const um: Partial<UpdateShopManifest> = {};
    //If pricing currency needs to update.
    if (
      pricingToken!.address !== manifest!.pricingCurrency.address ||
      pricingToken!.chainId !== manifest!.pricingCurrency.chainId
    ) {
      um.setPricingCurrency = pricingToken;
    }
    const remove: ShopCurrencies[] = [];
    const add: ShopCurrencies[] = [];

    acceptedCurrencies.map((c) => {
      if (c.removed) {
        remove.push({ address: c.address, chainId: c.chainId });
      } else if (c.added) {
        add.push({ address: c.address, chainId: c.chainId });
      }
      return;
    });
    if (remove.length) {
      um.removeAcceptedCurrencies = remove;
    }
    if (add.length) {
      um.addAcceptedCurrencies = add;
    }
    try {
      if (Object.keys(um).length) {
        await clientStateManager.stateManager.manifest.update(um);
      }

      //If avatar or store name changed, setShopMetadataURI.
      if (avatar || storeName !== shopDetails.name) {
        const metadata = {
          name: storeName.length ? storeName : shopDetails.name,
          //If new avatar was uploaded, upload the image, otherwise use previous image.
          image: avatar
            ? (
              await clientStateManager!.relayClient!.uploadBlob(
                avatar as FormData,
              )
            ).url
            : shopDetails.profilePictureUrl,
        };
        const jsn = JSON.stringify(metadata);
        const blob = new Blob([jsn], { type: "application/json" });
        const file = new File([blob], "file.json");
        const formData = new FormData();
        formData.append("file", file);
        const { url } = await clientStateManager!.relayClient!.uploadBlob(
          formData,
        );
        await setTokenURI(wallet, [shopId, url]);
        setShopDetails({
          name: storeName,
          profilePictureUrl: url,
        });
      }
      setSuccess("Changes saved.");
    } catch (error) {
      debug("Failed: updateShopManifest", error);
      setError("Error updating shop manifest.");
    }
  }

  function handleAcceptedCurrencies(e: ChangeEvent<HTMLInputElement>) {
    const [addr, chainId] = e.target.value.split("/");
    const address = addr as Address;
    if (e.target.checked) {
      setAcceptedCurrencies([
        ...acceptedCurrencies,
        { address, chainId: Number(chainId), added: true, removed: false },
      ]);
    } else {
      //remove accepted currency
      setAcceptedCurrencies(
        acceptedCurrencies.map((c) => {
          if (
            c.address === address.toLowerCase() &&
            c.chainId === Number(chainId)
          ) {
            return { ...c, added: false, removed: true };
          } else return c;
        }),
      );
    }
  }
  function handlePricingCurrency(option: CurrencyChainOption) {
    const v = option.value as string;
    const [addr, chainId] = v.split("/");
    const address = addr as Address;
    setPricingCurrency({ address, chainId: Number(chainId) });
  }

  return (
    <main className="pt-under-nav h-screen px-4 mt-3">
      <ErrorMessage
        errorMessage={error}
        onClose={() => {
          setError(null);
        }}
      />
      <ValidationWarning
        warning={validationError}
        onClose={() => {
          setValidationError(null);
        }}
      />
      <SuccessToast
        message={success}
        onClose={() => {
          setSuccess(null);
        }}
      />
      <BackButton href="/products" />
      <section className="mt-2">
        <div className="flex">
          <h2>Edit shop details</h2>
        </div>
        <section className="mt-2 flex flex-col gap-4 bg-white p-5 rounded-lg">
          <p className="flex items-center font-medium">Shop PFP</p>
          <AvatarUpload setImgBlob={setAvatar} />
          <section className="text-sm flex flex-col gap-4">
            <div>
              <section className="mt-4">
                <form
                  className="flex flex-col"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <label className="font-medium text-base" htmlFor="storeName">
                    Shop Name
                  </label>
                  <input
                    className="border-2 border-solid mt-1 p-2 rounded"
                    data-testid="storeName"
                    name="storeName"
                    value={storeName}
                    placeholder={shopDetails.name}
                    onChange={(e) => setStoreName(e.target.value)}
                  />
                </form>
              </section>
              <section className="mt-4 flex">
                <form
                  className="flex flex-col"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <label className="font-medium text-base" htmlFor="storeId">
                    Shop ID
                  </label>
                  <div className="flex gap-2">
                    <input
                      className="border-2 border-solid mt-1 p-2 rounded"
                      id="shopId"
                      name="shopId"
                      value={String(shopId)}
                      onChange={() => {}}
                    />
                    <button
                      className="mr-4 p-0 bg-transparent"
                      onClick={copyToClipboard}
                    >
                      <img
                        src="/icons/copy-icon.svg"
                        width={14}
                        height={14}
                        alt="copy-icon"
                        className="w-auto h-auto"
                      />
                    </button>
                  </div>
                </form>
              </section>
              <section className="mt-4">
                <label className="font-medium text-base">
                  Accepted currency
                </label>
                <div className="flex flex-col gap-1 mt-1">
                  {displayedChains.length &&
                    displayedChains.map((c) => {
                      return (
                        <div key={c.value}>
                          <label className="flex items-center space-x-2">
                            <input
                              data-testid="displayed-accepted-currencies"
                              type="checkbox"
                              onChange={(e) => handleAcceptedCurrencies(e)}
                              className="form-checkbox h-4 w-4"
                              value={c.value}
                              checked={Boolean(
                                acceptedCurrencies.find((currency) => {
                                  return (
                                    (!currency.removed || currency.added) &&
                                    currency.chainId === c.chainId &&
                                    currency.address.toLowerCase() ===
                                      c.address.toLowerCase()
                                  );
                                }),
                              )}
                            />
                            <span>{c.label}</span>
                          </label>
                        </div>
                      );
                    })}
                </div>
              </section>
              <section className="mt-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                >
                  <div
                    className="flex flex-col"
                    onSubmit={(e) => e.preventDefault()}
                    data-testid="pricing-currency"
                  >
                    <label
                      htmlFor="pricingCurrency"
                      className="font-medium text-base mb-1"
                    >
                      Pricing Currency
                    </label>
                    <Dropdown
                      options={displayedChains}
                      callback={handlePricingCurrency}
                      selected={displayedChains.find(
                        (c) =>
                          c.address!.toLowerCase() === pricingToken?.address &&
                          c.chainId === pricingToken?.chainId,
                      )}
                    />
                  </div>
                </form>
              </section>
            </div>
            <div></div>
          </section>
        </section>
        <div className="mt-auto mx-4">
          <Button onClick={updateShopManifest}>Update</Button>
        </div>
      </section>
    </main>
  );
}

// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { ChangeEvent, useEffect, useState } from "react";
import { useChains, useWalletClient } from "wagmi";
import { Address } from "viem";

import { UpdateShopManifest } from "@massmarket/stateManager/types";
import { setTokenURI } from "@massmarket/blockchain";
import { assert, logger } from "@massmarket/utils";
import { addresses } from "@massmarket/contracts";

import {
  Currency,
  CurrencyChainOption,
  ShopCurrencies,
  ShopManifest,
} from "../../types.js";
import {
  compareAddedRemovedChains,
  getTokenAddress,
} from "../../utils/token.js";
import Button from "../common/Button.jsx";
import AvatarUpload from "../common/AvatarUpload.jsx";
import ValidationWarning from "../common/ValidationWarning.jsx";
import ErrorMessage from "../common/ErrorMessage.jsx";
import SuccessToast from "../common/SuccessToast.jsx";
import BackButton from "../common/BackButton.jsx";
import Dropdown from "../common/CurrencyDropdown.jsx";
import { useShopDetails } from "../../hooks/useShopDetails.js";
import { useShopId } from "../../hooks/useShopId.js";
import { useClientWithStateManager } from "../../hooks/useClientWithStateManager.js";

const namespace = "frontend:StoreSettings";
const debug = logger(namespace);
const errlog = logger(namespace, "error");

export default function ShopSettings() {
  const { shopDetails, setShopDetails } = useShopDetails();
  const { shopId } = useShopId();
  const { data: wallet } = useWalletClient();
  const { clientStateManager } = useClientWithStateManager();
  const chains = useChains();

  const [storeName, setStoreName] = useState<string>(shopDetails.name || "");
  const [avatar, setAvatar] = useState<FormData | null>(null);

  const [acceptedCurrencies, setAcceptedCurrencies] = useState<
    Currency[]
  >([]);
  const [pricingToken, setPricingCurrency] = useState<ShopCurrencies | null>(
    null,
  );
  const [error, setError] = useState<null | string>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [manifest, setManifest] = useState<ShopManifest | null>(null);
  const [displayedChains, setDisplayedChains] = useState<CurrencyChainOption[]>(
    [],
  );

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
        const eddAddress = getTokenAddress("EDD", String(c.id));
        chainsToRender.push({
          label: `EDD/${c.name}`,
          value: `${eddAddress}/${c.id}`,
          address: eddAddress as `0x${string}`,
          chainId: c.id,
        });
      });
      setDisplayedChains(chainsToRender);
    }
  }, []);

  useEffect(() => {
    function onUpdateEvent(updatedManifest: ShopManifest) {
      const { pricingCurrency, acceptedCurrencies } = updatedManifest;
      setManifest(updatedManifest);
      setAcceptedCurrencies(acceptedCurrencies);
      setPricingCurrency({
        address: pricingCurrency!.address!,
        chainId: pricingCurrency!.chainId!,
      });
    }

    clientStateManager!
      .stateManager!.manifest.get()
      .then((shopManifest: ShopManifest) => {
        const { pricingCurrency, acceptedCurrencies } = shopManifest;
        setManifest(shopManifest);
        setAcceptedCurrencies(acceptedCurrencies);
        setPricingCurrency({
          address: pricingCurrency!.address!,
          chainId: pricingCurrency!.chainId!,
        });
      });

    clientStateManager!.stateManager.manifest.on("update", onUpdateEvent);

    return () => {
      // Cleanup listeners on unmount
      clientStateManager!.stateManager.manifest.removeListener(
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
    //Compare added/removed currencies and apply changes to update manifest object.
    const { removed, added } = compareAddedRemovedChains(
      manifest!.acceptedCurrencies,
      acceptedCurrencies,
    );

    if (removed.length) {
      debug(`Removing ${removed.length} chain from accepted chains`);
      um.removeAcceptedCurrencies = removed;
    }
    if (added.length) {
      debug(`Adding ${added.length} chain to accepted chains`);
      um.addAcceptedCurrencies = added;
    }

    try {
      if (Object.keys(um).length) {
        await clientStateManager!.stateManager.manifest.update(um);
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
        //Upload metadata to IPFS
        const jsn = JSON.stringify(metadata);
        const blob = new Blob([jsn], { type: "application/json" });
        const file = new File([blob], "file.json");
        const formData = new FormData();
        formData.append("file", file);
        const { url } = await clientStateManager!.relayClient!.uploadBlob(
          formData,
        );
        await setTokenURI(wallet!, [shopId!, url]);
        setShopDetails({
          name: storeName,
          profilePictureUrl: metadata.image,
        });
      }
      setSuccess("Changes saved.");
      globalThis.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: unknown) {
      assert(error instanceof Error, "Error is not an instance of Error");
      errlog("Failed: updateShopManifest", error);
      setError("Error updating shop manifest.");
    }
  }

  function handleAcceptedCurrencies(e: ChangeEvent<HTMLInputElement>) {
    const [addr, chainId] = e.target.value.split("/");
    const address = addr as Address;
    if (e.target.checked) {
      // Add to accepted currencies
      setAcceptedCurrencies([
        ...acceptedCurrencies,
        { address, chainId: Number(chainId) },
      ]);
    } else {
      // Remove from accepted currencies
      const test = acceptedCurrencies.filter((c: Currency) => {
        return !(c.address.toLowerCase() === address.toLowerCase() &&
          c.chainId === Number(chainId));
      });
      setAcceptedCurrencies(
        test,
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
    <main className="pt-under-nav px-4 mt-3">
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
      <BackButton href="/merchant-dashboard" />
      <section className="mt-2">
        <div className="flex">
          <h2>Edit shop details</h2>
        </div>
        <section className="mt-2 flex flex-col gap-4 bg-white p-5 rounded-lg">
          <p className="flex items-center font-medium">Shop PFP</p>
          <AvatarUpload
            setImgBlob={setAvatar}
            setErrorMsg={setError}
            currentImg={shopDetails.profilePictureUrl}
          />
          <section className="text-sm flex flex-col gap-4">
            <div>
              <section>
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
                    displayedChains.map((c: CurrencyChainOption) => {
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
                                acceptedCurrencies.find(
                                  (currency: Currency) => {
                                    return (
                                      currency.chainId === c.chainId &&
                                      currency.address.toLowerCase() ===
                                        c!.address!.toLowerCase()
                                    );
                                  },
                                ),
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
                        (c: CurrencyChainOption) =>
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
        <div className="my-4">
          <Button onClick={updateShopManifest}>Update</Button>
        </div>
      </section>
    </main>
  );
}

// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { ChangeEvent, useEffect, useState } from "react";
import { useChains, useWalletClient } from "wagmi";
import { Address, zeroAddress } from "viem";

import { UpdateShopManifest } from "@massmarket/stateManager/types";
import { setTokenURI } from "@massmarket/blockchain";
import { assert, logger } from "@massmarket/utils";

import {
  CurrencyChainOption,
  TCurrencyMap,
  TManifest,
  TPricingCurrency,
} from "../../types.ts";
import {
  compareAddedRemovedChains,
  getTokenAddress,
} from "../../utils/token.ts";
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
    TCurrencyMap
  >(new Map());
  const [pricingCurrency, setPricingCurrency] = useState<
    TPricingCurrency | null
  >(
    null,
  );
  const [error, setError] = useState<null | string>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [manifest, setManifest] = useState<TManifest | null>(null);
  const [displayedChains, setDisplayedChains] = useState<CurrencyChainOption[]>(
    [],
  );
  useEffect(() => {
    if (chains) {
      const chainsToRender: CurrencyChainOption[] = [];
      chains.map((c) => {
        chainsToRender.push({
          label: `ETH/${c.name}`,
          value: `${zeroAddress}/${c.id}`,
          Address: zeroAddress,
          ChainID: c.id,
        });
        const eddAddress = getTokenAddress("EDD", String(c.id));
        chainsToRender.push({
          label: `EDD/${c.name}`,
          value: `${eddAddress}/${c.id}`,
          Address: eddAddress as `0x${string}`,
          ChainID: c.id,
        });
      });
      setDisplayedChains(chainsToRender);
    }
  }, []);

  useEffect(() => {
    if (!clientStateManager?.stateManager) return;
    function onUpdateEvent(updatedManifest: TManifest) {
      setManifest(updatedManifest);
      setAcceptedCurrencies(updatedManifest.acceptedCurrencies);
      setPricingCurrency({
        Address: updatedManifest.pricingCurrency.Address!,
        ChainID: updatedManifest.pricingCurrency.ChainID!,
      });
    }

    clientStateManager
      .stateManager!.manifest.get()
      .then((shopManifest: TManifest) => {
        setManifest(shopManifest);
        setAcceptedCurrencies(shopManifest.acceptedCurrencies);
        setPricingCurrency({
          ChainID: shopManifest.pricingCurrency.ChainID!,
          Address: shopManifest.pricingCurrency.Address!,
        });
      });

    clientStateManager.stateManager.events.on(["Manifest"], onUpdateEvent);

    return () => {
      // Cleanup listeners on unmount
      clientStateManager.stateManager.events.off(
        ["Manifest"],
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
      pricingCurrency!.Address !== manifest!.pricingCurrency.Address ||
      pricingCurrency!.chainID !== manifest!.pricingCurrency.chainID
    ) {
      um.setPricingCurrency = pricingCurrency;
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
    const [address, chainId] = e.target.value.split("/");
    const newAcceptedCurrencies = new Map(acceptedCurrencies);
    const allChainAddresses = newAcceptedCurrencies.get(chainId) || new Map();

    if (e.target.checked) {
      allChainAddresses.set(address, null);
      newAcceptedCurrencies.set(chainId, allChainAddresses);
      setAcceptedCurrencies(newAcceptedCurrencies);
    } else {
      if (allChainAddresses) {
        //TODO: may have to delete address as lowercase
        allChainAddresses.delete(address);
        newAcceptedCurrencies.set(chainId, allChainAddresses);
      }
      setAcceptedCurrencies(
        newAcceptedCurrencies,
      );
    }
  }

  function handlePricingCurrency(option: CurrencyChainOption) {
    const v = option.value as string;
    const [addr, chainId] = v.split("/");
    const address = addr as Address;
    setPricingCurrency({ ChainID: Number(chainId), Address: address });
  }

  function currencyIsSelected(c: CurrencyChainOption) {
    if (acceptedCurrencies.get(c.chainId)) {
      const addresses = Object.keys(acceptedCurrencies.get(c.chainId));
      return addresses.includes(c.address.toLowerCase());
    }
    return false;
  }

  return (
    <main
      className="pt-under-nav px-4 mt-3 md:flex justify-center"
      data-testid="shop-settings-page"
    >
      <section className="md:w-[560px]">
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
                    <label
                      className="font-medium text-base"
                      htmlFor="storeName"
                    >
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
                  <div
                    className="flex flex-col gap-1 mt-1"
                    data-testid="displayed-accepted-currencies"
                  >
                    {displayedChains.length &&
                      displayedChains.map((c: CurrencyChainOption) => {
                        return (
                          <div key={c.value}>
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                onChange={(e) => handleAcceptedCurrencies(e)}
                                className="form-checkbox h-4 w-4"
                                value={c.value}
                                checked={currencyIsSelected(c)}
                              />
                              <span>{c.label}</span>
                            </label>
                          </div>
                        );
                      })}
                  </div>
                </section>
                <section className="mt-4" data-testid="pricing-currency">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <div
                      className="flex flex-col"
                      onSubmit={(e) => e.preventDefault()}
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
                            c.Address!.toLowerCase() ===
                              pricingCurrency?.Address!.toLowerCase() &&
                            c.ChainID === pricingCurrency?.ChainID,
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
      </section>
    </main>
  );
}

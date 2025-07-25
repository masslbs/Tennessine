// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { ChangeEvent, useEffect, useState } from "react";
import { toHex } from "viem";
import { useChains, useWalletClient } from "wagmi";
import { equal } from "@std/assert";

import { CodecValue } from "@massmarket/utils/codec";
import { setTokenURI } from "@massmarket/contracts";
import { useShopId } from "@massmarket/react-hooks";
import { getLogger } from "@logtape/logtape";

import {
  AcceptedCurrencyMap,
  ChainAddress,
  Manifest,
} from "@massmarket/schema";
import {
  useRelayClient,
  useShopDetails,
  useStateManager,
} from "@massmarket/react-hooks";

import { CurrencyChainOption } from "../../types.ts";
import Button from "../common/Button.tsx";
import AvatarUpload from "../common/AvatarUpload.tsx";
import ValidationWarning from "../common/ValidationWarning.tsx";
import ErrorMessage from "../common/ErrorMessage.tsx";
import SuccessToast from "../common/SuccessToast.tsx";
import BackButton from "../common/BackButton.tsx";
import Dropdown from "../common/CurrencyDropdown.tsx";
import { getAllCurrencyOptions, getErrLogger } from "../../utils/mod.ts";

const baseLogger = getLogger(["mass-market", "frontend", "ShopSettings"]);

export default function ShopSettings() {
  const { shopDetails } = useShopDetails();
  const { shopId } = useShopId();
  const chains = useChains();
  const { data: wallet } = useWalletClient();
  const { stateManager } = useStateManager();
  const { relayClient } = useRelayClient();
  const [shopName, setshopName] = useState<string>(shopDetails?.name || "");
  const [avatar, setAvatar] = useState<FormData | null>(null);

  const [acceptedCurrencies, setAcceptedCurrencies] = useState<
    AcceptedCurrencyMap
  >(new AcceptedCurrencyMap());
  const [pricingCurrency, setPricingCurrency] = useState<
    ChainAddress | null
  >(
    null,
  );
  const [errorMsg, setErrorMsg] = useState<null | string>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const currencyOptions = getAllCurrencyOptions([...chains]);

  const logger = baseLogger.with({
    shopId,
  });

  const logError = getErrLogger(logger, setErrorMsg);

  useEffect(() => {
    if (!stateManager) return;
    function onUpdateEvent(res: CodecValue | undefined) {
      if (!res || (res instanceof Map && !res.size)) {
        logError("Manifest not found");
        return;
      }
      const m = Manifest.fromCBOR(res);
      setManifest(m);
      setAcceptedCurrencies(m.AcceptedCurrencies);
      setPricingCurrency(m.PricingCurrency);

      const p = m.Payees.get(m.PricingCurrency.ChainID);
      if (p) {
        const payee = p.keys().next().value;
        if (payee instanceof Uint8Array) {
          logger.debug`Payee Address: ${toHex(payee)}`;
        }
      }
    }
    stateManager.get(["Manifest"])
      .then(onUpdateEvent);

    stateManager.events.on(onUpdateEvent, ["Manifest"]);

    return () => {
      // Cleanup listeners on unmount
      stateManager.events.off(
        onUpdateEvent,
        ["Manifest"],
      );
    };
  }, [stateManager]);

  function copyToClipboard() {
    navigator.clipboard.writeText(String(shopId));
  }
  async function updateShopManifest() {
    if (!stateManager) {
      logError("stateManager is undefined");
      return;
    }
    if (!manifest) {
      logError("Manifest not found");
      return;
    }
    //If pricing currency needs to update.
    if (
      pricingCurrency!.Address !== manifest!.PricingCurrency.Address ||
      pricingCurrency!.ChainID !== manifest!.PricingCurrency.ChainID
    ) {
      await stateManager.set(["Manifest", "PricingCurrency"], pricingCurrency);
    }
    if (
      acceptedCurrencies.asCBORMap() !==
        manifest!.AcceptedCurrencies.asCBORMap()
    ) {
      await stateManager.set(
        ["Manifest", "AcceptedCurrencies"],
        acceptedCurrencies,
      );
    }
    try {
      //If avatar or shop name changed, setShopMetadataURI.

      if (avatar || shopName !== shopDetails!.name) {
        const metadata = {
          name: shopName.length ? shopName : shopDetails!.name,
          //If new avatar was uploaded, upload the image, otherwise use previous image.
          image: avatar
            ? (
              await relayClient!.uploadBlob(
                avatar as FormData,
              )
            ).url
            : shopDetails!.profilePictureUrl,
        };
        //Upload metadata to IPFS
        const jsn = JSON.stringify(metadata);
        const blob = new Blob([jsn], { type: "application/json" });
        const file = new File([blob], "file.json");
        const formData = new FormData();
        formData.append("file", file);
        const { url } = await relayClient!.uploadBlob(
          formData,
        );
        await setTokenURI(wallet!, wallet!.account, [shopId!, url]);
      }
      setSuccess("Changes saved.");
      // Deno doesn't support globalThis.scrollTo
      const element = document.getElementById("top");
      element?.scrollIntoView();
    } catch (error: unknown) {
      logError("Error updating shop manifest", error);
    }
  }

  function handleAcceptedCurrencies(
    e: ChangeEvent<HTMLInputElement>,
    c: CurrencyChainOption,
  ) {
    const copy = AcceptedCurrencyMap.fromCBOR(acceptedCurrencies.asCBORMap());
    if (e.target.checked) {
      copy.addAddress(c.chainId, c.address, true);
    } else {
      copy.removeAddress(c.chainId, c.address);
    }
    setAcceptedCurrencies(copy);
  }

  function handlePricingCurrency(option: CurrencyChainOption) {
    const pc = new ChainAddress(
      option.chainId,
      option.address,
    );
    setPricingCurrency(pc);
  }

  function currencyIsSelected(option: CurrencyChainOption) {
    const metadata = acceptedCurrencies.getAddressMetadata(
      option.chainId,
      option.address,
    );
    return Boolean(metadata);
  }

  function selectedPricingCurrency() {
    return currencyOptions.find((c) => {
      if (
        c.chainId === pricingCurrency?.ChainID &&
        equal(c.address, pricingCurrency?.Address)
      ) {
        return c;
      }
    });
  }
  // Loading manifest.
  if (!manifest) return null;
  return (
    <main
      className="px-4 md:flex justify-center"
      data-testid="shop-settings-page"
    >
      <section className="md:w-[560px]">
        <ErrorMessage
          errorMessage={errorMsg}
          onClose={() => {
            setErrorMsg(null);
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
        <BackButton />
        <section className="mt-2">
          <div className="flex">
            <h1>Edit shop details</h1>
          </div>
          <section className="mt-2 flex flex-col gap-4 bg-white p-5 rounded-lg">
            <p className="flex items-center font-medium">Shop PFP</p>
            <AvatarUpload
              setImgBlob={setAvatar}
              logError={logError}
              currentImg={shopDetails?.profilePictureUrl}
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
                      htmlFor="shopName"
                    >
                      Shop Name
                    </label>
                    <input
                      className="mt-1 p-2 rounded"
                      data-testid="shopName"
                      name="shopName"
                      style={{ backgroundColor: "#F3F3F3" }}
                      value={shopName}
                      placeholder={shopDetails?.name}
                      onChange={(e) => setshopName(e.target.value)}
                    />
                  </form>
                </section>
                <section className="mt-4">
                  <form
                    className="flex flex-col"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <label className="font-medium text-base" htmlFor="shopId">
                      Shop ID
                    </label>
                    <div className="flex gap-2">
                      <input
                        className="mt-1 p-2 rounded w-full"
                        id="shopId"
                        name="shopId"
                        style={{ backgroundColor: "#F3F3F3" }}
                        value={String(shopId)}
                        onChange={() => {}}
                      />
                      <button
                        type="button"
                        className="mr-4"
                        style={{ backgroundColor: "transparent", padding: 0 }}
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
                    {currencyOptions.map((c: CurrencyChainOption) => {
                      return (
                        <div key={c.value}>
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              onChange={(e) => handleAcceptedCurrencies(e, c)}
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
                <section className="mt-4">
                  <div className="flex flex-col">
                    <Dropdown
                      label="Pricing Currency"
                      testId="pricing-currency-dropdown"
                      options={currencyOptions}
                      callback={handlePricingCurrency}
                      selected={selectedPricingCurrency()}
                    />
                  </div>
                </section>
              </div>
            </section>
            <div>
              <Button onClick={updateShopManifest}>Save</Button>
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}

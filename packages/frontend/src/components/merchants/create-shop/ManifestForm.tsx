import { ChangeEvent, useState } from "react";
import { getLogger } from "@logtape/logtape";

import { ChainAddress, Manifest } from "@massmarket/schema";

import ValidationWarning from "../../common/ValidationWarning.tsx";
import ErrorMessage from "../../common/ErrorMessage.tsx";
import Button from "../../common/Button.tsx";
import AvatarUpload from "../../common/AvatarUpload.tsx";
import Dropdown from "../../common/CurrencyDropdown.tsx";
import ChevronRight from "../../common/ChevronRight.tsx";

import {
  CreateShopStep,
  CurrencyChainOption,
  ShopForm,
} from "../../../types.ts";
import { useAllCurrencyOptions } from "../../../hooks/useAllCurrencyOptions.ts";

import { getErrLogger } from "../../../utils/mod.ts";

const logger = getLogger(["mass-market", "frontend", "ManifestForm"]);

export default function ManifestForm(
  {
    shopManifest,
    setShopManifest,
    setStep,
    setShopMetadata,
    shopMetadata,
    validationError,
    setValidationError,
  }: {
    shopManifest: Manifest;
    setShopManifest: (shopManifest: Manifest) => void;
    setStep: (step: CreateShopStep) => void;
    shopMetadata: ShopForm;
    setShopMetadata: (shopMetadata: ShopForm) => void;
    validationError: string | null;
    setValidationError: (validationError: string | null) => void;
  },
) {
  const { shopName, description, paymentAddress } = shopMetadata;

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const currencyOptions = useAllCurrencyOptions();

  const logError = getErrLogger(logger, setErrorMsg);

  function handleShopFormChange<K extends keyof ShopForm>(
    field: K,
    value: ShopForm[K],
  ) {
    setShopMetadata({ ...shopMetadata, [field]: value });
  }

  function handleAcceptedCurrencies(
    e: ChangeEvent<HTMLInputElement>,
    option: CurrencyChainOption,
  ) {
    if (e.target.checked) {
      shopManifest.AcceptedCurrencies.addAddress(
        option.chainId,
        option.address,
        true,
      );
    } else {
      // remove address from accepted currencies.
      shopManifest.AcceptedCurrencies.removeAddress(
        option.chainId,
        option.address,
      );
    }
    setShopManifest(shopManifest);
  }

  function handlePricingCurrency(option: CurrencyChainOption) {
    shopManifest.PricingCurrency = new ChainAddress(
      option.chainId,
      option.address,
    );
    setShopManifest(shopManifest);
  }

  function goToConnectWallet() {
    setStep(CreateShopStep.ConnectWallet);
  }

  return (
    <section data-testid="manifest-form" className="w-full md:w-[560px] p-5">
      <section>
        <ValidationWarning
          warning={validationError}
          onClose={() => {
            setValidationError(null);
          }}
        />
        <ErrorMessage
          errorMessage={errorMsg}
          onClose={() => {
            setErrorMsg(null);
          }}
        />
        <div className="flex">
          <h1>Create new shop</h1>
        </div>
      </section>
      <section className="mt-2 flex flex-col gap-[25px] bg-white p-5 rounded-lg">
        <form
          className="flex flex-col grow"
          onSubmit={(e) =>
            e.preventDefault()}
        >
          <label className="font-medium" htmlFor="shopName">
            Shop Name
          </label>
          <input
            className="mt-1 p-2 rounded-md"
            data-testid="shopName"
            style={{ backgroundColor: "#F3F3F3" }}
            value={shopName}
            onChange={(e) => {
              handleShopFormChange("shopName", e.target.value);
            }}
          />
        </form>
        <div className="flex gap-2">
          <AvatarUpload
            setImgBlob={(blob: FormData) => {
              handleShopFormChange("avatar", blob);
            }}
            logError={logError}
          />
        </div>
        <form
          className="flex flex-col"
          onSubmit={(e) =>
            e.preventDefault()}
        >
          <label htmlFor="desc" className="font-medium">
            Description
          </label>
          <input
            className="mt-1 p-2 rounded-md"
            data-testid="description"
            style={{ backgroundColor: "#F3F3F3" }}
            value={description}
            onChange={(e) =>
              handleShopFormChange("description", e.target.value)}
          />
        </form>
        <div data-testid="accepted-currencies">
          <label className="font-medium">Accepted Currencies</label>
          <div className="flex flex-col gap-2">
            {currencyOptions.map((c, i) => (
              <div key={i}>
                <label className="flex items-center space-x-2">
                  <input
                    name="AcceptedCurrencies"
                    type="checkbox"
                    onChange={(e) => handleAcceptedCurrencies(e, c)}
                    className="form-checkbox h-4 w-4"
                    value={c.value}
                  />
                  <span className="font-light">{c.label}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
        <Dropdown
          label="Pricing Currency"
          testId="pricing-currency-dropdown"
          options={currencyOptions}
          callback={handlePricingCurrency}
        />
        <div data-testid="payee-info" className="flex flex-col gap-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="flex flex-col"
          >
            <label htmlFor="payee" className="font-medium">
              Payment Address
            </label>
            <input
              className="mt-1 p-2 rounded-md"
              style={{ backgroundColor: "#F3F3F3" }}
              id="payees"
              data-testid="payees"
              value={paymentAddress || ""}
              onChange={(e) =>
                handleShopFormChange("paymentAddress", e.target.value)}
            />
          </form>
        </div>
        <div>
          <Button onClick={goToConnectWallet}>
            <h6 className="mr-2">Connect Wallet</h6>
            <ChevronRight hex="#FFF" />
          </Button>
        </div>
      </section>
    </section>
  );
}

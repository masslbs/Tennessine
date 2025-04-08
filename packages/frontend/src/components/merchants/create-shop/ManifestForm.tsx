import { ChangeEvent, useState } from "react";
import { useChains } from "wagmi";
import { hardhat } from "wagmi/chains";
import { toBytes } from "viem";

import { ChainAddress, Manifest } from "@massmarket/schema";

import ValidationWarning from "../../common/ValidationWarning.tsx";
import ErrorMessage from "../../common/ErrorMessage.tsx";
import Button from "../../common/Button.tsx";
import AvatarUpload from "../../common/AvatarUpload.tsx";
import Dropdown from "../../common/CurrencyDropdown.tsx";
import {
  CreateShopStep,
  CurrencyChainOption,
  ShopForm,
} from "../../../types.ts";
import { isValidAddress } from "../../../utils/mod.ts";
import { useAllCurrencyOptions } from "../../../hooks/useAllCurrencyOptions.ts";

export default function ManifestForm(
  { shopManifest, setShopManifest, setStep, setShopMetadata, shopMetadata }: {
    shopManifest: Manifest;
    setShopManifest: (shopManifest: Manifest) => void;
    setStep: (step: CreateShopStep) => void;
    shopMetadata: ShopForm;
    setShopMetadata: (shopMetadata: ShopForm) => void;
  },
) {
  const { shopName, description, paymentAddress } = shopMetadata;

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const currencyOptions = useAllCurrencyOptions();

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

  function checkRequiredFields() {
    if (!shopMetadata.shopName.length) {
      return "Shop name is required.";
    } else if (!shopMetadata.description.length) {
      return "Store description is required.";
    } else if (!paymentAddress) {
      return "Payee address is required.";
    } else if (
      !shopManifest.PricingCurrency.Address ||
      !shopManifest.PricingCurrency.ChainID
    ) {
      return "Pricing currency is required.";
    } else if (!shopManifest.AcceptedCurrencies.data.size) {
      return "Accepted currencies are required.";
    }
    const isTokenAddrHex = isValidAddress(shopManifest.PricingCurrency.Address);
    const isPayeeAddHex = isValidAddress(toBytes(paymentAddress));
    if (!isTokenAddrHex) {
      return "Token address must be a valid address.";
    } else if (!isPayeeAddHex) {
      return "Payee address must be a valid address.";
    }
    return null;
  }

  function goToConnectWallet() {
    const warning = checkRequiredFields();
    if (warning) {
      setValidationError(warning);
      throw Error(`Check all required fields: ${warning}`);
    } else {
      setValidationError(null);
    }
    setStep(CreateShopStep.ConnectWallet);
  }

  return (
    <section data-testid="manifest-form" className="md:w-[560px]">
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
      <section className="mt-2 flex flex-col gap-4 bg-white p-5 rounded-lg">
        <form
          className="flex flex-col grow"
          onSubmit={(e) => e.preventDefault()}
        >
          <label className="font-medium" htmlFor="shopName">
            Shop Name
          </label>
          <input
            className="border-2 border-solid mt-1 p-2 rounded-md bg-background-gray"
            data-testid="shopName"
            value={shopName}
            onChange={(e) => {
              handleShopFormChange("shopName", e.target.value);
            }}
          />
        </form>
        <div className="flex gap-2">
          <AvatarUpload
            // @ts-ignore TODO: fix this
            // Type '(prevState: FormData) => FormData' is not assignable to type 'FormData'.
            setImgBlob={(blob: FormData) => {
              handleShopFormChange("avatar", blob);
            }}
            setErrorMsg={setErrorMsg}
          />
          <p className="flex items-center">Upload PFP</p>
        </div>
        <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="desc" className="font-medium">
            Description
          </label>
          <input
            className="border-2 border-solid mt-1 p-2 rounded-md bg-background-gray"
            data-testid="description"
            value={description}
            onChange={(e) =>
              handleShopFormChange("description", e.target.value)}
          />
        </form>
        <div data-testid="accepted-currencies">
          <label className="font-medium">Accepted currency</label>
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
                  <span>{c.label}</span>
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
          >
            <label htmlFor="payee" className="font-medium">
              Payment Address
            </label>
            <input
              className="border-2 border-solid mt-1 p-2 rounded-md w-full bg-background-gray"
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
            <h6>Connect Wallet</h6>
          </Button>
        </div>
      </section>
    </section>
  );
}

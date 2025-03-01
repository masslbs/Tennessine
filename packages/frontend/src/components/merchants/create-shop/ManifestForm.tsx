import { ChangeEvent, useState } from "react";

import { useChains } from "wagmi";
import { hardhat } from "wagmi/chains";

import ValidationWarning from "../../common/ValidationWarning.tsx";
import ErrorMessage from "../../common/ErrorMessage.tsx";
import Button from "../../common/Button.tsx";
import AvatarUpload from "../../common/AvatarUpload.tsx";
import Dropdown from "../../common/CurrencyDropdown.tsx";

import {
  CreateShopStep,
  CurrencyChainOption,
  ShopCurrencies,
  ShopForm,
} from "../../../types.ts";
import { getTokenAddress, isValidAddress } from "../../../utils/mod.ts";

export default function ManifestForm(
  { shopData, setShopData, setStep }: {
    shopData: ShopForm;
    setShopData: (shopData: ShopForm) => void;
    setStep: (step: CreateShopStep) => void;
  },
) {
  const {
    shopName,
    description,
    pricingCurrency,
    acceptedCurrencies,
    payees,
  } = shopData;
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const chains = useChains();

  function handleInputChange<K extends keyof ShopForm>(
    field: K,
    value: ShopForm[K],
  ) {
    setShopData({ ...shopData, [field]: value });
  }

  function handleAcceptedCurrencies(e: ChangeEvent<HTMLInputElement>) {
    const [sym, chainId] = e.target.value.split("/");
    const address = getTokenAddress(sym, chainId);

    if (e.target.checked) {
      handleInputChange(e.target.name, [
        ...acceptedCurrencies,
        { address: address as `0x${string}`, chainId: Number(chainId) },
      ]);
    } else {
      handleInputChange(
        e.target.name,
        acceptedCurrencies.filter(
          (c: ShopCurrencies) =>
            c.chainId !== Number(chainId) || c.address !== address,
        ),
      );
    }
  }
  function handlePricingCurrency(option: CurrencyChainOption) {
    const v = option.value as string;
    const [sym, chainId] = v.split("/");
    const address = getTokenAddress(sym, chainId);
    handleInputChange("pricingCurrency", {
      address: address as `0x${string}`,
      chainId: Number(chainId),
    });
  }

  function handlePayee(e: ChangeEvent<HTMLInputElement>) {
    handleInputChange("payees", [{
      ...payees[0],
      address: e.target.value as `0x${string}`,
    }]);
  }

  function checkRequiredFields() {
    if (!shopData.payees[0].address) {
      return "Payee address is required.";
    } else if (!pricingCurrency?.address) {
      return "Pricing currency address is required.";
    } else if (!pricingCurrency?.chainId) {
      return "Pricing currency chain is required.";
    }

    const isTokenAddrHex = isValidAddress(pricingCurrency.address);
    const isPayeeAddHex = isValidAddress(shopData.payees[0].address);
    if (!isTokenAddrHex) {
      return "Token address must be a valid hex value";
    } else if (!shopData.shopName.length) {
      return "Store name is required";
    } else if (!shopData.description.length) {
      return "Store description is required";
    } else if (!isPayeeAddHex) {
      return "Payee Address must be a valid hex value";
    }
    return null;
  }

  function goToConnectWallet() {
    const warning = checkRequiredFields();
    if (warning) {
      setValidationError(warning);
      throw Error(`Check all required fields:${warning}`);
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
              handleInputChange("shopName", e.target.value);
            }}
          />
        </form>
        <div className="flex gap-2">
          <AvatarUpload
            setImgBlob={(blob: FormData) => handleInputChange("avatar", blob)}
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
            onChange={(e) => handleInputChange("description", e.target.value)}
          />
        </form>
        <div data-testid="accepted-currencies">
          <label className="font-medium">Accepted currency</label>
          <div className="flex flex-col gap-2">
            {chains.map((c) => (
              <div key={c.id}>
                <label className="flex items-center space-x-2">
                  <input
                    name="acceptedCurrencies"
                    type="checkbox"
                    onChange={(e) => handleAcceptedCurrencies(e)}
                    className="form-checkbox h-4 w-4"
                    value={`ETH/${c.id}`}
                  />
                  <span>{`ETH/${c.name}`}</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    name="acceptedCurrencies"
                    type="checkbox"
                    onChange={(e) => handleAcceptedCurrencies(e)}
                    className="form-checkbox h-4 w-4"
                    value={c.id === hardhat.id
                      ? `EDD/${hardhat.id}`
                      : `USDC/${c.id}`}
                  />
                  <span>
                    {`${c.id === hardhat.id ? "EDD" : "USDC"}/${c.name}`}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>
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
            <label htmlFor="pricingCurrency" className="font-medium">
              Pricing Currency
            </label>
            <Dropdown
              options={chains
                .map((c) => {
                  return { label: `ETH/${c.name}`, value: `ETH/${c.id}` };
                })
                .concat(
                  chains.map((c) => {
                    return {
                      label: `${
                        c.id === hardhat.id ? "EDD" : "USDC"
                      }/${c.name}`,
                      value: `${c.id === hardhat.id ? "EDD" : "USDC"}/${c.id}`,
                    };
                  }),
                )}
              callback={handlePricingCurrency}
            />
          </div>
        </form>
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
              value={payees[0].address || ""}
              onChange={(e) => handlePayee(e)}
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

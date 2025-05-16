// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import { getLogger } from "@logtape/logtape";
import { AddressDetails } from "@massmarket/schema";

import Cart from "./Cart.tsx";
import TimerToast from "./TimerToast.tsx";
import Button from "../common/Button.tsx";
import ErrorMessage from "../common/ErrorMessage.tsx";
import ValidationWarning from "../common/ValidationWarning.tsx";
import { useCurrentOrder } from "../../hooks/useCurrentOrder.ts";
import { useStateManager } from "../../hooks/useStateManager.ts";
import { isValidEmail } from "../../utils/mod.ts";

const logger = getLogger(["mass-market", "frontend", "ShippingDetails"]);

export default function ShippingDetails() {
  const { currentOrder } = useCurrentOrder();
  const { stateManager } = useStateManager();
  const navigate = useNavigate();
  const [invoiceAddress, setInvoiceAddress] = useState<AddressDetails>(
    new AddressDetails(),
  );
  const [errorMsg, setErrorMsg] = useState<null | string>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    currentOrder?.InvoiceAddress &&
      setInvoiceAddress(currentOrder.InvoiceAddress);
  }, [currentOrder]);

  function scroll() {
    const element = document.getElementById("top");
    element?.scrollIntoView();
  }
  function checkRequiredFields() {
    let warning: null | string = null;
    if (!invoiceAddress.Name.length) {
      warning = "Must include name";
    } else if (!invoiceAddress.Address1.length) {
      warning = "Must include address";
    } else if (!invoiceAddress.Country.length) {
      warning = "Must include country";
    } else if (!invoiceAddress.PostalCode.length) {
      warning = "Must include postal code";
    } else if (!invoiceAddress.City.length) {
      warning = "Must include city";
    } else if (invoiceAddress.EmailAddress) {
      warning = isValidEmail(invoiceAddress.EmailAddress)
        ? null
        : "Invalid Email Address";
    }
    return warning;
  }

  function handleFormChange(field: keyof AddressDetails, value: string) {
    const newAddress = new AddressDetails(
      invoiceAddress.Name,
      invoiceAddress.Address1,
      invoiceAddress.City,
      invoiceAddress.PostalCode,
      invoiceAddress.Country,
      invoiceAddress.EmailAddress,
      undefined, // Address 2 not used yet
      invoiceAddress.PhoneNumber,
    );
    Reflect.set(newAddress, field, value);
    if (newAddress.PhoneNumber === "") {
      newAddress.PhoneNumber = undefined;
    }
    setInvoiceAddress(newAddress);
  }

  async function onSubmitForm() {
    if (!stateManager) {
      return;
    }
    setErrorMsg(null);
    setValidationError(null);
    try {
      const warning = checkRequiredFields();
      if (warning) {
        scroll();
        return setValidationError(warning);
      }
      //TODO: Need country code UI for phone number
      if (invoiceAddress.PhoneNumber) {
        if (!invoiceAddress.PhoneNumber.startsWith("+")) {
          invoiceAddress.PhoneNumber = "+" + invoiceAddress.PhoneNumber;
        }
      }
      if (!invoiceAddress.EmailAddress.length) {
        invoiceAddress.EmailAddress = "example@email.com";
      }
      if (invoiceAddress !== currentOrder!.InvoiceAddress) {
        await stateManager.set(
          ["Orders", currentOrder!.ID, "InvoiceAddress"],
          invoiceAddress,
        );
        logger.debug("Shipping details updated");
      }
      navigate({
        to: "/pay",
        search: (prev: Record<string, string>) => ({
          shopId: prev.shopId,
        }),
      });
    } catch (error: unknown) {
      logger.error("error updating shipping details", { error });
      setErrorMsg("Error updating shipping details");
      scroll();
    }
  }

  if (!currentOrder) {
    return <div>No order found</div>;
  }

  return (
    <main className="md:flex justify-center">
      <section
        className="md:w-[800px] px-4 md:px-0"
        data-testid="shipping-details"
      >
        <h1 className="my-5">Shipping details</h1>
        <section className="flex flex-row justify-center gap-12 bg-white p-5 rounded-lg">
          <form
            className="flex flex-col"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <TimerToast />
            <div className="mt-2">
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
            </div>

            <label className="mt-5" htmlFor="name">Name</label>
            <input
              className="mt-1 p-3 rounded-2xl"
              style={{ backgroundColor: "#F3F3F3" }}
              id="name"
              name="name"
              data-testid="name"
              value={invoiceAddress.Name}
              onChange={(e) => handleFormChange("Name", e.target.value)}
            />
            <label htmlFor="address">Address</label>
            <input
              className="mt-1 p-3 rounded-2xl"
              style={{ backgroundColor: "#F3F3F3" }}
              id="address"
              name="address"
              data-testid="address"
              value={invoiceAddress.Address1}
              onChange={(e) => handleFormChange("Address1", e.target.value)}
            />
            <div className="flex gap-2">
              <div>
                <label htmlFor="city">City</label>
                <input
                  className="mt-1 p-3 rounded-2xl	w-full"
                  style={{ backgroundColor: "#F3F3F3" }}
                  id="city"
                  name="city"
                  data-testid="city"
                  value={invoiceAddress.City}
                  onChange={(e) => handleFormChange("City", e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="postal">Zip/Postal</label>
                <input
                  className="mt-1 p-3 rounded-2xl	w-full"
                  style={{ backgroundColor: "#F3F3F3" }}
                  id="zip"
                  name="zip"
                  data-testid="zip"
                  value={invoiceAddress.PostalCode}
                  onChange={(e) =>
                    handleFormChange("PostalCode", e.target.value)}
                />
              </div>
            </div>

            <label htmlFor="country">Country</label>
            <input
              className="mt-1 p-3 rounded-2xl"
              style={{ backgroundColor: "#F3F3F3" }}
              id="country"
              name="country"
              data-testid="country"
              value={invoiceAddress.Country}
              onChange={(e) => handleFormChange("Country", e.target.value)}
            />
            <h2 className="my-3">Contact details</h2>
            <p>
              Let the seller contact you if there is an issue with the order
              (Recommended).
            </p>
            <div className="mt-3 flex flex-col">
              <label htmlFor="email">Email (optional)</label>
              <input
                className="mt-1 p-3 rounded-2xl"
                style={{ backgroundColor: "#F3F3F3" }}
                id="email"
                name="email"
                data-testid="email"
                value={invoiceAddress.EmailAddress}
                onChange={(e) =>
                  handleFormChange("EmailAddress", e.target.value)}
              />
              <label htmlFor="phoneNumber">Phone Number (optional)</label>
              <input
                className="mt-1 p-3 rounded-2xl"
                style={{ backgroundColor: "#F3F3F3" }}
                id="phone"
                name="phone"
                data-testid="phone"
                value={invoiceAddress.PhoneNumber}
                onChange={(e) =>
                  handleFormChange("PhoneNumber", e.target.value)}
              />
            </div>
            <div className="mt-3">
              <Button onClick={onSubmitForm} data-testid="goto-payment-options">
                <div className="flex items-center gap-2">
                  <p>
                    Payment options
                  </p>
                  <img
                    src="/icons/white-arrow.svg"
                    alt="white-arrow"
                    width={7}
                    height={12}
                  />
                </div>
              </Button>
            </div>
          </form>
          <section className="hidden md:block">
            <h1 className="pl-5">Order Summary</h1>
            <Cart showActionButtons={false} />
          </section>
        </section>
      </section>
    </main>
  );
}

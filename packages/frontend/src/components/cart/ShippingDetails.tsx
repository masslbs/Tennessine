// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { useEffect, useState } from "react";

import { logger } from "@massmarket/utils";
import { AddressDetails } from "@massmarket/schema";

import Cart from "./Cart.tsx";
import TimerToast from "./TimerToast.tsx";
import Button from "../common/Button.tsx";
import ErrorMessage from "../common/ErrorMessage.tsx";
import ValidationWarning from "../common/ValidationWarning.tsx";
import { useCurrentOrder } from "../../hooks/useCurrentOrder.ts";
import { CheckoutStep } from "../../types.ts";
import { useStateManager } from "../../hooks/useStateManager.ts";

const namespace = "frontend:ShippingDetails";
const debug = logger(namespace);
const warn = logger(namespace, "warn");
const errlog = logger(namespace, "error");

export default function ShippingDetails({
  setStep,
  startTimer,
  countdown,
}: {
  setStep: (step: CheckoutStep) => void;
  startTimer: () => void;
  countdown: number;
}) {
  const { currentOrder } = useCurrentOrder();
  const { stateManager } = useStateManager();
  const [invoiceAddress, setInvoiceAddress] = useState<AddressDetails>(
    new AddressDetails(),
  );
  const [errorMsg, setErrorMsg] = useState<null | string>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (countdown === 900) {
      // Start checkout timer as soon as user lands on this screen, which is immediately after items are committed.
      startTimer();
      console.log("Timer started.");
    }
  }, []);

  useEffect(() => {
    currentOrder?.InvoiceAddress &&
      setInvoiceAddress(currentOrder.InvoiceAddress);
  }, [currentOrder]);

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
      warning = "Must include postal code";
    } else if (!invoiceAddress.EmailAddress.length) {
      warning = "Must include email";
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
    setInvoiceAddress(newAddress);
  }

  async function onSubmitForm() {
    if (!stateManager) {
      warn("stateManager is undefined");
      return;
    }
    try {
      const warning = checkRequiredFields();
      if (warning) {
        globalThis.scrollTo({ top: 0, behavior: "smooth" });

        return setValidationError(warning);
      }
      if (!currentOrder) {
        throw new Error("No committed order ID found");
      }
      if (invoiceAddress !== currentOrder.InvoiceAddress) {
        await stateManager.set(
          ["Orders", currentOrder.ID, "InvoiceAddress"],
          invoiceAddress,
        );
        debug("Shipping details updated");
      }
      setStep(CheckoutStep.paymentDetails);
    } catch (error: unknown) {
      errlog("error updating shipping details", error);
      setErrorMsg("Error updating shipping details");
    }
  }

  return (
    <section className="md:flex justify-center">
      <section className="md:w-[900px]" data-testid="shipping-details">
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
              className="border-2 border-solid mt-1 p-3 rounded-2xl"
              id="name"
              name="name"
              data-testid="name"
              value={invoiceAddress.Name}
              onChange={(e) => handleFormChange("Name", e.target.value)}
            />
            <label htmlFor="address">Address</label>
            <input
              className="border-2 border-solid mt-1 p-3 rounded-2xl"
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
                  className="border-2 border-solid mt-1 p-3 rounded-2xl	w-full"
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
                  className="border-2 border-solid mt-1 p-3 rounded-2xl	w-full"
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
              className="border-2 border-solid mt-1 p-3 rounded-2xl"
              id="country"
              name="country"
              data-testid="country"
              value={invoiceAddress.Country}
              onChange={(e) => handleFormChange("Country", e.target.value)}
            />
            <h2 className="my-3">Contact detail</h2>
            <p>
              Let the seller contact you if there is an issue with the order
              (Recommended).
            </p>
            <div className="mt-3 flex flex-col">
              <label htmlFor="email">Email</label>
              <input
                className="border-2 border-solid mt-1 p-3 rounded-2xl"
                id="email"
                name="email"
                data-testid="email"
                value={invoiceAddress.EmailAddress}
                onChange={(e) =>
                  handleFormChange("EmailAddress", e.target.value)}
              />
              <label htmlFor="phoneNumber">Phone Number (optional)</label>
              <input
                className="border-2 border-solid mt-1 p-3 rounded-2xl"
                id="phone"
                name="phone"
                data-testid="phone"
                value={invoiceAddress.PhoneNumber}
                onChange={(e) =>
                  handleFormChange("PhoneNumber", e.target.value)}
              />
            </div>
            <div className="mt-3">
              <Button onClick={onSubmitForm}>Payment options</Button>
            </div>
          </form>
          <section className="hidden md:block">
            <h1 className="pl-5">Order Summary</h1>
            <Cart showActionButtons={false} />
          </section>
        </section>
      </section>
    </section>
  );
}

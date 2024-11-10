// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

import { assert, logger } from "@massmarket/utils";

import { CheckoutStep, type ShippingDetails } from "@/types";
import { useStoreContext } from "@/context/StoreContext";
import { useUserContext } from "@/context/UserContext";
import Button from "@/app/common/components/Button";
import ErrorMessage from "@/app/common/components/ErrorMessage";
import BackButton from "@/app/common/components/BackButton";
import TimerToast from "@/app/components/checkout/TimerToast";
import ValidationWarning from "@/app/common/components/ValidationWarning";

const namespace = "frontend:ShippingDetails";
const debug = logger(namespace);
const errlog = logger(namespace, "error");

function ShippingDetails({
  setStep,
  startTimer,
  countdown,
}: {
  setStep: Dispatch<SetStateAction<CheckoutStep>>;
  startTimer: () => void;
  countdown: number;
}) {
  const { clientWithStateManager } = useUserContext();
  const { committedOrderId } = useStoreContext();

  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [postalCode, setPostal] = useState("");
  const [country, setCountry] = useState("");
  const [phoneNumber, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState<null | string>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (countdown === 900) {
      // Start checkout timer as soon as user lands on this screen, which is immediately after items are committed.
      startTimer();
      console.log("Timer started.");
    }
  }, []);

  function checkRequiredFields() {
    let warning = null;
    if (!name.length) {
      warning = "Must include name";
    } else if (!address.length) {
      warning = "Must include address";
    } else if (!country.length) {
      warning = "Must include country";
    } else if (!postalCode.length) {
      warning = "Must include postal code";
    } else if (!city.length) {
      warning = "Must include postal code";
    }
    return warning;
  }

  async function onUpdateShipping() {
    try {
      const warning = checkRequiredFields();
      if (warning) {
        return setValidationError(warning);
      }
      if (!committedOrderId) {
        throw new Error("No committed order ID found");
      }
      const update: Partial<ShippingDetails> = {
        name,
        address1: address,
        country,
        city,
        postalCode,
      };

      if (phoneNumber.length) {
        update.phoneNumber = phoneNumber;
      }
      if (email.length) {
        update.emailAddress = email;
      }
      await clientWithStateManager.stateManager.orders.updateShippingDetails(
        committedOrderId,
        update,
      );
      debug("Shipping details updated");
      setStep(CheckoutStep.paymentDetails);
    } catch (error: unknown) {
      assert(error instanceof Error, "Error is not an instance of Error");
      errlog("error updating shipping details", error);
      setErrorMsg("Error updating shipping details");
    }
  }

  return (
    <main>
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
      <div className="flex mb-2">
        <h1>Shipping details</h1>
      </div>
      <TimerToast />
      <section className="mt-2 flex flex-col gap-4 bg-white p-5 rounded-lg">
        <form
          className="flex flex-col"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <label htmlFor="name">Name</label>
          <input
            className="border-2 border-solid mt-1 p-3 rounded-2xl"
            id="name"
            name="name"
            data-testid="name"
            onChange={(e) => setName(e.target.value)}
          />
          <label htmlFor="address">Address</label>
          <input
            className="border-2 border-solid mt-1 p-3 rounded-2xl"
            id="address"
            name="address"
            data-testid="address"
            onChange={(e) => setAddress(e.target.value)}
          />
          <div className="flex gap-2">
            <div>
              <label htmlFor="city">City</label>
              <input
                className="border-2 border-solid mt-1 p-3 rounded-2xl	w-full"
                id="city"
                name="city"
                data-testid="city"
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="postal">Zip/Postal</label>
              <input
                className="border-2 border-solid mt-1 p-3 rounded-2xl	w-full"
                id="zip"
                name="zip"
                data-testid="zip"
                onChange={(e) => setPostal(e.target.value)}
              />
            </div>
          </div>

          <label htmlFor="country">Country</label>
          <input
            className="border-2 border-solid mt-1 p-3 rounded-2xl"
            id="country"
            name="country"
            data-testid="country"
            onChange={(e) => setCountry(e.target.value)}
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
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              className="border-2 border-solid mt-1 p-3 rounded-2xl"
              id="phone"
              name="phone"
              data-testid="phone"
              onChange={(e) => setNumber(e.target.value)}
            />
          </div>
        </form>
        <Button onClick={onUpdateShipping}>Payment options</Button>
      </section>
    </main>
  );
}

export default ShippingDetails;

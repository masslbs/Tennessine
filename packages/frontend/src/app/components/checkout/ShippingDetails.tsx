// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";
import React, { useState, Dispatch, SetStateAction } from "react";
import debugLib from "debug";

import { OrderState, CheckoutStep } from "@/types";
import { useUserContext } from "@/context/UserContext";
import Button from "@/app/common/components/Button";
import ErrorMessage from "@/app/common/components/ErrorMessage";
import BackButton from "@/app/common/components/BackButton";

const debug = debugLib("frontend:ShippingDetails");
const log = debugLib("log:ShippingDetails");
log.color = "242";

function ShippingDetails({
  setStep,
}: {
  setStep: Dispatch<SetStateAction<CheckoutStep>>;
}) {
  const { clientWithStateManager } = useUserContext();

  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [postalCode, setPostal] = useState("");
  const [country, setCountry] = useState("");
  const [phoneNumber, setNumber] = useState("");
  const [errorMsg, setErrorMsg] = useState<null | string>(null);

  async function onUpdateShipping() {
    try {
      const committed =
        await clientWithStateManager!.stateManager!.orders.getStatus(
          OrderState.STATE_COMMITED,
        );
      if (!committed?.length) {
        throw new Error("Committed order not found");
      } else if (committed?.length > 1) {
        throw new Error("Multiple committed orders");
      }
      await clientWithStateManager!.stateManager!.orders.updateShippingDetails(
        committed[0],
        {
          name,
          address1: address,
          country,
          city,
          postalCode,
          phoneNumber,
          //TOOD: user input for email.
          emailAddress: "example@example.com",
        },
      );
      log("Shipping details updated");
      setStep(CheckoutStep.paymentDetails);
    } catch (error) {
      debug(error);
      setErrorMsg("Error updating shipping details");
    }
  }

  return (
    <section>
      <BackButton onClick={() => setStep(CheckoutStep.cart)} />
      <ErrorMessage
        errorMessage={errorMsg}
        onClose={() => {
          setErrorMsg(null);
        }}
      />
      <div className="flex">
        <h1>Shipping details</h1>
      </div>
      <section className="mt-2 flex flex-col gap-4 bg-white p-5 rounded-lg">
        <form
          className="flex flex-col"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <label htmlFor="price">Name</label>
          <input
            className="border-2 border-solid mt-1 p-3 rounded-2xl"
            id="name"
            name="name"
            data-testid="name"
            onChange={(e) => setName(e.target.value)}
          />
          <label htmlFor="price">Address</label>
          <input
            className="border-2 border-solid mt-1 p-3 rounded-2xl"
            id="address"
            name="address"
            data-testid="address"
            onChange={(e) => setAddress(e.target.value)}
          />
          <div className="flex gap-2">
            <div>
              <label htmlFor="price">City</label>
              <input
                className="border-2 border-solid mt-1 p-3 rounded-2xl	w-full"
                id="city"
                name="city"
                data-testid="city"
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="price">Zip/Postal</label>
              <input
                className="border-2 border-solid mt-1 p-3 rounded-2xl	w-full"
                id="zip"
                name="zip"
                data-testid="zip"
                onChange={(e) => setPostal(e.target.value)}
              />
            </div>
          </div>

          <label htmlFor="price">Country</label>
          <input
            className="border-2 border-solid mt-1 p-3 rounded-2xl"
            id="country"
            name="country"
            data-testid="country"
            onChange={(e) => setCountry(e.target.value)}
          />
          <label htmlFor="price">Phone Number</label>
          <input
            className="border-2 border-solid mt-1 p-3 rounded-2xl"
            id="phone"
            name="phone"
            data-testid="phone"
            onChange={(e) => setNumber(e.target.value)}
          />
        </form>
        <Button onClick={onUpdateShipping}>Payment options</Button>
      </section>
    </section>
  );
}

export default ShippingDetails;

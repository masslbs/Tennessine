// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";
import React, { Dispatch, SetStateAction } from "react";
import Button from "@/app/common/components/Button";

const ShippingDetails = ({
  checkout,
  setCity,
  setName,
  setAddress,
  setPostal,
  setCountry,
  setNumber,
}: {
  checkout: () => void;
  setCity: Dispatch<SetStateAction<string>>;
  setName: Dispatch<SetStateAction<string>>;
  setAddress: Dispatch<SetStateAction<string>>;
  setPostal: Dispatch<SetStateAction<string>>;
  setCountry: Dispatch<SetStateAction<string>>;
  setNumber: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <div className="mt-4 flex flex-col gap-4">
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

      <Button onClick={checkout}>Checkout</Button>
    </div>
  );
};

export default ShippingDetails;

// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import { useStoreContext } from "@/context/StoreContext";
import React from "react";

const CurrencyChange = ({ open }: { open: boolean }) => {
  if (!open) return null;
  const { acceptedCurrencies, selectedCurrency, setSelectedCurrency } =
    useStoreContext();
  const currencies = Array.from([...acceptedCurrencies.keys()]);
  const renderCurrencies = () => {
    return currencies.map((a, i) => (
      <button onClick={() => setSelectedCurrency(a)} key={i}>
        <p
          className={`${a === selectedCurrency ? "bg-black text-white" : "bg-primary-gray"} w-fit px-2 py-1 rounded-lg`}
        >
          {acceptedCurrencies.get(a)}
        </p>
      </button>
    ));
  };

  return (
    <section className="bg-gray-300 p-4 border rounded-xl">
      <p>Choose any ERC20 token to preview and pay.</p>
      <section>
        <div className="mt-6">
          <p>choose currency</p>
          <div className="flex gap-2">{renderCurrencies()}</div>
        </div>
      </section>
    </section>
  );
};

export default CurrencyChange;

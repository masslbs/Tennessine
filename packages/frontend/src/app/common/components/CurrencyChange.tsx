// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import { useStoreContext } from "@/context/StoreContext";
import { ShopCurrencies } from "@/types";
import React, { useEffect, useState } from "react";
import ErrorMessage from "@/app/common/components/ErrorMessage";
import debugLib from "debug";

const CurrencyChange = ({ open }: { open: boolean }) => {
  if (!open) return null;
  const debug = debugLib("frontend:currencyChange");

  const { selectedCurrency, setSelectedCurrency, stateManager } =
    useStoreContext();
  const [acceptedCurrencies, setAcceptedChain] = useState<ShopCurrencies[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    stateManager.manifest
      .get()
      .then((shopManifest) => {
        setAcceptedChain(shopManifest.acceptedCurrencies);
      })
      .then((e) => {
        setErrorMsg("Error while selecting payment currency");
        debug(e);
      });
  }, []);

  const renderCurrencies = () => {
    if (!acceptedCurrencies.length) return null;
    return acceptedCurrencies.map((c, i) => (
      <button onClick={() => setSelectedCurrency(c)} key={i}>
        <p
          className={`${c.address === selectedCurrency?.address ? "bg-black text-white" : "bg-primary-gray"} w-fit px-2 py-1 rounded-lg`}
        >
          {c.address}
        </p>
      </button>
    ));
  };

  return (
    <section className="bg-gray-300 p-4 border rounded-xl">
      <p>Choose any ERC20 token to preview and pay.</p>
      <section>
        <ErrorMessage
          errorMessage={errorMsg}
          onClose={() => {
            setErrorMsg(null);
          }}
        />
        <div className="mt-6">
          <p>choose currency</p>
          <div className="flex gap-2">{renderCurrencies()}</div>
        </div>
      </section>
    </section>
  );
};

export default CurrencyChange;

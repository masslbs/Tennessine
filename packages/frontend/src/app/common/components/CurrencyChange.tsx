// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import { useStoreContext } from "@/context/StoreContext";
import { ShopCurrencies } from "@/types";
import React, { useEffect, useState } from "react";

const CurrencyChange = ({ open }: { open: boolean }) => {
  if (!open) return null;
  const { selectedCurrency, setSelectedCurrency, stateManager } =
    useStoreContext();
  const [acceptedCurrencies, setAcceptedChain] = useState<ShopCurrencies[]>([]);

  useEffect(() => {
    (async () => {
      const shopManifest = await stateManager.manifest.get();
      setAcceptedChain(shopManifest.acceptedCurrencies);
    })();
  }, []);

  const renderCurrencies = () => {
    if (!acceptedCurrencies.length) return null;
    return acceptedCurrencies.map((c, i) => (
      <button onClick={() => setSelectedCurrency(c)} key={i}>
        <p
          className={`${c.tokenAddr === selectedCurrency?.tokenAddr ? "bg-black text-white" : "bg-primary-gray"} w-fit px-2 py-1 rounded-lg`}
        >
          {c.tokenAddr}
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

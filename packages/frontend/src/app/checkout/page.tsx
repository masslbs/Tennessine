// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

import { OrderState, Order } from "@/types";
import { useUserContext } from "@/context/UserContext";
import Cart from "@/app/cart/Cart";
import ErrorMessage from "@/app/common/components/ErrorMessage";
import ShippingDetails from "@/app/components/checkout/ShippingDetails";
import ChoosePayment from "@/app/components/checkout/ChoosePayment";

const debug = debugLib("frontend:checkout");

const CheckoutFlow = () => {
  const { clientWithStateManager } = useUserContext();

  const [step, setStep] = useState<
    "cart" | "shipping details" | "payment details" | "confirmation"
  >("shipping details");
  const [errorMsg, setErrorMsg] = useState<null | string>(null);
  const [cryptoTotal, setCryptoTotal] = useState<bigint | null>(null);
  const [purchaseAddress, setPurchaseAddr] = useState<string | null>(null);
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [postalCode, setPostal] = useState("");
  const [country, setCountry] = useState("");
  const [phoneNumber, setNumber] = useState("");
  const [confirmedTxHash, setConfirmedTxHash] = useState<null | `0x${string}`>(
    null,
  );
  const [erc20Amount, setErc20Amount] = useState<null | string>(null);
  const [symbol, setSymbol] = useState<null | string>(null);
  const [openCurrencySelection, setOpen] = useState(false);
  const [orderId, setOrderId] = useState<OrderId | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const chains = useChains();

  const currencyToggle = () => {
    setOpen(!openCurrencySelection);
  };
  const copyToClipboard = () => {
    navigator.clipboard.writeText(purchaseAddress!);
  };
  useEffect(() => {
    getOrderId()
      .then((id) => {
        if (id) {
          setOrderId(id);
          stateManager.orders
            .get(id)
            .then((order) => {
              setCurrentOrder(order);
            })
        }
      })
  }, []);

  useEffect(() => {
    const txHashDetected = (order: Order) => {
      if (order.status === OrderState.STATE_PAYMENT_TX) {
        const tx = order.txHash as `0x${string}`;
        const bh = order.blockHash as `0x${string}`;
        tx && setTxHash(tx);
        bh && setBlockHash(bh);
        setStep("confirmation");
      }
    };

    clientWithStateManager!.stateManager!.orders.on(
      "addPaymentTx",
      txHashDetected,
    );
    return () => {
      // Cleanup listeners on unmount
      clientWithStateManager!.stateManager!.orders.removeListener(
        "addPaymentTx",
        txHashDetected,
      );
    };
  });

  function renderContent() {
    if (step === "cart") {
      return <Cart />;
    }
    if (step === "shipping details") {
      return <ShippingDetails setStep={setStep} />;
    } else if (step === "payment details") {
      return (
        <ChoosePayment
          setStep={setStep}
          setDisplayedAmount={setDisplayedAmount}
          displayedAmount={displayedAmount}
        />
      );
    } else {
      return (
        <section>
          <section className="mt-2 flex flex-col gap-4 bg-white p-5 rounded-lg items-center">
            <Image
              src="/icons/smiley.svg"
              width={80}
              height={80}
              alt="smiley-icon"
              unoptimized={true}
              className="w-20 h-20"
            />
            <h1>Payment Successful</h1>
            <div className="flex gap-2 items-center">
              <Image
                src="/icons/usdc-coin.png"
                alt="coin"
                width={24}
                height={24}
                unoptimized={true}
                className="w-6 h-6 max-h-6"
              />
              <h1>{displayedAmount}</h1>
            </div>
            <p>Your order has been completed.</p>
            <div className="flex-col items-center gap-2 flex">
              {txHash ? <p>Tx hash:</p> : <p>Block hash:</p>}
              <div className="bg-white w-fit p-2 border-2 rounded-xl shadow-lg flex gap-2">
                <p data-testid="hash">{txHash ? txHash : blockHash}</p>
              </div>
            </div>
          </section>
        </section>
      );
    }
  }

  return (
    <main className="pt-under-nav h-screen p-4 mt-5">
      <ErrorMessage
        errorMessage={errorMsg}
        onClose={() => {
          setErrorMsg(null);
        }}
      />
      {renderContent()}
    </main>
  );
};

export default CheckoutFlow;

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

const CheckoutFlow = () => {
  const { clientWithStateManager } = useUserContext();

  const [step, setStep] = useState<
    "cart" | "shipping details" | "payment details" | "confirmation"
  >("shipping details");
  const [errorMsg, setErrorMsg] = useState<null | string>(null);
  const [confirmedTxHash, setConfirmedTxHash] = useState<null | `0x${string}`>(
    null,
  );

  useEffect(() => {
    const txHashDetected = (order: Order) => {
      if (order.status === OrderState.STATE_PAYMENT_TX) {
        const h = order.txHash as `0x${string}`;
        setConfirmedTxHash(h);
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
      return <ChoosePayment setStep={setStep} />;
    } else {
      return (
        <div className="text-center">
          <h2>Thank you</h2>
          <div className="flex-col items-center gap-2 flex">
            <p>Tx hash:</p>
            <div className="bg-white w-fit p-2 border-2 rounded-xl shadow-lg flex gap-2">
              <p data-testid="txHash">{confirmedTxHash}</p>
              <button>
                <Image
                  src={"/assets/copy-icon.svg"}
                  width={15}
                  height={15}
                  alt="item-thumbnail"
                  unoptimized={true}
                />
              </button>
            </div>
          </div>
        </div>
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

// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { logger } from "@massmarket/utils";

import { CheckoutStep, Order, OrderId, OrderState } from "@/types";
import { useUserContext } from "@/context/UserContext";
import { useStoreContext } from "@/context/StoreContext";
import Cart from "@/app/cart/Cart";
import ErrorMessage from "@/app/common/components/ErrorMessage";
import ShippingDetails from "@/app/components/checkout/ShippingDetails";
import ChoosePayment from "@/app/components/checkout/ChoosePayment";
import TimerExpiration from "@/app/components/checkout/TimerExpiration";

const namespace = "frontend:Checkout";
const debug = logger(namespace);
const logerr = logger(namespace, "error");

const CheckoutFlow = () => {
  const { clientWithStateManager } = useUserContext();
  const { setCommittedOrderId } = useStoreContext();

  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step") as CheckoutStep;

  const [step, setStep] = useState<CheckoutStep>(
    stepParam ?? CheckoutStep.cart,
  );
  const [errorMsg, setErrorMsg] = useState<null | string>(null);
  const [txHash, setTxHash] = useState<null | `0x${string}`>(null);
  const [blockHash, setBlockHash] = useState<null | `0x${string}`>(null);
  const [displayedAmount, setDisplayedAmount] = useState<null | string>(null);
  //Setting timer for 15 minutes
  const [countdown, setCountdown] = useState(900);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId;

    if (isRunning && countdown > 0) {
      intervalId = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setStep(CheckoutStep.expired);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning, countdown]);

  useEffect(() => {
    const txHashDetected = (order: Order) => {
      if (order.status === OrderState.STATE_PAYMENT_TX) {
        const tx = order.txHash as `0x${string}`;
        const bh = order.blockHash as `0x${string}`;
        tx && setTxHash(tx);
        bh && setBlockHash(bh);
        debug(`Hash received: ${tx ?? bh}`);
        setCommittedOrderId(null);
        setStep(CheckoutStep.confirmation);
      }
    };

    clientWithStateManager.stateManager.orders.on(
      "addPaymentTx",
      txHashDetected,
    );
    return () => {
      // Cleanup listeners on unmount
      clientWithStateManager.stateManager.orders.removeListener(
        "addPaymentTx",
        txHashDetected,
      );
    };
  });

  function startTimer() {
    setIsRunning(true);
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(txHash || blockHash || "");
  }

  async function onCheckout(orderId: OrderId) {
    if (!orderId) {
      throw new Error("No orderId");
    }
    try {
      await clientWithStateManager.stateManager.orders.commit(orderId);
      debug(`Order ID: ${orderId} committed`);
      setCommittedOrderId(orderId);
      setStep(CheckoutStep.shippingDetails);
    } catch (error) {
      logerr("Error during checkout", error);
      throw error;
    }
  }

  function renderContent() {
    if (step === CheckoutStep.cart) {
      return (
        <section>
          <Cart onCheckout={onCheckout} />
        </section>
      );
    }
    if (step === CheckoutStep.shippingDetails) {
      return (
        <ShippingDetails
          setStep={setStep}
          startTimer={startTimer}
          countdown={countdown}
        />
      );
    } else if (step === CheckoutStep.paymentDetails) {
      return (
        <ChoosePayment
          setStep={setStep}
          setDisplayedAmount={setDisplayedAmount}
          displayedAmount={displayedAmount}
        />
      );
    } else if (step === CheckoutStep.expired) {
      return <TimerExpiration />;
    } else {
      return (
        <section>
          <section className="mt-2 flex flex-col gap-4 bg-white p-5 rounded-lg items-center">
            <img
              src="/icons/smiley.svg"
              width={80}
              height={80}
              alt="smiley-icon"
              className="w-20 h-20"
            />
            <h1>Payment Successful</h1>
            <div className="flex gap-2 items-center">
              <img
                src="/icons/usdc-coin.png"
                alt="coin"
                width={24}
                height={24}
                className="w-6 h-6 max-h-6"
              />
              <h1>{displayedAmount}</h1>
            </div>
            <p>Your order has been completed.</p>
            <div className="flex-col items-center gap-2 flex">
              {txHash ? <p>Tx hash:</p> : <p>Block hash:</p>}
              <div className="flex gap-2">
                <input
                  className="border-2 border-solid mt-1 p-2 rounded"
                  id="txHash"
                  name="txHash"
                  value={txHash || blockHash || ""}
                  onChange={() => {
                    console.log("hash copied");
                  }}
                />
                <button className="mr-4" onClick={copyToClipboard}>
                  <img
                    src="/icons/copy-icon.svg"
                    width={14}
                    height={14}
                    alt="copy-icon"
                    className="w-auto h-auto"
                  />
                </button>
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

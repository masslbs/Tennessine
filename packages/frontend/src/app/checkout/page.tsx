// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

import { logger } from "@massmarket/utils";

import { OrderState, Order, CheckoutStep, OrderId } from "@/types";
import { useUserContext } from "@/context/UserContext";
import { useStoreContext } from "@/context/StoreContext";
import Cart from "@/app/cart/Cart";
import ErrorMessage from "@/app/common/components/ErrorMessage";
import ShippingDetails from "@/app/components/checkout/ShippingDetails";
import ChoosePayment from "@/app/components/checkout/ChoosePayment";

const debug = logger("frontend:Checkout");
const log = logger("log:Checkout", "info");

const CheckoutFlow = () => {
  const { clientWithStateManager } = useUserContext();
  const { setCommittedOrderId } = useStoreContext();

  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step") as CheckoutStep;
  log(`Starting checkout flow: ${stepParam}`);

  const [step, setStep] = useState<CheckoutStep>(
    stepParam ?? CheckoutStep.cart,
  );
  const [errorMsg, setErrorMsg] = useState<null | string>(null);
  const [txHash, setTxHash] = useState<null | `0x${string}`>(null);
  const [blockHash, setBlockHash] = useState<null | `0x${string}`>(null);
  const [displayedAmount, setDisplayedAmount] = useState<null | string>(null);

  useEffect(() => {
    const txHashDetected = (order: Order) => {
      if (order.status === OrderState.STATE_PAYMENT_TX) {
        const tx = order.txHash as `0x${string}`;
        const bh = order.blockHash as `0x${string}`;
        tx && setTxHash(tx);
        bh && setBlockHash(bh);
        log(`Hash received: ${tx ?? bh}`);
        setCommittedOrderId(null);
        setStep(CheckoutStep.confirmation);
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

  function copyToClipboard() {
    navigator.clipboard.writeText(txHash || blockHash || "");
  }

  async function onCheckout(orderId: OrderId) {
    try {
      if (!orderId) {
        debug("orderId not found");
        throw new Error("No order found");
      }
      await clientWithStateManager!.stateManager!.orders.commit(orderId);
      log(`Order ID: ${orderId} committed`);
      setCommittedOrderId(orderId);
      setStep(CheckoutStep.shippingDetails);
    } catch (error) {
      debug(error);
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
      return <ShippingDetails setStep={setStep} />;
    } else if (step === CheckoutStep.paymentDetails) {
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
                  <Image
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

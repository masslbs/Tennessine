// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import debugLib from "debug";

import { OrderState, Order, OrderId } from "@/types";
import { useStoreContext } from "@/context/StoreContext";
import { useUserContext } from "@/context/UserContext";
import Cart from "@/app/cart/Cart";
import ErrorMessage from "@/app/common/components/ErrorMessage";
import ShippingDetails from "@/app/components/checkout/ShippingDetails";
import ChoosePayment from "@/app/components/checkout/ChoosePayment";

const CheckoutFlow = () => {
  const { getOrderId } = useStoreContext();
  const { clientWithStateManager } = useUserContext();
  const debug = debugLib("frontend:checkout");

  const [step, setStep] = useState<
    "cart" | "shipping details" | "payment details" | "confirmation"
  >("shipping details");
  const [errorMsg, setErrorMsg] = useState<null | string>(null);
  const [confirmedTxHash, setConfirmedTxHash] = useState<null | `0x${string}`>(
    null,
  );
  const [orderId, setOrderId] = useState<OrderId | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  useEffect(() => {
    getOrderId()
      .then((id) => {
        if (id) {
          setOrderId(id);
          clientWithStateManager!
            .stateManager!.orders.get(id)
            .then((order) => {
              setCurrentOrder(order);
            })
            .catch((e) => {
              debug(e);
            });
        }
      })
      .catch((e) => {
        debug(e);
      });
  }, []);

  useEffect(() => {
    const txHashDetected = (order: Order) => {
      if (order.id === orderId) {
        setCurrentOrder(order);
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

  useEffect(() => {
    if (currentOrder && currentOrder.status === OrderState.STATE_PAYMENT_TX) {
      const h = currentOrder.txHash as `0x${string}`;
      setOrderId(null);
      setConfirmedTxHash(h);
      setStep("confirmation");
    }
  }, [currentOrder]);

  async function checkout(orderId: OrderId) {}

  function renderContent() {
    if (step === "cart") {
      return <Cart onCheckout={checkout} />;
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

// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { useEffect, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";

import { assert, logger } from "@massmarket/utils";
import { Order } from "@massmarket/schema";

import {
  CheckoutStep,
  OrderEventTypes,
  OrderId,
  OrderState,
} from "../../types.ts";
import Cart from "./Cart.tsx";
import ErrorMessage from "../common/ErrorMessage.tsx";
import ShippingDetails from "./ShippingDetails.tsx";
import ChoosePayment from "./ChoosePayment.tsx";
import TimerExpiration from "./TimerExpiration.tsx";
import { useClientWithStateManager } from "../../hooks/useClientWithStateManager.ts";
import { useCurrentOrder } from "../../hooks/useCurrentOrder.ts";
import PaymentConfirmation from "./PaymentConfirmation.tsx";
import { cancelAndCreateOrder } from "../../utils/helper.ts";

const namespace = "frontend:Checkout";
const debug = logger(namespace);
const logerr = logger(namespace, "error");

export default function CheckoutFlow() {
  const { clientStateManager } = useClientWithStateManager();
  const { currentOrder } = useCurrentOrder();

  const search = useSearch({ strict: false });
  const navigate = useNavigate();
  const step = search?.step as CheckoutStep || CheckoutStep.cart;

  const [errorMsg, setErrorMsg] = useState<null | string>(null);
  const [txHash, setTxHash] = useState<null | `0x${string}`>(null);
  const [blockHash, setBlockHash] = useState<null | `0x${string}`>(null);
  const [displayedAmount, setDisplayedAmount] = useState<null | string>(null);
  //Setting timer for 15 minutes
  const [countdown, setCountdown] = useState(900);
  const [isRunning, setIsRunning] = useState(false);

  const sm = clientStateManager?.stateManager;

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    if (isRunning && countdown > 0) {
      intervalId = setInterval(() => {
        setCountdown((prev: number) => prev - 10);
      }, 10000);
    } else if (countdown === 0) {
      cancelAndCreateOrder(currentOrder!.orderId, clientStateManager!)
        .then()
        .catch((e) => {
          logerr("Error cancelling order", e);
        });
      setStep(CheckoutStep.expired);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning, countdown]);

  useEffect(() => {
    function txHashDetected(o: Map<string, unknown>) {
      const order = new Order(o);
      if (order.TxDetails) {
        const tx = order.TxDetails.TxHash;
        const bh = order.TxDetails.blockHash;
        tx && setTxHash(tx);
        bh && setBlockHash(bh);
        debug(`Hash received: ${tx ?? bh}`);
        setStep(CheckoutStep.confirmation);
      }
    }

    sm.events.on(txHashDetected, ["Orders", currentOrder!.orderId]);
    return () => {
      sm.events.off(
        txHashDetected,
        ["Orders", currentOrder!.orderId],
      );
    };
  }, [currentOrder]);

  function setStep(step: CheckoutStep) {
    navigate({
      to: "/checkout",
      search: (prev: Record<string, string>) => ({
        shopId: prev.shopId,
        step,
      }),
    });
  }

  function startTimer() {
    setIsRunning(true);
  }

  async function onCheckout(orderId: OrderId) {
    if (!orderId) {
      throw new Error("No orderId");
    }
    try {
      // Commit the order if it is not already committed
      if (currentOrder!.status !== OrderState.STATE_COMMITTED) {
        await sm.set(
          ["Orders", orderId, "State"],
          OrderState.STATE_COMMITTED,
        );
        debug(`Order ID: ${orderId} committed`);
      }
      setStep(CheckoutStep.shippingDetails);
    } catch (error: unknown) {
      assert(error instanceof Error, "Error is not an instance of Error");
      logerr("Error during checkout", error);
      throw error;
    }
  }

  function renderContent() {
    if (step === CheckoutStep.cart) {
      return (
        <section data-testid="cart">
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
    } else if (step === CheckoutStep.confirmation && displayedAmount) {
      return (
        <PaymentConfirmation
          displayedAmount={displayedAmount}
          hash={txHash || blockHash}
        />
      );
    } else {
      logerr("Invalid step", new Error(`Invalid step: ${step}`));
      return <p>Something went wrong</p>;
    }
  }
  return (
    <main
      className="pt-under-nav p-4"
      data-testid="checkout-screen"
    >
      <ErrorMessage
        errorMessage={errorMsg}
        onClose={() => {
          setErrorMsg(null);
        }}
      />
      {renderContent()}
    </main>
  );
}

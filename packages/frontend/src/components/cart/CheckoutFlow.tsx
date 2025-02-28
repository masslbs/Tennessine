// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { useEffect, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";

import { assert, logger } from "@massmarket/utils";

import {
  CheckoutStep,
  ListingId,
  Order,
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

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    if (isRunning && countdown > 0) {
      intervalId = setInterval(() => {
        setCountdown((prev: number) => prev - 10);
      }, 10000);
    } else if (countdown === 0) {
      cancelAndCreateOrder()
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
    function txHashDetected(res: [OrderEventTypes, Order]) {
      if (res[0] === OrderEventTypes.PAYMENT_TX) {
        const order = res[1];
        const tx = order.txHash as `0x${string}`;
        const bh = order.blockHash as `0x${string}`;
        tx && setTxHash(tx);
        bh && setBlockHash(bh);
        debug(`Hash received: ${tx ?? bh}`);
        setStep(CheckoutStep.confirmation);
      }
    }

    clientStateManager!.stateManager.orders.on("update", txHashDetected);
    return () => {
      // Cleanup listeners on unmount
      clientStateManager!.stateManager.orders.removeListener(
        "update",
        txHashDetected,
      );
    };
  });

  function setStep(step: CheckoutStep) {
    navigate({
      to: "/checkout",
      search: (prev: Record<string, string>) => ({
        shopId: prev.shopId,
        step,
      }),
    });
  }

  async function cancelAndCreateOrder() {
    debug(`Cancelling order ID: ${currentOrder!.orderId}`);
    const sm = clientStateManager!.stateManager;
    const [_type, cancelledOrder] = await sm.orders.cancel(
      currentOrder!.orderId,
    );
    // Once order is cancelled, create a new order and add the same items.
    const newOrder = await sm.orders.create();
    debug("New order created");
    const listingsToAdd = Object.entries(cancelledOrder.items).map(
      ([listingId, quantity]) => {
        return {
          listingId: listingId as ListingId,
          quantity,
        };
      },
    );
    await sm.orders.addItems(newOrder.id, listingsToAdd);
    debug("Listings added to new order");
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
        await clientStateManager!.stateManager.orders.commit(orderId);
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
      className="pt-under-nav p-4 min-h-screen"
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

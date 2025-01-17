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

const namespace = "frontend:Checkout";
const debug = logger(namespace);
const logerr = logger(namespace, "error");

export default function CheckoutFlow() {
  const { clientStateManager } = useClientWithStateManager();
  const { currentOrder } = useCurrentOrder();

  const search = useSearch({ strict: false });
  const navigate = useNavigate();

  const stepParam = search?.step as CheckoutStep;

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
        setCountdown((prev: number) => prev - 1);
      }, 1000);
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

  async function cancelAndCreateOrder() {
    const sm = clientStateManager!.stateManager;
    debug(`Cancelling order ID: ${currentOrder!.orderId}`);
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

  function copyToClipboard() {
    navigator.clipboard.writeText(txHash || blockHash || "");
  }

  async function onCheckout(orderId: OrderId) {
    if (!orderId) {
      throw new Error("No orderId");
    }
    try {
      // Commit the order if it is not already committed
      if (currentOrder!.status !== OrderState.STATE_COMMITED) {
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
    <main className="pt-under-nav p-4 mt-5 min-h-screen">
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

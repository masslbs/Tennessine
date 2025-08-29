import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { getLogger } from "@logtape/logtape";

import { useActiveOrder, useStateManager } from "@massmarket/react-hooks";
import { Listing } from "@massmarket/schema";
import { RelayResponseError } from "@massmarket/client";

import { OrderPaymentState } from "../../types.ts";
import CartItems from "./CartItems.tsx";
import BackButton from "../common/BackButton.tsx";
import Button from "../common/Button.tsx";
import ErrorMessage from "../common/ErrorMessage.tsx";
import { getErrLogger } from "../../utils/helper.ts";

const baseLogger = getLogger(["mass-market", "frontend", "Checkout"]);

export default function Checkout() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [errorListing, setErrorListing] = useState<Listing | null>(null);
  const navigate = useNavigate();
  const { stateManager } = useStateManager();
  const { activeOrder } = useActiveOrder();

  const logError = getErrLogger(baseLogger, setErrorMsg);

  async function onCheckout() {
    try {
      await stateManager!.set(
        ["Orders", activeOrder!.ID, "PaymentState"],
        OrderPaymentState.Locked,
      );
      navigate({
        to: "/shipping",
        search: (prev: Record<string, string>) => ({
          shopId: prev.shopId,
        }),
      });
    } catch (error) {
      if (
        error instanceof RelayResponseError &&
        error.cause.code === 9 && error.cause.additionalInfo
      ) {
        const objectId = error.cause.additionalInfo.objectId;
        const l = await stateManager!.get(["Listings", objectId]);
        if (!l) throw new Error("Listing not found");
        const listing = Listing.fromCBOR(l);
        setErrorListing(listing);
        setErrorMsg(`Not enough stock for item: ${listing.Metadata.Title}`);
      } else {
        logError("Error checking out", error);
      }
    }
  }

  const MAX_TITLE_LEN = 20;

  const oosTitle = (errorListing?.Metadata.Title.length || 0) > MAX_TITLE_LEN
    ? errorListing?.Metadata.Title.slice(0, MAX_TITLE_LEN) + "..."
    : errorListing?.Metadata.Title;

  return (
    <main data-testid="checkout-screen" className="flex justify-center px-4">
      <section className="w-full md:w-140">
        <BackButton />
        <h1 className="my-[10px]">Checkout</h1>
        <CartItems />
        <div className="px-5 pb-5 bg-white rounded-b-lg">
          <Button
            disabled={!activeOrder}
            onClick={onCheckout}
          >
            <div className="flex items-center gap-2">
              <p>
                Shipping Details
              </p>
              <img
                src="/icons/white-arrow.svg"
                alt="white-arrow"
                width={7}
                height={12}
              />
            </div>
          </Button>
        </div>
      </section>
      <ErrorMessage
        errorMessage={errorMsg}
        onClose={() => {
          setErrorMsg(null);
          setErrorListing(null);
        }}
      />
      {errorListing && (
        <p data-testid="out-of-stock" className="my-2 text-red-500">
          Item <span className="font-bold">{oosTitle}</span>{" "}
          is out of stock. Please reduce quantity or remove from cart to
          proceed.
        </p>
      )}
    </main>
  );
}

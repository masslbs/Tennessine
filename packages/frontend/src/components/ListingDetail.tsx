// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { ChangeEvent, useEffect, useState } from "react";
import { Link, useSearch } from "@tanstack/react-router";
import { formatUnits } from "viem";
import { getLogger } from "@logtape/logtape";

import { Listing, Order, OrderedItem } from "@massmarket/schema";
import type { CodecValue } from "@massmarket/utils/codec";

import { ListingId, OrderState } from "../types.ts";
import Button from "./common/Button.tsx";
import BackButton from "./common/BackButton.tsx";
import { useStateManager } from "../hooks/useStateManager.ts";
import { useBaseToken } from "../hooks/useBaseToken.ts";
import { useKeycard } from "../hooks/useKeycard.ts";
import ErrorMessage from "./common/ErrorMessage.tsx";
import SuccessToast from "./common/SuccessToast.tsx";
import { useCurrentOrder } from "../hooks/useCurrentOrder.ts";
import { getErrLogger } from "../utils/helper.ts";
import ChevronRight from "./common/ChevronRight.tsx";

const baseLogger = getLogger(["mass-market", "frontend", "ListingDetail"]);

export default function ListingDetail() {
  const { baseToken } = useBaseToken();
  const { stateManager } = useStateManager();
  const [keycard] = useKeycard();
  const search = useSearch({ strict: false });
  const { currentOrder, createOrder, cancelAndRecreateOrder } =
    useCurrentOrder();
  const itemId = search.itemId as ListingId;
  const [listing, setListing] = useState<Listing>(new Listing());
  const [tokenIcon, setIcon] = useState("/icons/usdc-coin.png");
  const [quantity, setQuantity] = useState<number>(1);
  const [errorMsg, setErrorMsg] = useState<null | string>(null);
  const [successMsg, setMsg] = useState<string | null>(null);
  const [displayedImg, setDisplayedImg] = useState<number>(0);

  // set up the logger with information that will be included in error traces when crashes are reported.
  // note: take care with the type of information that is logged, only include traces that are helpful for debugging at
  // this early stage.
  const logger = baseLogger.with({
    listingId: itemId,
    orderId: currentOrder?.ID,
    keycardAddress: keycard?.address,
  });
  const logError = getErrLogger(logger, setErrorMsg);

  useEffect(() => {
    if (!(itemId && baseToken && stateManager)) {
      return;
    }
    //set item details
    stateManager
      ?.get(["Listings", itemId])
      .then((res: CodecValue | undefined) => {
        if (!res) {
          logger.info`Listing ${itemId} not found`;
          throw new Error(`Listing not found`);
        }
        const item = Listing.fromCBOR(res);
        setListing(item);

        if (baseToken?.symbol === "ETH") {
          setIcon("/icons/eth-coin.svg");
        }
      });
  }, [itemId, baseToken, stateManager]);

  if (!listing) {
    return (
      <main data-testid="listing-detail-page">
        <p>Item not found.</p>
      </main>
    );
  }

  function handlePurchaseQty(e: ChangeEvent<HTMLInputElement>) {
    const newValue = parseInt(e.target.value);
    setQuantity(newValue);
  }

  async function changeItems() {
    if (!stateManager) {
      return;
    }
    try {
      let orderId = currentOrder?.ID;
      if (!orderId) {
        await createOrder(itemId, quantity);
        if (quantity <= 1) {
          setMsg("Item added to cart");
        } else {
          setMsg(`${quantity} items added`);
        }
        return;
      }

      // Update existing order
      // If the order is not an open order, cancel it and create a new one
      if (currentOrder?.State !== OrderState.Open) {
        orderId = await cancelAndRecreateOrder();
      }

      if (!orderId) {
        throw new Error("Order ID is undefined");
      }

      const o = await stateManager.get(["Orders", orderId]);
      if (!o) {
        logger.info`Order ${orderId} not found`;
        throw new Error(`Order not found`);
      }
      const order: Order = Order.fromCBOR(o);
      let cartItemQuantity = 0;
      // If item already exists in the items array, filter it out so we can replace it with the new quantity
      const updatedOrderItems = (order.Items ?? []).filter(
        (item: OrderedItem) => {
          if (item.ListingID === itemId) {
            // this should never happen?
            if (cartItemQuantity !== 0) {
              logger.debug(
                "cart item quantity for the same item should not be changed more than at most once",
              );
            }
            cartItemQuantity = item.Quantity;
          }
          return item.ListingID !== itemId;
        },
      );
      // note: cartItemQuantity is 0 if this is the first time we add the item to our cart, and adding with 0 is fine :)
      updatedOrderItems.push(
        new OrderedItem(itemId, cartItemQuantity + quantity),
      );

      await stateManager.set(
        ["Orders", orderId, "Items"],
        // TODO: this is a bit of a hack, since StateManager doesnt handle BaseClass[]
        updatedOrderItems.map((item: OrderedItem) => item.asCBORMap()),
      );
      if (quantity <= 1) {
        setMsg("Cart updated");
      } else {
        setMsg(`${quantity} items added`);
      }
      setQuantity(1);
    } catch (error) {
      logError("There was an error updating cart", error);
    }
  }

  function splitTextByNewlines(input: string) {
    return input.split("\n");
  }

  const { Metadata, ID, Price } = listing;
  return (
    <main
      className="bg-gray-100 md:flex justify-center"
      data-testid="listing-detail-page"
    >
      <section className="flex flex-col md:w-[1000px] mx-4">
        <ErrorMessage
          errorMessage={errorMsg}
          onClose={() => {
            setErrorMsg(null);
          }}
        />
        <BackButton />
        <div className="my-[10px]">
          <h1 className="flex items-center" data-testid="title">
            {Metadata.Title}
          </h1>
          <div
            className={`mt-2 ${keycard.role === "merchant" ? "" : "hidden"}`}
          >
            <Button>
              <Link
                to="/edit-listing"
                search={(prev: Record<string, string>) => ({
                  shopId: prev.shopId,
                  itemId: ID,
                })}
                style={{
                  color: "white",
                }}
              >
                <div className="flex items-center gap-2">
                  <p>Edit product</p>
                  <ChevronRight hex="#FFF" />
                </div>
              </Link>
            </Button>
          </div>
        </div>
        <div className="md:flex md:gap-8">
          <div className="listing-image-container md:w-3/5 relative">
            {Metadata.Images?.length
              ? (
                <div>
                  <img
                    src={Metadata.Images?.[displayedImg]}
                    alt="product-detail-image"
                    className="rounded-lg w-full max-h-[340px] md:max-h-1/2 md:max-h-[380px]"
                    style={{
                      objectFit: "cover",
                      objectPosition: "center",
                      border: "none",
                    }}
                  />
                  <button
                    type="button"
                    className={`${
                      Metadata.Images?.length > 1
                        ? "absolute top-[170px] left-[15px]"
                        : "hidden"
                    }`}
                    onClick={() => {
                      setDisplayedImg(
                        (displayedImg - 1 + Metadata.Images!.length) %
                          Metadata.Images!.length,
                      );
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="23"
                      viewBox="0 0 12 23"
                      fill="none"
                    >
                      <path
                        d="M10.722 0.76123C11.0386 0.76123 11.3779 0.874331 11.6268 1.12315C12.1244 1.6208 12.1244 2.4125 11.6268 2.91015L3.05372 11.5058L11.6268 20.0789C12.1244 20.5765 12.1244 21.3682 11.6268 21.8659C11.1291 22.3635 10.3374 22.3635 9.83977 21.8659L0.361922 12.4106C0.113101 12.1618 -4.84492e-07 11.8451 -4.69661e-07 11.5058C-4.54829e-07 11.1665 0.135721 10.8498 0.361922 10.601L9.83977 1.12315C10.0886 0.874331 10.4053 0.76123 10.722 0.76123Z"
                        fill="black"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className={`${
                      Metadata.Images?.length > 1
                        ? "absolute top-[170px] right-[15px]"
                        : "hidden"
                    }`}
                    onClick={() => {
                      setDisplayedImg(
                        (displayedImg + 1) % Metadata.Images!.length,
                      );
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="23"
                      viewBox="0 0 12 23"
                      fill="none"
                    >
                      <path
                        d="M1.27804 22.2393C0.961357 22.2393 0.622055 22.1262 0.373233 21.8773C-0.124411 21.3797 -0.124411 20.588 0.373233 20.0903L8.94628 11.4947L0.373232 2.92163C-0.124412 2.42399 -0.124412 1.63228 0.373232 1.13464C0.870876 0.636995 1.66258 0.636995 2.16023 1.13464L11.6381 10.5899C11.8869 10.8387 12 11.1554 12 11.4947C12 11.834 11.8643 12.1507 11.6381 12.3995L2.16023 21.8773C1.9114 22.1262 1.59472 22.2393 1.27804 22.2393Z"
                        fill="black"
                      />
                    </svg>
                  </button>
                </div>
              )
              : null}
            {Metadata.Images?.length
              ? (
                <div className="flex mt-2 gap-2">
                  {Metadata.Images?.map((image: string, i: number) => {
                    if (i === displayedImg) return;
                    return (
                      <img
                        key={i}
                        src={image}
                        alt="product-detail-image"
                        width={90}
                        height={81}
                        className="border rounded-lg"
                        style={{
                          maxHeight: "81px",
                          maxWidth: "90px",
                          objectFit: "cover",
                          objectPosition: "center",
                          border: "none",
                        }}
                        onClick={() => setDisplayedImg(i)}
                      />
                    );
                  })}
                </div>
              )
              : null}
          </div>
          <section className="flex gap-4 flex-col bg-white mt-5 md:mt-0 rounded-md md:w-2/5 p-4">
            <div>
              <h3 className="font-bold">Description</h3>
              <section data-testid="description" className="mt-5">
                {splitTextByNewlines(Metadata.Description).map(
                  (line: string, index: number) => (
                    <p
                      key={`description-${index}`}
                      className="min-h-[1ch] font-light"
                    >
                      {line}
                    </p>
                  ),
                )}
              </section>
            </div>
            <div className="flex gap-2 items-center mt-auto">
              <img
                src={tokenIcon}
                alt="coin"
                width={24}
                height={24}
                className="w-6 h-6 max-h-6"
              />
              <h1 data-testid="price">
                {formatUnits(Price, baseToken.decimals)}
              </h1>
            </div>
            <div
              className={keycard.role === "merchant" ? "hidden" : "flex gap-2"}
            >
              <div>
                <p className="text-xs text-primary-gray mb-2">Quantity</p>
                <input
                  className="mt-1 p-2 rounded-md max-w-[80px]"
                  style={{ backgroundColor: "#F3F3F3" }}
                  id="quantity"
                  name="quantity"
                  value={quantity}
                  data-testid="purchaseQty"
                  type="number"
                  min="1"
                  step="1"
                  onChange={(e) => handlePurchaseQty(e)}
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={changeItems}
                  disabled={!quantity}
                  data-testid="addToCart"
                >
                  <div className="flex items-center gap-2">
                    <p>Add to cart</p>
                    <img
                      src="/icons/white-arrow.svg"
                      alt="white-arrow"
                      width={7}
                      height={12}
                      style={{ display: quantity ? "" : "none" }}
                    />
                  </div>
                </Button>
              </div>
            </div>
            <div className="h-6 mb-4">
              <SuccessToast
                message={successMsg}
                onClose={() => setMsg(null)}
                cta={{ copy: "View Cart", href: "/cart" }}
              />
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

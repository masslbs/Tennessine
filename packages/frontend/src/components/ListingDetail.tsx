// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { ChangeEvent, useEffect, useState } from "react";
import { Link, useLocation, useSearch } from "@tanstack/react-router";
import { formatUnits } from "viem";
import { getLogger } from "@logtape/logtape";

import { Listing, Order, OrderedItem } from "@massmarket/schema";
import type { CodecValue } from "@massmarket/utils/codec";
import {
  useActiveOrder,
  useKeycard,
  usePricingCurrency,
  useStateManager,
} from "@massmarket/react-hooks";
import { ListingId, OrderPaymentState } from "../types.ts";
import Button from "./common/Button.tsx";
import BackButton from "./common/BackButton.tsx";

import ErrorMessage from "./common/ErrorMessage.tsx";
import SuccessToast from "./common/SuccessToast.tsx";
import ChevronRight from "./common/ChevronRight.tsx";
import StockMessage from "./common/StockMessage.tsx";

import { getErrLogger } from "../utils/helper.ts";

const baseLogger = getLogger(["mass-market", "frontend", "ListingDetail"]);

export default function ListingDetail() {
  const { pricingCurrency } = usePricingCurrency();
  const { stateManager } = useStateManager();
  const { keycard } = useKeycard();
  const { activeOrder, createOrder, cancelAndRecreateOrder } = useActiveOrder();
  const search = useSearch({ strict: false });
  const itemId = search.itemId as ListingId;
  const [listing, setListing] = useState<Listing>(new Listing());
  const [stock, setStock] = useState<number>(0);
  const [tokenIcon, setIcon] = useState("/icons/usdc-coin.png");
  const [quantity, setQuantity] = useState<number>(1);
  const [errorMsg, setErrorMsg] = useState<null | string>(null);
  const [successMsg, setMsg] = useState<string | null>(null);
  const [displayedImg, setDisplayedImg] = useState<number>(0);
  const location = useLocation();
  const isMerchantRoute = location.pathname.includes("/merchant");
  // set up the logger with information that will be included in error traces when crashes are reported.
  // note: take care with the type of information that is logged, only include traces that are helpful for debugging at
  // this early stage.
  const logger = baseLogger.with({
    listingId: itemId,
    orderId: activeOrder?.ID,
    keycardAddress: keycard?.address,
  });
  const logError = getErrLogger(logger, setErrorMsg);

  useEffect(() => {
    if (!(itemId && pricingCurrency && stateManager)) {
      return;
    }
    //set item details
    stateManager!.get(["Listings", itemId])
      .then((res: CodecValue | undefined) => {
        if (!res) {
          logger.info`Listing ${itemId} not found`;
          throw new Error(`Listing not found`);
        }
        const item = Listing.fromCBOR(res);
        setListing(item);

        if (pricingCurrency?.symbol === "ETH") {
          setIcon("/icons/eth-coin.svg");
        }
      });
    stateManager.get(["Inventory", itemId])
      .then((res: CodecValue | undefined) => {
        if (typeof res !== "number") {
          logger.debug`Inventory is not a number.`;
        }
        setStock(res as number);
      });
    function onListingChange(res: CodecValue) {
      const item = Listing.fromCBOR(res);
      setListing(item);
    }

    stateManager.events.on(onListingChange, ["Listings", itemId]);
    return () => {
      stateManager.events.off(onListingChange, ["Listings", itemId]);
    };
  }, [itemId, pricingCurrency, stateManager]);

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
      let orderId = activeOrder?.ID;
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
      if (activeOrder?.PaymentState !== OrderPaymentState.Open) {
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
            className={`mt-2 ${isMerchantRoute ? "" : "hidden"}`}
          >
            <Button>
              <Link
                to="/merchants/edit-listing"
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
                    <img
                      src="/icons/chevron-left.svg"
                      width={20}
                      height={20}
                      alt="chevron-left"
                      className="w-5 h-5"
                    />
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
                    <img
                      src="/icons/chevron-right.svg"
                      width={20}
                      height={20}
                      alt="chevron-right"
                      className="w-5 h-5"
                    />
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
                {pricingCurrency
                  ? formatUnits(Price, pricingCurrency.decimals)
                  : "Loading price..."}
              </h1>
            </div>
            <div
              className={isMerchantRoute ? "hidden" : "flex gap-2"}
            >
              <div className="flex flex-col gap-2 min-w-full">
                <StockMessage stock={stock} isToast />

                <div>
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
                      data-testid="addToCart"
                      // disabled={!quantity || stock < quantity}
                    >
                      <div className="flex items-center gap-2">
                        <p>Add to cart</p>
                        <img
                          src="/icons/white-arrow.svg"
                          alt="white-arrow"
                          width={7}
                          height={12}
                          style={{
                            display: (quantity && (stock >= quantity))
                              ? ""
                              : "none",
                          }}
                        />
                      </div>
                    </Button>
                  </div>
                </div>
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

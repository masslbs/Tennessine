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

const logger = getLogger(["mass-market", "frontend", "listing-detail"]);

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
  const [displayedImg, setDisplayedImg] = useState<string | null>(null);

  useEffect(() => {
    if (!(itemId && baseToken && stateManager)) {
      return;
    }
    //set item details
    stateManager
      ?.get(["Listings", itemId])
      .then((res: CodecValue | undefined) => {
        if (!res) {
          logger.error`Listing ${itemId} not found`;
          throw new Error(`Listing not found`);
        }
        const item = Listing.fromCBOR(res);
        setListing(item);
        if (item.Metadata.Images && item.Metadata.Images.length > 0) {
          setDisplayedImg(item.Metadata.Images[0]);
        }
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
        logger.error(`Order ${orderId} not found`);
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
      logger.error`Error: changeItems ${error}`;
      setErrorMsg("There was an error updating cart");
    }
  }

  function splitTextByNewlines(input: string) {
    return input.split("\n");
  }

  return (
    <main
      className="bg-gray-100 md:flex justify-center"
      data-testid="listing-detail-page"
    >
      <section className="flex flex-col md:w-[800px] mx-4">
        <ErrorMessage
          errorMessage={errorMsg}
          onClose={() => {
            setErrorMsg(null);
          }}
        />
        <BackButton />
        <div className="my-3">
          <h1 className="flex items-center" data-testid="title">
            {listing.Metadata.Title}
          </h1>
          <div
            className={`mt-2 ${keycard.role === "merchant" ? "" : "hidden"}`}
          >
            <Button>
              <Link
                to="/edit-listing"
                search={(prev: Record<string, string>) => ({
                  shopId: prev.shopId,
                  itemId: listing.ID,
                })}
                style={{
                  color: "white",
                }}
              >
                Edit Product
              </Link>
            </Button>
          </div>
        </div>
        <div className="md:flex md:gap-8">
          <div className="listing-image-container md:w-3/5">
            {displayedImg && (
              <img
                src={displayedImg}
                alt="product-detail-image"
                className="rounded-lg w-full max-h-1/2 md:max-h-[380px]"
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                  border: "none",
                }}
              />
            )}
            {listing.Metadata.Images && listing.Metadata.Images.length > 1
              ? (
                <div className="flex mt-2 gap-2">
                  {listing.Metadata.Images.map((image: string, i: number) => {
                    if (image === displayedImg) return;
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
                        onClick={() => setDisplayedImg(image)}
                      />
                    );
                  })}
                </div>
              )
              : null}
          </div>
          <section className="flex gap-4 flex-col bg-white mt-5 md:mt-0 rounded-md md:w-2/5 p-4">
            <div>
              <h3 className=" ">Description</h3>
              <section data-testid="description">
                {splitTextByNewlines(listing.Metadata.Description).map(
                  (line: string, index: number) => (
                    <p key={`description-${index}`} className="min-h-[1ch]">
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
                {formatUnits(listing.Price, baseToken.decimals)}
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

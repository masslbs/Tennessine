// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { ChangeEvent, useEffect, useState } from "react";
import { Link, useSearch } from "@tanstack/react-router";

import { formatUnitsFromString, logger } from "@massmarket/utils";
import { Listing } from "@massmarket/schema/standin";
import { randUint64 } from "@massmarket/utils";

import { ListingId, OrderId, OrderState } from "../types.ts";
import Button from "./common/Button.tsx";
import BackButton from "./common/BackButton.tsx";
import { useBaseToken } from "../hooks/useBaseToken.ts";
import { useClientWithStateManager } from "../hooks/useClientWithStateManager.ts";
import { useKeycard } from "../hooks/useKeycard.ts";
import ErrorMessage from "./common/ErrorMessage.tsx";
import SuccessToast from "./common/SuccessToast.tsx";
import { useCurrentOrder } from "../hooks/useCurrentOrder.ts";
import { useStateManagerValue } from "../hooks/useStateManager.ts";

const namespace = "frontend:listing-detail";
const debug = logger(namespace);
const errlog = logger(namespace, "error");

export default function ListingDetail() {
  const { baseToken } = useBaseToken();
  const { clientStateManager } = useClientWithStateManager();
  const [keycard] = useKeycard();
  const search = useSearch({ strict: false });
  // const { currentOrder } = useCurrentOrder();
  let itemId = search.itemId as ListingId | "new";
  if (itemId === "new") {
    itemId = randUint64();
  }

  const [item] = useStateManagerValue<Listing>(
    ["Listings", itemId],
    new Listing(new Map([["ItemID", itemId]])),
  );
  const [price, setPrice] = useStateManagerValue<bigint>(
    ["Listings", itemId, "Price"],
    0n,
  );

  const [tokenIcon, setIcon] = useState("/icons/usdc-coin.png");
  const [quantity, setQuantity] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<null | string>(null);
  const [successMsg, setMsg] = useState<string | null>(null);
  const [displayedImg, setDisplayedImg] = useState(null);

  useEffect(() => {
    if (item && baseToken) {
      const price = formatUnitsFromString(
        item.Price.toString(),
        baseToken?.decimals || 0,
      );
      setPrice(price);

      if (item.Metadata?.Images?.length && item.Metadata.Images.length > 0) {
        setDisplayedImg(item.Metadata.Images[0]);
      }

      if (baseToken?.symbol === "ETH") {
        setIcon("/icons/eth-coin.svg");
      } else {
        setIcon("/icons/usdc-coin.png");
      }
    }
  }, [item, baseToken]);

  if (!item) {
    return (
      <main data-testid="listing-detail-page">
        <p>Item not found.</p>
      </main>
    );
  }

  function handlePurchaseQty(e: ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value.replace(/^0+/, "");
    setQuantity(newValue);
  }
  /* TODO: orders
  async function cancelAndCreateOrder() {
    debug(`Cancelling order ID: ${currentOrder!.orderId}`);
    const sm = clientStateManager!.stateManager;
    const [_type, cancelledOrder] = await sm.orders.cancel(
      currentOrder!.orderId,
    );
    // Once order is cancelled, create a new order and add the same items.
    const newOrder = await sm.orders.create();
    debug(`New order created: ${newOrder.id}`);
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
    return newOrder.id;
  }


  async function changeItems() {
    let orderId: OrderId | null = currentOrder?.orderId || null;
    if (
      !orderId
    ) {
      orderId = (await clientStateManager!.stateManager.orders.create()).id;
      debug(`New Order ID: ${orderId}`);
    }
    try {
      if (currentOrder?.status === OrderState.STATE_COMMITTED) {
        orderId = await cancelAndCreateOrder();
      }
      await clientStateManager!.stateManager.orders.addItems(
        orderId,
        [
          { listingId: itemId, quantity: Number(quantity) },
        ],
      );
      setQuantity("");
      setMsg("Added to cart");
    } catch (error) {
      errlog(`Error: changeItems ${error}`);
      setErrorMsg("There was an error updating cart");
    }
  }
  */
  return (
    <main
      className="bg-gray-100 pt-under-nav md:flex justify-center"
      data-testid="listing-detail-page"
    >
      <section className="flex flex-col md:w-2/3 mx-4">
        <ErrorMessage
          errorMessage={errorMsg}
          onClose={() => {
            setErrorMsg(null);
          }}
        />
        <BackButton href="/listings" />
        <div className="my-3">
          <h1 className="flex items-center" data-testid="title">
            {item.Metadata.Title}
          </h1>
          <div
            className={`mt-2 ${keycard.role === "merchant" ? "" : "hidden"}`}
          >
            <Button>
              <Link
                to="/edit-listing"
                search={(prev: Record<string, string>) => ({
                  shopId: prev.shopId,
                  itemId: item.ID.toString(),
                })}
                className="text-white"
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
                className="border rounded-lg w-full max-h-1/2 md:max-h-[380px]"
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            )}
            {item.Metadata.Images && item.Metadata.Images.length > 1
              ? (
                <div className="flex mt-2 gap-2">
                  {item.Metadata.Images.map((image: string, i: number) => {
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
              <p data-testid="description">{item.Metadata.Description}</p>
            </div>
            <div className="flex gap-2 items-center mt-auto">
              <img
                src={tokenIcon}
                alt="coin"
                width={24}
                height={24}
                className="w-6 h-6 max-h-6"
              />
              <h1 data-testid="price">{Number(price).toFixed(2)}</h1>
            </div>
            <div
              className={keycard.role === "merchant" ? "hidden" : "flex gap-2"}
            >
              <div>
                <p className="text-xs text-primary-gray mb-2">Quantity</p>
                <input
                  className="border-2 border-solid p-3 rounded-md max-w-14"
                  id="quantity"
                  name="quantity"
                  value={quantity}
                  data-testid="purchaseQty"
                  type="number"
                  onChange={(e) => handlePurchaseQty(e)}
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={changeItems}
                  disabled={!quantity}
                  data-testid="addToBasket"
                >
                  <div className="flex items-center gap-2">
                    <p>Add to basket</p>
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
            <SuccessToast message={successMsg} onClose={() => setMsg(null)} />
          </section>
        </div>
      </section>
    </main>
  );
}

// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";
import React, { useEffect, useState } from "react";
import { formatUnitsFromString, logger } from "@massmarket/utils";

import { ListingId, Order, OrderId } from "@/types";
import { useStoreContext } from "@/context/StoreContext";
import { useUserContext } from "@/context/UserContext";
import Button from "@/app/common/components/Button";
import SecondaryButton from "@/app/common/components/SecondaryButton";
import ErrorMessage from "@/app/common/components/ErrorMessage";

const namespace = "frontend:Cart";
const debug = logger(namespace);
const logerr = logger(namespace, "error");

function Cart({
  onCheckout,
}: {
  onCheckout?: (orderId: OrderId) => Promise<void>;
}) {
  const { getBaseTokenInfo, getOpenOrderId, openOrderId } = useStoreContext();
  const { clientWithStateManager } = useUserContext();

  const [cartItemsMap, setCartMap] = useState(new Map());
  const [orderId, setOrderId] = useState<OrderId | null>(null);
  const [baseDecimal, setBaseDecimal] = useState<null | number>(null);
  const [baseSymbol, setBaseSymbol] = useState<null | string>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    getBaseTokenInfo().then((res: [string, number]) => {
      res && setBaseDecimal(res[1]);
      res && setBaseSymbol(res[0]);
    });
  }, []);

  useEffect(() => {
    function onChangeItems(order: Order) {
      getCartItemDetails(order).then((itemDetails) => {
        setCartMap(itemDetails);
      });
    }

    clientWithStateManager!.stateManager!.orders.on(
      "changeItems",
      onChangeItems,
    );
    return () => {
      clientWithStateManager!.stateManager!.orders.removeListener(
        "changeItems",
        onChangeItems,
      );
    };
  }, []);

  useEffect(() => {
    // TODO: i think these functions maybe should be useState-like variables
    getOpenOrderId().then((oId: OrderId | null) => {
      if (oId) {
        debug(`Open order ID: ${oId}`);
        setOrderId(oId);
        clientWithStateManager!
          .stateManager!.orders.get(oId)
          .then(async (o) => {
            const itemDetails = await getCartItemDetails(o);
            setCartMap(itemDetails);
          });
      }
    });
  }, []);

  useEffect(() => {
    // If order ID changes in storeContext from event listeners change the order ID here.
    setOrderId(openOrderId);
  }, []);

  async function getCartItemDetails(order: Order) {
    const ci = order.items;
    const cartObjects = new Map();
    // Get price and metadata for all the selected items in the order.
    const itemIds = Object.keys(ci);
    await Promise.all(
      itemIds.map(async (id) => {
        const item = await clientWithStateManager!.stateManager!.listings.get(
          id as ListingId,
        );
        cartObjects.set(id, {
          ...item,
          selectedQty: ci[id as ListingId],
        });
      }),
    );
    return cartObjects;
  }

  async function handleCheckout(orderId: OrderId) {
    try {
      await onCheckout!(orderId);
    } catch (error) {
      if (
        (error instanceof Error &&
          error.message === "not enough items in stock for order") ||
        error.message == "not enough stock" ||
        "not in stock"
      ) {
        setErrorMsg("Not enough stock. Cart cleared.");
        await clearCart();
        return;
      }
      logerr("Error during checkout", error);
    }
  }

  async function clearCart() {
    try {
      const values = Array.from(cartItemsMap.values());
      const map = values.map((item) => {
        // We are getting the quantity to remove from the order for every item in the cart.
        return {
          listingId: item.id,
          quantity: item.selectedQty,
        };
      });
      await clientWithStateManager!.stateManager!.orders.removeItems(
        orderId!,
        map,
      );
      setCartMap(new Map());
      debug("cart cleared");
    } catch (error) {
      logerr("Error clearing cart", error);
    }
  }

  async function addQuantity(id: ListingId) {
    try {
      await clientWithStateManager!.stateManager!.orders.addItems(orderId!, [
        {
          listingId: id,
          quantity: 1,
        },
      ]);
    } catch (error) {
      debug(`Error:addQuantity ${error}`);
    }
  }

  async function removeQuantity(id: ListingId) {
    try {
      await clientWithStateManager!.stateManager!.orders.removeItems(orderId!, [
        {
          listingId: id,
          quantity: 1,
        },
      ]);
    } catch (error) {
      debug(`Error:removeQuantity ${error}`);
    }
  }

  async function removeItem(id: ListingId, selectedQty: number) {
    try {
      await clientWithStateManager!.stateManager!.orders.removeItems(orderId!, [
        {
          listingId: id,
          quantity: selectedQty,
        },
      ]);
    } catch (error) {
      debug(`Error:removeItem ${error}`);
    }
  }
  function calculateTotal() {
    const values = cartItemsMap.values();
    let total = 0;
    Array.from(values).forEach((item) => {
      total += baseDecimal
        ? Number(formatUnitsFromString(item.price, baseDecimal)) *
          item.selectedQty
        : 0;
    });
    return total;
  }
  const icon =
    baseSymbol === "ETH" ? "/icons/eth-coin.svg" : "/icons/usdc-coin.png";

  function renderItems() {
    if (!orderId || !cartItemsMap.size) return <p>No items in cart</p>;

    const values = cartItemsMap.values();
    return Array.from(values).map((item) => {
      const price = baseDecimal
        ? Number(formatUnitsFromString(item.price, baseDecimal)) *
          item.selectedQty
        : 0;
      if (!item.selectedQty) return null;

      return (
        <div key={item.id} className="flex">
          <div className="flex justify-center h-28" data-testid={`product-img`}>
            <img
              src={item.metadata.images[0] || "/assets/no-image.png"}
              width={127}
              height={112}
              alt="product-thumb"
              className="w-32 h-28 object-cover object-center rounded-l-lg"
            />
          </div>
          <div className="bg-background-gray w-full rounded-lg px-5 py-4">
            <div className="flex">
              <h3 data-testid="title" className="leading-4">
                {item.metadata.title}
              </h3>
              <button
                onClick={() => removeItem(item.id, item.selectedQty)}
                className="ml-auto"
              >
                <img
                  src="/icons/close-icon.svg"
                  alt="close-icon"
                  width={12}
                  height={12}
                  className="w-3 h-3"
                />
              </button>
            </div>

            <div className="flex gap-2 items-center mt-10">
              <div className="flex gap-2 items-center">
                <button onClick={() => removeQuantity(item.id)}>
                  <img
                    src="/icons/minus.svg"
                    alt="minus"
                    width={10}
                    height={10}
                    className="w-5 h-5 max-h-5"
                  />
                </button>
                <p>{item.selectedQty}</p>
                <button onClick={() => addQuantity(item.id)}>
                  <img
                    src="/icons/plus.svg"
                    alt="plus"
                    width={10}
                    height={10}
                    className="w-5 h-5 max-h-5"
                  />
                </button>
              </div>
              <div className="flex gap-2 items-center ml-auto">
                <img
                  src={icon}
                  alt="coin"
                  width={20}
                  height={20}
                  className="w-5 h-5 max-h-5"
                />
                <p data-testid="price">{price}</p>
                <p data-testid="symbol">{baseSymbol}</p>
              </div>
            </div>
          </div>
        </div>
      );
    });
  }

  return (
    <div className="bg-white rounded-lg p-5">
      <ErrorMessage
        errorMessage={errorMsg}
        onClose={() => {
          setErrorMsg(null);
        }}
      />
      {renderItems()}
      <div className="mt-2">
        <p>Total Price:</p>
        <div className="flex items-center gap-2">
          <img
            src={icon}
            alt="coin"
            width={20}
            height={20}
            className="w-5 h-5 max-h-5"
          />
          <h1>{calculateTotal()}</h1>
        </div>
      </div>
      <div className="flex gap-4 mt-2">
        <Button
          disabled={!orderId || !cartItemsMap.size || !onCheckout}
          onClick={() => handleCheckout(orderId!)}
        >
          <div className="flex items-center gap-2">
            <p>Checkout</p>
            <img
              src="/icons/white-arrow.svg"
              alt="white-arrow"
              width={7}
              height={12}
              style={{
                display:
                  !orderId || !cartItemsMap.size || !onCheckout ? "none" : "",
              }}
            />
          </div>
        </Button>
        <SecondaryButton
          disabled={!orderId || !cartItemsMap.size}
          onClick={clearCart}
        >
          Clear basket
        </SecondaryButton>
      </div>
    </div>
  );
}

export default Cart;

// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import debugLib from "debug";
import { formatUnitsFromString } from "@massmarket/utils";
import { ItemId, OrderId, OrderState, Order } from "@/types";
import { useStoreContext } from "@/context/StoreContext";
import { useUserContext } from "@/context/UserContext";
import Button from "@/app/common/components/Button";
import SecondaryButton from "@/app/common/components/SecondaryButton";

const debug = debugLib("frontend:Cart");
const log = debugLib("log:Cart");
log.color = "242";

function Cart({
  onCheckout,
}: {
  onCheckout?: (orderId: OrderId) => Promise<void>;
}) {
  const { getBaseTokenInfo } = useStoreContext();
  const { clientWithStateManager } = useUserContext();

  const [cartItemsMap, setCartMap] = useState(new Map());
  const [orderId, setOrderId] = useState<OrderId | null>(null);
  const [baseDecimal, setBaseDecimal] = useState<null | number>(null);
  const [baseSymbol, setBaseSymbol] = useState<null | string>(null);

  useEffect(() => {
    getBaseTokenInfo()
      .then((res: [string, number]) => {
        res && setBaseDecimal(res[1]);
        res && setBaseSymbol(res[0]);
      })
      .catch((e) => debug("error getting base token info %o", e));
  }, []);

  useEffect(() => {
    function txHashDetected(order: Order) {
      if (order.status === OrderState.STATE_PAYMENT_TX) {
        setOrderId(null);
      }
    }
    clientWithStateManager!.stateManager!.orders.on(
      "addPaymentTx",
      txHashDetected,
    );
    return () => {
      clientWithStateManager!.stateManager!.orders.removeListener(
        "addPaymentTx",
        txHashDetected,
      );
    };
  }, []);

  useEffect(() => {
    const cartObjects = new Map();
    clientWithStateManager!
      .stateManager!.orders.getStatus(OrderState.STATE_OPEN)
      .then((res) => {
        if (res.length > 1) {
          debug("Multiple open orders found");
        } else if (!res.length) {
          log("No open order found");
        } else {
          log(`Open orderID:${res[0]}`);
          setOrderId(res[0]);
          clientWithStateManager!
            .stateManager!.orders.get(res[0])
            .then(async (o) => {
              const ci = o.items;
              // Get price and metadata for all the selected items in the order.
              const keys = Object.keys(ci);
              await Promise.all(
                keys.map(async (id) => {
                  return clientWithStateManager!
                    .stateManager!.listings.get(id as ItemId)
                    .then((item) => {
                      cartObjects.set(id, {
                        ...item,
                        selectedQty: ci[id as ItemId],
                      });
                    })
                    .catch((e) => debug("error getting item %o", e));
                }),
              );
              setCartMap(cartObjects);
            })
            .catch((e) => debug("error getting order %o", e));
        }
      })
      .catch((e) => {
        debug("error getting open order %o", e);
      });
  }, [orderId]);

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
      log("cart cleared");
    } catch (error) {
      debug("error clearing cart %o", error);
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
            <Image
              src={item.metadata.images[0] || "/assets/no-image.png"}
              width={127}
              height={112}
              alt="product-thumb"
              unoptimized={true}
              className="w-32 h-28 object-cover object-center rounded-l-lg"
            />
          </div>
          <div className="bg-background-gray w-full rounded-lg px-5 py-4">
            <h3 data-testid="title" className="leading-4">
              {item.metadata.title}
            </h3>
            <div className="flex gap-2 items-center mt-10">
              <div className="flex gap-2 items-center">
                <Image
                  src="/icons/minus.svg"
                  alt="minus"
                  width={10}
                  height={10}
                  unoptimized={true}
                  className="w-5 h-5 max-h-5"
                />
                <p>{item.selectedQty}</p>
                <Image
                  src="/icons/plus.svg"
                  alt="plus"
                  width={10}
                  height={10}
                  unoptimized={true}
                  className="w-5 h-5 max-h-5"
                />
              </div>
              <div className="flex gap-2 items-center ml-auto">
                <Image
                  src="/icons/usdc-coin.png"
                  alt="coin"
                  width={20}
                  height={20}
                  unoptimized={true}
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
      {renderItems()}
      <div className="mt-2">
        <p>Total Price:</p>
        <div className="flex items-center gap-2">
          <Image
            src="/icons/usdc-coin.png"
            alt="coin"
            width={20}
            height={20}
            unoptimized={true}
            className="w-5 h-5 max-h-5"
          />
          <h1>{calculateTotal()}</h1>
        </div>
      </div>
      <div className="flex gap-4 mt-2">
        <Button
          disabled={!orderId || !cartItemsMap.size}
          onClick={() => onCheckout && onCheckout(orderId!)}
        >
          Checkout
        </Button>

        <SecondaryButton onClick={clearCart}>Clear basket</SecondaryButton>
      </div>
    </div>
  );
}

export default Cart;

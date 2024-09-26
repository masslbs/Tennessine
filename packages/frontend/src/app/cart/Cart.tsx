// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useStoreContext } from "@/context/StoreContext";
import { ItemId, OrderId } from "@/types";
import debugLib from "debug";
import { formatUnitsFromString } from "@massmarket/utils";

function Cart() {
  const { stateManager, getBaseTokenInfo, getOrderId } = useStoreContext();
  const [cartItemsMap, setCartMap] = useState(new Map());
  const [orderId, setOrderId] = useState<OrderId | null>(null);
  const [baseDecimal, setBaseDecimal] = useState<null | number>(null);
  const [baseSymbol, setBaseSymbol] = useState<null | string>(null);

  const debug = debugLib("frontend:newCart");

  useEffect(() => {
    getBaseTokenInfo().then((res: [string, number] | null) => {
      res && setBaseDecimal(res[1]);
      res && setBaseSymbol(res[0]);
    });
  }, []);

  useEffect(() => {
    const cartObjects = new Map();
    getOrderId().then(async (orderId) => {
      if (orderId) {
        setOrderId(orderId);
        stateManager.orders
          .get(orderId)
          .then(async (o) => {
            const ci = o.items;
            // Get price and metadata for all the selected items in the order.
            const keys = Object.keys(ci);
            await Promise.all(
              keys.map(async (id) => {
                return stateManager.items
                  .get(id as ItemId)
                  .then((item) => {
                    cartObjects.set(id, {
                      ...item,
                      selectedQty: ci[id as ItemId],
                    });
                  })
                  .catch((e) => debug(e));
              }),
            );
            setCartMap(cartObjects);
          })
          .catch((e) => debug(e));
      }
    });
  }, [orderId]);

  function renderItems() {
    if (!orderId || !cartItemsMap.size) return <p>No items in cart</p>;
    const values = cartItemsMap.values();
    return Array.from(values).map((item) => {
      const price = baseDecimal
        ? Number(formatUnitsFromString(item.price, baseDecimal)) *
          item.selectedQty
        : 0;
      return (
        <div key={item.id} className="flex">
          <div className="flex justify-center h-28" data-testid={`product-img`}>
            <Image
              src={item.metadata.images[0] || "/assets/no-image.png"}
              width={127}
              height={112}
              alt="product-thumb"
              unoptimized={true}
              style={{
                objectFit: "cover",
                objectPosition: "center",
                maxHeight: 112,
                maxWidth: 127,
                borderTopLeftRadius: 12,
                borderBottomLeftRadius: 12,
              }}
              className="w-auto h-auto"
            />
          </div>
          <div className="bg-background-gray w-full rounded-lg px-5 py-4">
            <div className="flex">
              <h3 data-testid="title" className="leading-4">
                {item.metadata.title}
              </h3>
              <Image
                src={`/icons/chevron-right.svg`}
                width={7}
                height={4}
                alt="chevron-right"
                unoptimized={true}
                className="ml-auto w-auto h-auto"
              />
            </div>
            <div className="flex gap-2 items-center">
              <Image
                src="/icons/usdc-coin.png"
                alt="coin"
                width={20}
                height={20}
                unoptimized={true}
                className="w-auto h-auto max-h-5"
              />
              <p data-testid="price">{price}</p>
              <p data-testid="symbol">{baseSymbol}</p>
            </div>
          </div>
        </div>
      );
    });
  }

  return (
    <section>
      <span className="fixed bg-black w-full h-full opacity-60" />
      <div className="fixed bg-background-gray z-10 w-full flex flex-col gap-5 rounded-b-lg p-5">
        <div className="bg-background-gray">
          <div className="bg-white rounded-lg p-5">{renderItems()}</div>
        </div>
      </div>
    </section>
  );
}

export default Cart;

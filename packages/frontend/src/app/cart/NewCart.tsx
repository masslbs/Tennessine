// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useStoreContext } from "@/context/StoreContext";
import Button from "@/app/common/components/Button";
import { ItemId, OrderId, Order } from "@/types";
import { useRouter } from "next/navigation";
import { useMyContext } from "@/context/MyContext";
import debugLib from "debug";

const NewCart = ({
  next,
  orderId,
}: {
  next: () => void;
  orderId: OrderId | null;
}) => {
  const { stateManager, selectedCurrency } = useStoreContext();
  const [cartItemIds, setItemIds] = useState<Order["items"] | null>(null);
  const [cartItemsMap, setCartMap] = useState(new Map());
  const [errorMsg, setErrorMsg] = useState("");
  const [currencySym, setCurrencySym] = useState<string | null>(null);
  const router = useRouter();
  const { getTokenInformation } = useMyContext();
  const symbolSet = useRef(false);
  const debug = debugLib("frontend:newCart");

  useEffect(() => {
    if (orderId && stateManager) {
      const cartObjects = new Map();
      stateManager.orders
        .get(orderId)
        .then(async (o) => {
          const ci = o.items;
          const keys = Object.keys(ci);
          await Promise.all(
            keys.map(async (id) => {
              return stateManager.items
                .get(id as ItemId)
                .then((item) => {
                  cartObjects.set(id, item);
                })
                .catch((e) => debug(e));
            }),
          );
          setCartMap(cartObjects);
          setItemIds(ci);
        })
        .catch((e) => debug(e));
    }
  }, [orderId]);

  useEffect(() => {
    stateManager.manifest
      .get()
      .then(async (shopManifest) => {
        if (shopManifest.setBaseCurrency && !symbolSet.current) {
          symbolSet.current = true;
          getTokenInformation(shopManifest.setBaseCurrency.tokenAddr)
            .then(({ symbol }) => {
              setCurrencySym(symbol);
            })
            .catch((e) => debug(e));
        }
      })
      .catch((e) => {
        debug(e);
      });
  }, []);

  const checkForErrors = () => {
    if (!selectedCurrency) {
      setErrorMsg("You must selected a currency first.");
    } else {
      setErrorMsg("");
    }
  };

  const clearCart = async () => {
    try {
      const ids = Object.keys(cartItemIds!);
      for (const id of ids) {
        await stateManager?.orders.changeItems(orderId!, id as ItemId, 0);
      }
    } catch (error) {
      debug(error);
    }
  };
  const noItems = !orderId || !cartItemIds || !Object.keys(cartItemIds).length;

  const calculateTotal = () => {
    if (noItems) return null;
    let totalPrice: number = 0;
    Array.from([...cartItemsMap.keys()]).map((id) => {
      const selectedQuantity = cartItemIds[id as ItemId] || 0;
      const item = cartItemsMap.get(id);
      if (!item) return null;
      if (selectedQuantity && item.price) {
        const qtyPrice = Number(item.price) * Number(selectedQuantity);
        totalPrice += qtyPrice;
      }
    });

    return totalPrice;
  };
  const renderItems = () => {
    if (noItems) return null;

    return Array.from([...cartItemsMap.keys()]).map((id) => {
      const item = cartItemsMap.get(id as ItemId);

      if (!item || !item.metadata.image) return;
      return (
        <div
          key={item.metadata.title}
          className="flex flex-col items-center gap-3 min-w-24 min-h-30 max-w-24"
          data-testid="title"
        >
          <div className="h-12 flex justify-center text-center">
            <p className="text-xs text-primary-gray text-center text-ellipsis overflow-hidden self-end">
              {item.metadata.title}
            </p>
          </div>
          <div className="border-2 p-3 rounded-xl bg-white">
            <Image
              src={item.metadata.image}
              width={85}
              height={60}
              alt="item-thumbnail"
              unoptimized={true}
              onError={(e) => {
                (e.target as HTMLImageElement).onerror = null;
                (e.target as HTMLImageElement).src = "/assets/no-image.png";
              }}
            />
            <h4>{item.price}</h4>
          </div>
          {/* <input type="checkbox" checked /> */}
        </div>
      );
    });
  };

  return (
    <div className="text-center">
      {errorMsg.length && <p className="text-red-500">{errorMsg}</p>}
      <h2 className="my-4" data-testid="total">
        {calculateTotal()}
      </h2>
      <h2 data-testid="symbol">{currencySym}</h2>
      <Button
        onClick={() => {
          checkForErrors();
          next();
        }}
        disabled={Boolean(!selectedCurrency)}
      >
        Proceed
      </Button>
      <section className="mt-10 flex gap-3 overflow-x-auto no-scrollbar">
        {renderItems()}
      </section>
      <button
        className="text-red-400 mt-6"
        onClick={() => {
          clearCart();
          router.push("/products");
        }}
      >
        Deselect all
      </button>
    </div>
  );
};

export default NewCart;

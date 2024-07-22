// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useStoreContext } from "@/context/StoreContext";
import Button from "@/app/common/components/Button";
import { ItemId } from "@/types";
import { ItemState } from "@/context/types";
import { useRouter } from "next/navigation";
import { useMyContext } from "@/context/MyContext";

const NewCart = ({ next }: { next: () => void }) => {
  const { orderItems, products, orderId, updateOrder } = useStoreContext();
  const [activeCartItems, setActiveCartItems] = useState<ItemState | null>(
    null,
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [baseCurrSymbol, setBaseCurrSymbol] = useState<string | null>(null);
  const router = useRouter();
  const { storeData, selectedCurrency } = useStoreContext();
  const { getTokenInformation } = useMyContext();
  const symbolSet = useRef(false);
  useEffect(() => {
    if (orderId) {
      const items = orderItems.get(orderId)?.items || null;
      setActiveCartItems(items);
    }
  }, [orderId, orderItems]);

  const noItems =
    !orderId || !activeCartItems || !Object.keys(activeCartItems).length;

  useEffect(() => {
    (async () => {
      if (storeData?.baseCurrencyAddr && !symbolSet.current) {
        symbolSet.current = true;
        const { symbol } = await getTokenInformation(
          storeData?.baseCurrencyAddr,
        );
        setBaseCurrSymbol(symbol);
      }
    })();
  }, []);

  const checkForErrors = () => {
    if (!selectedCurrency) {
      setErrorMsg("You must selected a currency first.");
    } else {
      setErrorMsg("");
    }
  };

  const calculateTotal = () => {
    if (noItems) return null;
    // let quantity: number = 0;
    let totalPrice: number = 0;
    Object.keys(activeCartItems).map((id) => {
      const itemId = id as ItemId;
      const item = products.get(itemId);
      if (!item) return;
      const selectedQuantity = activeCartItems[itemId] || 0;
      if (selectedQuantity && item.price) {
        // quantity += Number(selectedQuantity);
        const qtyPrice = Number(item.price) * Number(selectedQuantity);
        totalPrice += qtyPrice;
      }
    });
    return totalPrice;
  };
  const renderItems = () => {
    if (noItems) return null;

    return Object.keys(activeCartItems).map((id) => {
      const itemId = id as ItemId;
      const item = products.get(itemId);
      if (!item || !item.metadata.image) return;
      return (
        <div
          key={item.metadata.name}
          className="flex flex-col items-center gap-3 min-w-24 min-h-30 max-w-24"
        >
          <div className="h-12 flex justify-center text-center">
            <p className="text-xs text-primary-gray text-center text-ellipsis overflow-hidden self-end">
              {item.metadata.name}
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
      <h2 className="my-4">
        {calculateTotal()} {baseCurrSymbol}
      </h2>
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
          updateOrder();
          router.push("/products");
        }}
      >
        Deselect all
      </button>
    </div>
  );
};

export default NewCart;

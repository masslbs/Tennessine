// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useStoreContext } from "@/context/StoreContext";
import Button from "@/app/common/components/Button";
import { ItemId } from "@/types";
import { ItemState } from "@/context/types";

const NewCart = ({ next }: { next }) => {
  const { cartItems, products, cartId } = useStoreContext();

  const [activeCartItems, setActiveCartItems] = useState<ItemState | null>(
    null,
  );

  useEffect(() => {
    if (cartId) {
      const items = cartItems.get(cartId)?.items || null;
      setActiveCartItems(items);
    }
  }, [cartId, cartItems]);

  const noItems =
    !cartId || !activeCartItems || !Object.keys(activeCartItems).length;

  const calculateTotal = () => {
    if (noItems) return null;
    let quantity: number = 0;
    let totalPrice: number = 0;
    Object.keys(activeCartItems).map((id) => {
      const itemId = id as ItemId;
      const item = products.get(itemId);
      if (!item) return;
      const selectedQuantity = activeCartItems[itemId] || 0;
      if (selectedQuantity && item.price) {
        quantity += Number(selectedQuantity);
        const qtyPrice = Number(item.price) * Number(selectedQuantity);
        totalPrice += qtyPrice;
        console.log("after addition", { totalPrice });
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
        <div key={item.metadata.title} className="flex my-4">
          <div className="flex justify-center mr-3">
            <input type="checkbox" checked />
          </div>
          <Image
            src={item.metadata.image}
            width={58}
            height={58}
            alt="item-thumbnail"
            unoptimized={true}
          />
          <div className="flex flex-col ml-4 mr-auto">
            <p>{item.metadata.title}</p>
            <p className="text-xs">{item.metadata.description}</p>
          </div>
        </div>
      );
    });
  };

  return (
    <div>
      <h2 className="text-center my-4">{calculateTotal()} ETH</h2>
      <Button onClick={next}>Proceed</Button>
      <section className="mt-10">
        <p>Deselect all items</p>
        {renderItems()}
      </section>
    </div>
  );
};

export default NewCart;

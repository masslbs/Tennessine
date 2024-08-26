// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useStoreContext } from "@/context/StoreContext";
import Link from "next/link";
import { Order } from "@/types";

const CartButton = () => {
  const { stateManager, getOrderId } = useStoreContext();
  const [cartItemIds, setItemIds] = useState<Order["items"] | null>(null);

  useEffect(() => {
    (async () => {
      const id = await getOrderId();
      const ci = (await stateManager.orders.get(id)).items;
      setItemIds(ci);
    })();
  }, []);

  const cartItemsArr = cartItemIds ? Object.values(cartItemIds) : [];
  let len = 0;
  for (const val of cartItemsArr) {
    len += Number(val);
  }
  return (
    <button>
      <div className="flex gap-3 border rounded-3xl bg-[#AED3FF] shadow-[0_5px_30px_3px_#AED3FF] px-2 py-1">
        <p className="text-sm">{len}</p>
        <Link href="/checkout">
          <Image
            src="/assets/cart.svg"
            alt="see-more-icon"
            width={15}
            height={15}
          />
        </Link>
      </div>
    </button>
  );
};

export default CartButton;

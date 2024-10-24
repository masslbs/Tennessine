// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
// import { useMerchantContext } from "@/context/MerchantContext";
import { useStoreContext } from "@/context/StoreContext";
import Image from "next/image";
import { createQueryString } from "@/app/utils";
import { useSearchParams } from "next/navigation";
import { Status, Order, OrderState } from "@/types";
import debugLib from "debug";

const MerchantDashboard = () => {
  const { stateManager } = useStoreContext();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState(new Map());
  const debug = debugLib("frontend:merchantDashboard");

  const getAllOrders = async () => {
    const allOrders = new Map();
    for await (const [id, o] of stateManager.orders.iterator()) {
      if (Object.values(OrderState).includes(id)) {
        allOrders.set(id, o);
      }
    }
    return allOrders;
  };

  useEffect(() => {
    const onCreateOrder = (order: Order) => {
      orders.set(order.id, order);
      setOrders(orders);
    };
    const onUpdateOrder = (order: Order) => {
      orders.set(order.id, order);
      setOrders(orders);
    };
    getAllOrders()
      .then((allOrders) => {
        setOrders(allOrders);
        stateManager.orders.on("create", onCreateOrder);
        stateManager.orders.on("update", onUpdateOrder);
      })
      .catch((e) => {
        debug(e);
      });

    return () => {
      // Cleanup listeners on unmount
      stateManager.orders.removeListener("create", onCreateOrder);
      stateManager.orders.removeListener("update", onUpdateOrder);
    };
  }, []);

  const renderTransactions = () => {
    const transactions = Array.from([...orders.entries()]);
    return transactions?.length ? (
      transactions.map((entry) => {
        const cartId = entry[0];
        const value = entry[1];
        const transactionHash = value?.txHash || null;
        if (!value?.items) return null;
        const len = Object.keys(value.items).length;
        const status =
          value.status === Status.Complete
            ? "green"
            : value.status === Status.Failed
              ? "red"
              : "yellow";
        return (
          <div key={cartId}>
            <div className="bg-white border-2 rounded-xl p-3 flex justify-between">
              <p className={`text-${status}-500`}>{value.status}</p>
              <p>{transactionHash?.slice(0, 10)}...</p>
              <p>{len} item(s)</p>
            </div>
          </div>
        );
      })
    ) : (
      <div>
        <p>no transactions</p>
      </div>
    );
  };

  return (
    <main className="pt-under-nav h-screen">
      <div className="flex flex-col justify-between mx-4 mt-4">
        <div className="mb-4">
          <h1>Dashboard</h1>
          <div className="flex flex-col gap-1 pt-4">
            <Link
              className="flex items-center gap-1 p-3 bg-white rounded-md"
              href="/products"
            >
              <p> View products</p>
              <Image
                src={`/icons/chevron-right.svg`}
                width={8}
                height={8}
                alt="chevron-right"
                unoptimized={true}
                className="w-2 h-2 ml-auto"
              />
            </Link>
            <Link
              className="flex items-center gap-1 p-3 bg-white rounded-md"
              href={`/products/edit?${createQueryString("itemId", "new", searchParams)}`}
            >
              Add new product
              <Image
                src={`/icons/chevron-right.svg`}
                width={8}
                height={8}
                alt="chevron-right"
                unoptimized={true}
                className="w-2 h-2 ml-auto"
              />
            </Link>

            <Link
              href="/store"
              className="flex items-center gap-1 p-3 bg-white rounded-md"
            >
              <p>Shop settings</p>
              <Image
                src={`/icons/chevron-right.svg`}
                width={8}
                height={8}
                alt="chevron-right"
                unoptimized={true}
                className="w-2 h-2 ml-auto"
              />
            </Link>
          </div>
        </div>
        <div className="transactions-container">
          <h2 className="my-4">Transactions</h2>
          {renderTransactions()}
        </div>
      </div>
    </main>
  );
};

export default MerchantDashboard;

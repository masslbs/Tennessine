// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Order, OrderState } from "@/types";
import { createQueryString } from "@/app/utils";
import { useUserContext } from "@/context/UserContext";

const MerchantDashboard = () => {
  const { clientWithStateManager } = useUserContext();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState(new Map());

  const getAllOrders = async () => {
    const allOrders = new Map();
    for await (
      const [
        id,
        o,
      ] of clientWithStateManager!.stateManager!.orders.iterator()
    ) {
      // Exclude orders by status
      if (Object.values(OrderState).includes(id)) {
        return;
      }
      allOrders.set(id, o);
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
        clientWithStateManager!.stateManager!.orders.on(
          "create",
          onCreateOrder,
        );
        clientWithStateManager!.stateManager!.orders.on(
          "update",
          onUpdateOrder,
        );
      });

    return () => {
      // Cleanup listeners on unmount
      clientWithStateManager!.stateManager!.orders.removeListener(
        "create",
        onCreateOrder,
      );
      clientWithStateManager!.stateManager!.orders.removeListener(
        "update",
        onUpdateOrder,
      );
    };
  }, []);

  const renderTransactions = () => {
    const transactions = Array.from([...orders.entries()]);
    return transactions?.length
      ? (
        transactions.map((entry) => {
          const cartId = entry[0];
          const value = entry[1];
          const transactionHash = value?.txHash || value?.blockHash;
          let status;
          switch (value.status) {
            case OrderState.STATE_CANCELED:
              status = "Cancelled";
              break;
            case OrderState.STATE_OPEN:
              status = "Open";
              break;
            case OrderState.STATE_COMMITED:
              status = "Committed";
              break;
            case OrderState.STATE_PAYMENT_TX:
            case OrderState.STATE_PAID:
              status = "Paid";
              break;
            default:
              status = "Unspecified";
          }
          return (
            <div
              key={cartId}
              className="bg-white border-2  p-3 flex justify-between"
            >
              <p>{transactionHash?.slice(0, 10)}...</p>
              <p>{status}</p>
            </div>
          );
        })
      )
      : (
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
              <p>View products</p>
              <img
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
              href={`/products/edit?${
                createQueryString("itemId", "new", searchParams)
              }`}
            >
              Add new product
              <img
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
              <img
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
          <h2 className="my-4">Latest orders</h2>
          <div className="bg-primary-dark-green flex text-white p-4 rounded-t-xl">
            <p>Order</p>
            <p className="ml-auto">Status</p>
          </div>
          {renderTransactions()}
        </div>
      </div>
    </main>
  );
};

export default MerchantDashboard;

// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import { Order, OrderState } from "@/types";
import { createQueryString } from "@/app/utils";
import { useUserContext } from "@/context/UserContext";
import OrderDetails from "@/app/components/orders/OrderDetails";
import withClient from "@/app/components/withClient";

const MerchantDashboard = () => {
  const { clientWithStateManager } = useUserContext();

  const [orders, setOrders] = useState(new Map());
  const [viewOrderDetails, setOrderDetails] = useState(null);

  const getAllOrders = async () => {
    const allOrders = new Map();
    for await (
      const [
        id,
        o,
      ] of clientWithStateManager.stateManager.orders.iterator()
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
    getAllOrders().then((allOrders) => {
      setOrders(allOrders);
      clientWithStateManager.stateManager.orders.on("create", onCreateOrder);
      clientWithStateManager.stateManager.orders.on("update", onUpdateOrder);
    });

    return () => {
      // Cleanup listeners on unmount
      clientWithStateManager.stateManager.orders.removeListener(
        "create",
        onCreateOrder,
      );
      clientWithStateManager.stateManager.orders.removeListener(
        "update",
        onUpdateOrder,
      );
    };
  }, []);

  const renderTransactions = () => {
    // filter out any orders by statuses, then sort by timestamp
    const transactions = Array.from([...orders.entries()])
      // This checks that orderId is an actual hash, not type OrderState
      .filter((o) => o[0].length > 1)
      .map((entry) => {
        const orderId = entry[0];
        const value = entry[1];
        let date = "";
        if (value.timestamp) {
          date = new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }).format(value.timestamp * 1000);
        }
        let status: string;

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
        return { orderId, date, status, timestamp: value.timestamp ?? 0 };
      })
      .sort((a, b) => b.timestamp - a.timestamp);
    if (!transactions.length) {
      return (
        <div>
          <p>no transactions</p>
        </div>
      );
    }
    return transactions.map((o) => {
      return (
        <div
          key={o.orderId}
          className="bg-white border-2  p-3 flex justify-between"
          onClick={() => setOrderDetails(o.orderId)}
        >
          <p>{o.orderId?.slice(0, 10)}...</p>
          <p>{o.date}</p>
          <p>{o.status}</p>
        </div>
      );
    });
  };

  if (viewOrderDetails) {
    return (
      <OrderDetails
        order={orders.get(viewOrderDetails)}
        onBack={() => setOrderDetails(null)}
      />
    );
  }

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
                className="w-2 h-2 ml-auto"
              />
            </Link>
            <Link
              className="flex items-center gap-1 p-3 bg-white rounded-md"
              href={`/products/edit?${createQueryString("itemId", "new")}`}
            >
              Add new product
              <img
                src={`/icons/chevron-right.svg`}
                width={8}
                height={8}
                alt="chevron-right"
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
                className="w-2 h-2 ml-auto"
              />
            </Link>
          </div>
        </div>
        <div className="transactions-container">
          <h2 className="my-4">Latest orders</h2>
          <div className="bg-primary-dark-green flex text-white p-4 rounded-t-xl">
            <p>Order ID</p>
            <p className="ml-auto">Status</p>
          </div>
          {renderTransactions()}
        </div>
      </div>
    </main>
  );
};

export default withClient(MerchantDashboard);

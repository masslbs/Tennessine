// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

import { Order, OrderState } from "../../types.ts";
import { useClientWithStateManager } from "../../hooks/useClientWithStateManager.ts";

export default function MerchantDashboard() {
  const { clientStateManager } = useClientWithStateManager();

  const [orders, setOrders] = useState(new Map());

  async function getAllOrders() {
    const allOrders = new Map();
    for await (
      const [
        id,
        o,
      ] of clientStateManager!.stateManager.orders.iterator()
    ) {
      // Exclude orders by status
      if (Object.values(OrderState).includes(id)) {
        return;
      }
      allOrders.set(id, o);
    }
    return allOrders;
  }

  useEffect(() => {
    function onCreateOrder(order: Order) {
      orders.set(order.id, order);
      setOrders(orders);
    }
    function onUpdateOrder(order: Order) {
      orders.set(order.id, order);
      setOrders(orders);
    }
    getAllOrders().then((allOrders) => {
      setOrders(allOrders);
      clientStateManager!.stateManager.orders.on("create", onCreateOrder);
      clientStateManager!.stateManager.orders.on("update", onUpdateOrder);
    });

    return () => {
      // Cleanup listeners on unmount
      clientStateManager!.stateManager.orders.removeListener(
        "create",
        onCreateOrder,
      );
      clientStateManager!.stateManager.orders.removeListener(
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
        >
          <p>{o.orderId?.slice(0, 10)}...</p>
          <p>{o.date}</p>
          <p>{o.status}</p>
        </div>
      );
    });
  };

  return (
    <main className="h-screen p-4 pt-under-nav">
      <div className="mb-4">
        <h1>Dashboard</h1>
        <div className="flex flex-col gap-1 pt-4">
          <Link
            className="flex items-center gap-1 p-3 bg-white rounded-md"
            to="/listings"
            search={(prev: Record<string, string>) => ({
              shopId: prev.shopId,
            })}
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
            to="/edit-listing"
            search={(prev: Record<string, string>) => ({
              shopId: prev.shopId,
              itemId: "new",
            })}
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
            to="/settings"
            search={(prev: Record<string, string>) => ({
              shopId: prev.shopId,
            })}
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
    </main>
  );
}

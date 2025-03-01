// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { isHex } from "viem";

import Transactions from "./Transactions.tsx";
import { Order, OrderEventTypes, OrderState } from "../../types.ts";
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
      if (!isHex(id)) {
        continue;
      }

      allOrders.set(id, o);
      orders.set(id, o);
    }
    return allOrders;
  }

  useEffect(() => {
    function onCreateOrder(order: Order) {
      const newOrders = new Map(orders);
      newOrders.set(order.id, order);
      setOrders(newOrders);
    }
    function onUpdateOrder(res: [OrderEventTypes, Order]) {
      const order = res[1];
      const newOrders = new Map(orders);
      newOrders.set(order.id, order);
      setOrders(newOrders);
    }
    getAllOrders().then((allOrders) => {
      setOrders(allOrders);
    });
    clientStateManager!.stateManager.orders.on("create", onCreateOrder);
    clientStateManager!.stateManager.orders.on("update", onUpdateOrder);

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

  return (
    <main
      className="p-4 pt-under-nav h-screen"
      data-testid="merchant-dashboard-page"
    >
      <div className="mb-4">
        <h1>Dashboard</h1>
        <div className="flex flex-col gap-1 pt-4">
          <Link
            className="flex items-center gap-1 p-3 bg-white rounded-md text-black"
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
            className="flex items-center gap-1 p-3 bg-white rounded-md text-black"
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
            to="/settings"
            search={(prev: Record<string, string>) => ({
              shopId: prev.shopId,
            })}
            className="flex items-center gap-1 p-3 bg-white rounded-md text-black"
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
        <Transactions orders={orders} />
      </div>
    </main>
  );
}

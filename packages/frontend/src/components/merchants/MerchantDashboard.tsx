// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

import { Order } from "@massmarket/schema";

import Transactions from "./Transactions.tsx";
import { OrderId } from "../../types.ts";
import { useClientWithStateManager } from "../../hooks/useClientWithStateManager.ts";

export default function MerchantDashboard() {
  const { clientStateManager } = useClientWithStateManager();
  const [orders, setOrders] = useState<Map<OrderId, Order>>(new Map());
  const sm = clientStateManager?.stateManager;

  function mapToOrderClass(orders: Map<OrderId, unknown>) {
    const allOrders = new Map();
    for (
      const [
        id,
        o,
      ] of orders.entries()
    ) {
      allOrders.set(id, new Order(o));
    }
    return allOrders;
  }

  useEffect(() => {
    if (!sm) return;

    function ordersEvent(res: Map<OrderId, unknown>) {
      const allOrders = mapToOrderClass(res);
      setOrders(allOrders);
    }

    sm.get(["Orders"]).then((res) => {
      const allOrders = mapToOrderClass(res);
      setOrders(allOrders);
    });

    sm.events.on(ordersEvent, ["Orders"]);

    return () => {
      sm.events.off(
        ordersEvent,
        ["Orders"],
      );
    };
  }, [sm]);

  return (
    <main
      className="p-4 pt-under-nav md:flex justify-center h-screen"
      data-testid="merchant-dashboard-screen"
    >
      <section className="md:w-[560px]">
        <section className="mb-4">
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
        </section>
        <section className="transactions-container">
          <h2 className="my-4">Latest orders</h2>
          <div className="bg-primary-dark-green flex text-white p-4 rounded-t-xl">
            <p>Order ID</p>
            <p className="ml-auto">Status</p>
          </div>
          <Transactions orders={orders} />
        </section>
      </section>
    </main>
  );
}

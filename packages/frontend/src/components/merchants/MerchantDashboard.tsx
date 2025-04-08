// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

import { Order } from "@massmarket/schema";

import Transactions from "./Transactions.tsx";
import { OrderId } from "../../types.ts";
import { useStateManager } from "../../hooks/useStateManager.ts";

export default function MerchantDashboard() {
  const { stateManager } = useStateManager();
  const [orders, setOrders] = useState<Map<OrderId, Order>>(new Map());

  function mapToOrderClass(orders: Map<OrderId, unknown>) {
    const allOrders = new Map();
    for (
      const [
        id,
        o,
      ] of orders.entries()
    ) {
      allOrders.set(id, Order.fromCBOR(o));
    }
    return allOrders;
  }

  useEffect(() => {
    if (!stateManager) return;

    function ordersEvent(res: Map<OrderId, unknown>) {
      const allOrders = mapToOrderClass(res);
      setOrders(allOrders);
    }

    stateManager.get(["Orders"]).then((res: Map<OrderId, unknown>) => {
      const allOrders = mapToOrderClass(res);
      setOrders(allOrders);
    });

    stateManager.events.on(ordersEvent, ["Orders"]);

    return () => {
      stateManager.events.off(
        ordersEvent,
        ["Orders"],
      );
    };
  }, [stateManager]);

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
              className="flex items-center gap-1 p-3 bg-white rounded-md"
              to="/edit-listing"
              search={(prev: Record<string, string>) => ({
                shopId: prev.shopId,
              })}
              style={{ color: "black" }}
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
              className="flex items-center gap-1 p-3 bg-white rounded-md"
              to="/listings"
              search={(prev: Record<string, string>) => ({
                shopId: prev.shopId,
              })}
              style={{ color: "black" }}
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
              className="flex items-center gap-1 p-3 bg-white rounded-md"
              style={{ color: "black" }}
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

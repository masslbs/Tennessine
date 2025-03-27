import { useEffect, useState } from "react";
import { Order } from "@massmarket/schema";

import { useClientWithStateManager } from "../../hooks/useClientWithStateManager.ts";
import { OrderId } from "../../types.ts";
import Transactions from "./Transactions.tsx";

export default function Orders() {
  const { clientStateManager } = useClientWithStateManager();

  const [orders, setOrders] = useState<Map<OrderId, Order>>(new Map());
  const sm = clientStateManager?.stateManager;

  function getAllOrders(orders: Map<OrderId, unknown>) {
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

    function onUpdateOrder(orders: Map<OrderId, unknown>) {
      const allOrders = getAllOrders(orders);
      setOrders(allOrders);
    }

    sm.get(["Orders"]).then((orders: Map<OrderId, unknown>) => {
      const allOrders = getAllOrders(orders);
      setOrders(allOrders);
      sm.events.on(onUpdateOrder, ["Orders"]);
    });

    return () => {
      sm.events.off(
        onUpdateOrder,
        ["Orders"],
      );
    };
  }, []);

  return (
    <main className="p-4 pt-under-nav">
      <div className="transactions-container">
        <h2>Manage Orders</h2>
        <div className="bg-primary-dark-green flex text-white p-4 rounded-t-xl mt-4">
          <p>Order ID</p>
          <p className="ml-auto">Status</p>
        </div>
        <Transactions orders={orders} />
      </div>
    </main>
  );
}

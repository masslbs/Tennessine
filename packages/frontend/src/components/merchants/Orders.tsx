import { useEffect, useState } from "react";

import { Order } from "@massmarket/schema";
import { CodecKey, CodecValue } from "@massmarket/utils/codec";

import { OrderId } from "../../types.ts";
import Transactions from "./Transactions.tsx";
import { useStateManager } from "../../hooks/useStateManager.ts";

export default function Orders() {
  const { stateManager } = useStateManager();

  const [orders, setOrders] = useState<Map<OrderId, Order>>(new Map());

  function getAllOrders(o: Map<CodecKey, CodecValue>) {
    const allOrders = new Map();
    for (const [id, order] of o.entries()) {
      allOrders.set(id, Order.fromCBOR(order));
    }
    return allOrders;
  }

  useEffect(() => {
    if (!stateManager) return;

    function onUpdateOrder(orders: CodecValue | undefined) {
      if (!orders || !(orders instanceof Map)) return;
      const allOrders = getAllOrders(orders);
      setOrders(allOrders);
    }

    stateManager.get(["Orders"]).then((orders: CodecValue | undefined) => {
      if (!orders || !(orders instanceof Map)) return;
      const allOrders = getAllOrders(orders);
      setOrders(allOrders);
    });
    stateManager.events.on(onUpdateOrder, ["Orders"]);

    return () => {
      stateManager.events.off(
        onUpdateOrder,
        ["Orders"],
      );
    };
  }, []);

  return (
    <main className="p-4">
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

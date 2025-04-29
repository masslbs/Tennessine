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
  }, [stateManager]);

  return (
    <main className="p-4 md:flex justify-center">
      <section
        data-testid-="transactions-container"
        className="md:w-[560px]"
      >
        <h1>Manage Orders</h1>
        <div className="bg-primary-dark-green grid grid-cols-5 text-white text-sm p-4 rounded-t-xl mt-4 text-center">
          <p>Order ID</p>
          <p>Date</p>
          <p>Time</p>
          <p>Value</p>
          <p>Status</p>
        </div>
        <Transactions orders={orders} />
      </section>
    </main>
  );
}

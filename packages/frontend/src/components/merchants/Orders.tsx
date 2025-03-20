import { useEffect, useState } from "react";
import { Order } from "@massmarket/schema";

import { useClientWithStateManager } from "../../hooks/useClientWithStateManager.ts";
import { OrderId } from "../../types.ts";
import Transactions from "./Transactions.tsx";

export default function Orders() {
  const { clientStateManager } = useClientWithStateManager();

  const [orders, setOrders] = useState<Map<OrderId, Order>>(new Map());

  function getAllOrders() {
    return clientStateManager!.stateManager.get(["Orders"]).then(
      async (res: Map<OrderId, unknown>) => {
        const allOrders = new Map();
        for await (
          const [
            id,
            o,
          ] of res.entries()
        ) {
          // // Exclude orders by status
          // if (Object.values(OrderState).includes(id)) {
          //   return;
          // }
          allOrders.set(id, new Order(o));
        }
        return allOrders;
      },
    );
  }

  useEffect(() => {
    if (!clientStateManager?.stateManager) return;

    function onCreateOrder(o: unknown) {
      const order = new Order(o);
      orders.set(order.id, order);
      setOrders(orders);
    }

    function onUpdateOrder(o: unknown) {
      const order = new Order(o);
      orders.set(order.id, order);
      setOrders(orders);
    }

    clientStateManager!.stateManager.orders.on("create", onCreateOrder);
    clientStateManager!.stateManager.orders.on("update", onUpdateOrder);

    getAllOrders().then((orders: Map<OrderId, Order>) => {
      setOrders(orders);
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

import { useEffect, useState } from "react";
import { useClientWithStateManager } from "../../hooks/useClientWithStateManager.js";
import { Order, OrderState } from "../../types.js";
import Transactions from "./Transactions.jsx";

export default function Orders() {
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

  return (
    <main className="p-4 pt-under-nav h-screen">
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

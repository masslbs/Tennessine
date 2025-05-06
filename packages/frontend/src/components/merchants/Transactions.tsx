import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

import { Order } from "@massmarket/schema";
import { CodecValue } from "@massmarket/utils/codec";

import { OrderId, OrderState } from "../../types.ts";
import { useStateManager } from "../../hooks/useStateManager.ts";

export default function Transactions() {
  const { stateManager } = useStateManager();
  const [filter, setFilter] = useState<string>("all");
  const [orders, setOrders] = useState<Map<OrderId, Order>>(new Map());

  function mapToOrderClass(orders: CodecValue) {
    if (!(orders instanceof Map)) {
      throw new Error("Orders is not a Map");
    }
    const allOrders = new Map();
    for (
      const [id, o] of orders.entries()
    ) {
      allOrders.set(id, Order.fromCBOR(o));
    }
    return allOrders;
  }

  useEffect(() => {
    if (!stateManager) return;

    function ordersEvent(res: CodecValue) {
      const allOrders = mapToOrderClass(res);
      setOrders(allOrders);
    }

    stateManager.get(["Orders"]).then(
      (res: CodecValue | undefined) => {
        if (!res) return;
        const allOrders = mapToOrderClass(res);
        setOrders(allOrders);
      },
    );

    stateManager.events.on(ordersEvent, ["Orders"]);

    return () => {
      stateManager.events.off(
        ordersEvent,
        ["Orders"],
      );
    };
  }, [stateManager]);

  function renderTransactions() {
    if (!orders.size) {
      return (
        <div data-testid="no-transactions">
          <p>No transactions</p>
        </div>
      );
    }
    const transactions = Array.from([...orders.entries()])
      .filter(([_, value]) => {
        if (filter === "paid") {
          return value.State === OrderState.Paid;
        }
        return true;
      })
      .map(([key, value]) => {
        const ID = key;
        let status: string;
        switch (value.State) {
          case OrderState.Canceled:
            status = "Cancelled";
            break;
          case OrderState.Open:
            status = "Open";
            break;
          case OrderState.Committed:
            status = "Committed";
            break;
          case OrderState.Paid:
            status = "Paid";
            break;
          default:
            status = "Unspecified";
        }
        return { ID, status };
      });

    return transactions.map((o) => {
      return (
        <Link
          data-testid="transaction"
          key={o.ID}
          className="bg-white"
          to="/order-details"
          search={(prev: Record<string, string>) => ({
            shopId: prev.shopId,
            orderId: o.ID,
          })}
          style={{ color: "black" }}
        >
          <div className=" p-3 grid grid-cols-5 text-center">
            <p data-testid={o.ID} className="truncate">
              {o.ID.toString().slice(0, 8)}...
            </p>
            <p className="truncate">-</p>
            <p className="truncate">-</p>
            <p className="truncate">-</p>
            <p data-testid="status" className="truncate">{o.status}</p>
          </div>
        </Link>
      );
    });
  }
  return (
    <section className="transactions-container">
      <section className="flex items-center gap-1">
        <p>Filter:</p>
        <select
          name="filter"
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="paid">Paid</option>
        </select>
      </section>
      <div className="bg-primary-dark-green grid grid-cols-5 text-white text-sm p-4 rounded-t-xl mt-4 text-center">
        <p>Order ID</p>
        <p>Date</p>
        <p>Time</p>
        <p>Value</p>
        <p>Status</p>
      </div>
      {renderTransactions()}
    </section>
  );
}

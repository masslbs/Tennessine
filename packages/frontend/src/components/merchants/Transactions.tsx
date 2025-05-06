import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { formatUnits } from "viem";

import { Order } from "@massmarket/schema";
import { CodecValue } from "@massmarket/utils/codec";

import { OrderId, OrderState } from "../../types.ts";
import { useStateManager } from "../../hooks/useStateManager.ts";
import { useBaseToken } from "../../hooks/useBaseToken.ts";
import { formatDate, OrderStateFromNumber } from "../../utils/helper.ts";

export default function Transactions(
  { displayFive }: { displayFive?: boolean },
) {
  const { stateManager } = useStateManager();
  const { baseToken } = useBaseToken();

  const [filter, setFilter] = useState<string>("all");
  const [sort, setSort] = useState<string>("oldest");
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
      }).sort((a, b) => {
        if (!a[1].PaymentDetails) return 1;
        if (!b[1].PaymentDetails) return -1;

        if (sort === "oldest") {
          return a[1].PaymentDetails.TTL - b[1].PaymentDetails.TTL;
        }
        return b[1].PaymentDetails.TTL - a[1].PaymentDetails.TTL;
      });

    const displayTransactions = displayFive
      ? transactions.slice(0, 5)
      : transactions;

    return displayTransactions.map(([key, value]) => {
      const ID = key;
      let date = "-";
      let time = "-";
      let total = "-";
      if (value.PaymentDetails) {
        const d = formatDate(value.PaymentDetails!.TTL).split(",");
        date = d[0];
        time = d[1];

        total = `${
          formatUnits(BigInt(value.PaymentDetails.Total), baseToken.decimals)
        } ${baseToken.symbol}`;
      }

      return (
        <Link
          data-testid="transaction"
          key={ID}
          to="/order-details"
          search={(prev: Record<string, string>) => ({
            shopId: prev.shopId,
            orderId: ID,
          })}
          style={{ color: "black" }}
        >
          <div className=" p-3 grid grid-cols-5 text-center bg-white">
            <p data-testid={ID} className="truncate">
              {ID.toString().slice(0, 8)}...
            </p>
            <p className="truncate">{date}</p>
            <p className="truncate">{time}</p>
            <p className="truncate">{total}</p>
            <p data-testid="status" className="truncate">
              {OrderStateFromNumber(value.State)}
            </p>
          </div>
        </Link>
      );
    });
  }
  return (
    <section className="transactions-container">
      <section className="flex items-center gap-4">
        <div className="flex items-center gap-1">
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
        </div>
        <div className="flex items-center gap-1">
          <p>Sort:</p>
          <select
            name="date"
            id="date"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
            }}
          >
            <option value="oldest">Oldest</option>
            <option value="newest">Newest</option>
          </select>
        </div>
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

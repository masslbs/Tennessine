import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { formatUnits } from "viem";
import { getLogger } from "@logtape/logtape";

import { Order } from "@massmarket/schema";
import { CodecValue } from "@massmarket/utils/codec";
import {
  usePricingCurrency,
  useShopId,
  useStateManager,
} from "@massmarket/react-hooks";

import { OrderId, OrderPaymentState } from "../../types.ts";
import { formatDate, OrderPaymentStateFromNumber } from "../../utils/helper.ts";

const baseLogger = getLogger(["mass-market", "frontend", "Transactions"]);

export default function Transactions(
  { displayLastFour }: { displayLastFour?: boolean },
) {
  const { stateManager } = useStateManager();
  const { pricingCurrency } = usePricingCurrency();
  const { shopId } = useShopId();

  const [filter, setFilter] = useState<string>("all");
  const [sort, setSort] = useState<string>("oldest");
  const [orders, setOrders] = useState<Map<OrderId, Order>>(new Map());

  const logger = baseLogger.with({
    shopId,
  });

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
      logger.debug`Orders event received.`;
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
    if (!pricingCurrency) {
      logger.debug`No pricing currency found`;
      return;
    }
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
          return value.PaymentState === OrderPaymentState.Paid;
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

    const displayTransactions = displayLastFour
      ? transactions.slice(0, 4)
      : transactions;

    return displayTransactions.map(([key, value], index) => {
      const ID = key;
      let date = "-";
      let time = "-";
      let total = "-";
      if (value.PaymentDetails) {
        const d = formatDate(value.PaymentDetails!.TTL).split(",");
        date = d[0];
        time = d[1];

        total = `${
          formatUnits(
            BigInt(value.PaymentDetails.Total),
            pricingCurrency.decimals,
          )
        } ${pricingCurrency.symbol}`;
      }

      return (
        <Link
          data-testid="transaction"
          key={ID}
          to="/merchants/order-details"
          search={(prev: Record<string, string>) => ({
            shopId: prev.shopId,
            orderId: ID,
          })}
          style={{ color: "black" }}
        >
          <div
            className={`p-3 grid grid-cols-5 text-center ${
              index % 2 === 0 ? "bg-white" : "bg-background-gray"
            }`}
            data-testid={ID}
          >
            <p className="truncate">
              {ID.toString()}
            </p>
            <p className="truncate">{date}</p>
            <p className="truncate">{time}</p>
            <p className="truncate">{total}</p>
            <p data-testid="status" className="truncate">
              {OrderPaymentStateFromNumber(value.PaymentState)}
            </p>
          </div>
        </Link>
      );
    });
  }
  return (
    <section
      id="transactions-container"
      className="font-inter text-sm bg-white p-3 rounded-lg"
    >
      <section className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <p>Filter:</p>
          <select
            name="filter"
            id="filter"
            className="cursor-pointer"
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
            className="cursor-pointer"
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

      <div className="bg-primary-dark-green grid grid-cols-5 text-white text-sm py-3 rounded-t-xl mt-4 text-center">
        <p>Order</p>
        <p>Date</p>
        <p>Time</p>
        <p>Value</p>
        <p>Status</p>
      </div>
      {renderTransactions()}
    </section>
  );
}

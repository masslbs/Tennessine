import { Link } from "@tanstack/react-router";
import { OrderState, TOrder } from "../../types.ts";

export default function Transactions(
  { orders }: { orders: Map<string, TOrder> },
) {
  // filter out any orders by statuses, then sort by timestamp
  const transactions = Array.from([...orders.entries()])
    // This checks that orderId is an actual hash, not type OrderState
    .filter((o) => o[0].length > 1)
    .map((entry) => {
      const orderId = entry[0];
      const value = entry[1];
      let date = "";
      if (value.timestamp) {
        date = new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(value.timestamp * 1000);
      }
      let status: string;
      switch (value.status) {
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
      return { orderId, date, status, timestamp: value.timestamp ?? 0 };
    })
    .sort((a, b) => b.timestamp - a.timestamp);

  if (!transactions.length) {
    return (
      <div data-testid="no-transactions">
        <p>no transactions</p>
      </div>
    );
  }
  return transactions.map((o) => {
    return (
      <Link
        data-testid="transaction"
        key={o.orderId}
        className="bg-white border-2  p-3 flex justify-between"
        to="/order-details"
        search={(prev: Record<string, string>) => ({
          shopId: prev.shopId,
          orderId: o.orderId,
        })}
      >
        <p data-testid="id">{o.orderId?.slice(0, 10)}...</p>
        <p data-testid="date">{o.date}</p>
        <p data-testid="status">{o.status}</p>
      </Link>
    );
  });
}

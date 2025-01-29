import { Order, OrderState } from "../../types.ts";

export default function Transactions(
  { orders }: { orders: Map<string, Order> },
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
        case OrderState.STATE_CANCELED:
          status = "Cancelled";
          break;
        case OrderState.STATE_OPEN:
          status = "Open";
          break;
        case OrderState.STATE_COMMITED:
          status = "Committed";
          break;
        case OrderState.STATE_PAYMENT_TX:
        case OrderState.STATE_PAID:
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
      <div>
        <p>no transactions</p>
      </div>
    );
  }
  return transactions.map((o) => {
    return (
      <div
        key={o.orderId}
        className="bg-white border-2  p-3 flex justify-between"
      >
        <p>{o.orderId?.slice(0, 10)}...</p>
        <p>{o.date}</p>
        <p>{o.status}</p>
      </div>
    );
  });
}

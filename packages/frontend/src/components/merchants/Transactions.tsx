import { Link } from "@tanstack/react-router";

import { Order } from "@massmarket/schema";
import { OrderState } from "../../types.ts";

export default function Transactions(
  { orders }: { orders: Map<string, Order> },
) {
  const transactions = Array.from([...orders.entries()])
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
        key={o.ID}
        className="bg-white border-2  p-3 flex justify-between"
        to="/order-details"
        search={(prev: Record<string, string>) => ({
          shopId: prev.shopId,
          orderId: o.ID,
        })}
      >
        <p data-testid={o.ID}>{o.ID}...</p>
        <p data-testid="status">{o.status}</p>
      </Link>
    );
  });
}

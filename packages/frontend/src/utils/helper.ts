import { formatUnits } from "viem";

import { Order } from "@massmarket/schema";

import { ClientWithStateManager } from "../ClientWithStateManager.ts";
import { OrderId, OrderState } from "../types.ts";

export async function cancelAndCreateOrder(
  orderId: OrderId,
  csm: ClientWithStateManager,
) {
  const sm = csm.stateManager!;
  const currentOrder = await sm.get(["Orders", orderId]) as Map<
    string,
    unknown
  >;
  // Cancel current order.
  await sm.set(
    ["Orders", orderId, "State"],
    OrderState.STATE_CANCELED,
  );

  // Create a new order and add the same items.
  const newOrder = new Order();
  const newOrderId = 1;
  newOrder.ID = newOrderId;
  newOrder.State = OrderState.STATE_OPEN;
  newOrder.Items = new Order(currentOrder).Items;
  await sm.set(["Orders", newOrderId], newOrder.asCBORMap());

  return newOrder.ID;
}

export function multiplyAndFormatUnits(
  price: string,
  quantity: number,
  decimals: number,
) {
  return formatUnits(BigInt(price) * BigInt(quantity), decimals);
}

export function removeCachedKeycards() {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.includes("keycard")) {
      const keycard = JSON.parse(localStorage.getItem(key)!);
      if (keycard.role === "guest-new") {
        localStorage.removeItem(key);
        i--;
      }
    }
  }
}

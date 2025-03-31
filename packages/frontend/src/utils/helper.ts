import { formatUnits } from "viem";

import { Order } from "@massmarket/schema";
import { StateManager } from "@massmarket/stateManager";
import { KeycardRole, OrderId, OrderState } from "../types.ts";

export async function cancelAndCreateOrder(
  orderId: OrderId,
  sm: StateManager,
) {
  const currentOrder = await sm.get(["Orders", orderId]) as Map<
    string,
    unknown
  >;
  // Cancel current order.
  await sm.set(
    ["Orders", orderId, "State"],
    OrderState.Canceled,
  );

  // Create a new order and add the same items.
  const newOrder = new Order();
  const newOrderId = 1;
  newOrder.ID = newOrderId;
  newOrder.State = OrderState.Open;
  newOrder.Items = Order.fromCBOR(currentOrder).Items;
  // @ts-ignore TODO: add BaseClass to CodecValue
  await sm.set(["Orders", newOrderId], newOrder);

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
      if (keycard.role === KeycardRole.NEW_GUEST) {
        localStorage.removeItem(key);
        i--;
      }
    }
  }
}
